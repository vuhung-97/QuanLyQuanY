import csv
from typing import Generic, TypeVar

from pydantic import BaseModel
from sqlalchemy import inspect, select
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import Session

from app.database.base import Base


ModelType = TypeVar("ModelType", bound=Base)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)


class CRUDError(Exception):
    pass


class CRUDNotFoundError(CRUDError):
    pass


class CRUDBadRequestError(CRUDError):
    pass


class CRUDConflictError(CRUDError):
    pass


class CRUDDatabaseError(CRUDError):
    pass


class CRUDBase(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    def __init__(self, model: type[ModelType]) -> None:
        self.model = model

    def get_multi(self, db: Session, *, limit: int = 100, offset: int = 0) -> list[ModelType]:
        if limit < 1 or offset < 0:
            raise CRUDBadRequestError("Invalid pagination parameters")

        primary_key = inspect(self.model).primary_key
        statement = select(self.model).order_by(*primary_key).offset(offset).limit(limit)
        return list(db.scalars(statement).all())

    def get(self, db: Session, item_id: str) -> ModelType:
        row = db.get(self.model, self._primary_key_value(item_id))
        if row is None:
            raise CRUDNotFoundError("Item not found")
        return row

    def create(self, db: Session, payload: CreateSchemaType) -> ModelType:
        row = self.model(**self._payload_values(payload))
        db.add(row)
        self._commit(db)
        db.refresh(row)
        return row

    def update(self, db: Session, item_id: str, payload: UpdateSchemaType) -> ModelType:
        row = self.get(db, item_id)
        for field, value in self._payload_values(payload, exclude_unset=True).items():
            if field in self._primary_key_columns():
                continue
            setattr(row, field, value)
        self._commit(db)
        db.refresh(row)
        return row

    def delete(self, db: Session, item_id: str) -> None:
        row = self.get(db, item_id)
        db.delete(row)
        self._commit(db)

    def _primary_key_columns(self) -> list[str]:
        return [column.key for column in inspect(self.model).primary_key]

    def _column_keys(self) -> set[str]:
        return {column.key for column in inspect(self.model).columns}

    def _payload_values(self, payload: BaseModel, *, exclude_unset: bool = False) -> dict[str, object]:
        values = payload.model_dump(exclude_unset=exclude_unset)
        column_keys = self._column_keys()
        return {field: value for field, value in values.items() if field in column_keys}

    def _primary_key_value(self, item_id: str) -> object | tuple[object, ...]:
        pk_columns = list(inspect(self.model).primary_key)
        values = self._split_primary_key(item_id)
        if len(values) != len(pk_columns) or any(value == "" for value in values):
            expected = ",".join(column.key for column in pk_columns)
            raise CRUDBadRequestError(f"Invalid primary key. Expected path value order: {expected}")

        typed_values = tuple(self._coerce_primary_key_value(column, value) for column, value in zip(pk_columns, values))
        return typed_values if len(typed_values) > 1 else typed_values[0]

    def _split_primary_key(self, item_id: str) -> list[str]:
        try:
            rows = list(csv.reader([item_id], skipinitialspace=True))
        except csv.Error as exc:
            raise CRUDBadRequestError("Invalid primary key format") from exc
        return [value.strip() for value in rows[0]] if rows else []

    def _coerce_primary_key_value(self, column: object, value: str) -> object:
        try:
            python_type = column.type.python_type
        except (AttributeError, NotImplementedError):
            return value

        if python_type is str:
            return value

        try:
            return python_type(value)
        except (TypeError, ValueError) as exc:
            raise CRUDBadRequestError(f"Invalid primary key value for {column.key}") from exc

    def _commit(self, db: Session) -> None:
        try:
            db.commit()
        except IntegrityError as exc:
            db.rollback()
            raise CRUDConflictError("Database constraint violation") from exc
        except SQLAlchemyError as exc:
            db.rollback()
            raise CRUDDatabaseError("Database error") from exc

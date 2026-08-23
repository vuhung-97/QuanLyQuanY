import csv
from datetime import date, datetime, timezone
from decimal import Decimal
from typing import Any, Generic, TypeVar

from pydantic import BaseModel, ValidationError
from sqlalchemy import func, inspect, select
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import Session

from app.crud.utils import normalize_payload
from app.database.base import Base
from app.database.nhat_ky_thao_tac import NhatKyThaoTac

_LOG_SKIP_TABLES = {"nhat_ky_thao_tac", "nhat_ky_dang_nhap", "nhat_ky_backup"}


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

    def get_multi(
        self, db: Session, *,
        limit: int = 100, offset: int = 0,
        sort_by: str | None = None,
        sort_desc: bool = False,
    ) -> list[ModelType]:
        if limit < 1 or offset < 0:
            raise CRUDBadRequestError("Invalid pagination parameters")

        statement = select(self.model)

        if sort_by:
            if sort_by not in self._column_keys():
                raise CRUDBadRequestError(f"Invalid sort field: {sort_by}")
            sort_col = getattr(self.model, sort_by)
            statement = statement.order_by(sort_col.desc() if sort_desc else sort_col.asc())
        else:
            primary_key = inspect(self.model).primary_key
            statement = statement.order_by(*primary_key)

        return list(db.scalars(statement.offset(offset).limit(limit)).all())

    def count(self, db: Session) -> int:
        return db.scalar(select(func.count()).select_from(self.model)) or 0

    def get(self, db: Session, item_id: str) -> ModelType:
        row = db.get(self.model, self._primary_key_value(item_id))
        if row is None:
            raise CRUDNotFoundError("Item not found")
        return row

    def create(self, db: Session, payload: CreateSchemaType, nguoi_dung_id: str | None = None, **extra_values: Any) -> ModelType:
        row = self.model(**self._payload_values(payload), **extra_values)
        if nguoi_dung_id and hasattr(self.model, "id_nguoi_dung"):
            row.id_nguoi_dung = nguoi_dung_id
        db.add(row)
        db.flush()
        self._log(db, "CREATE", nguoi_dung_id, du_lieu_moi=self._row_to_dict(row))
        self._commit(db)
        db.refresh(row)
        return row

    def update(self, db: Session, item_id: str, payload: UpdateSchemaType, nguoi_dung_id: str | None = None, **extra_values: Any) -> ModelType:
        row = self.get(db, item_id)
        old = self._row_to_dict(row)
        for field, value in self._payload_values(payload, exclude_unset=True).items():
            if field in self._primary_key_columns():
                continue
            setattr(row, field, value)
        for field, value in extra_values.items():
            setattr(row, field, value)
        self._validate_updated_row(db, row, type(payload))
        db.flush()
        self._log(db, "UPDATE", nguoi_dung_id, du_lieu_cu=old, du_lieu_moi=self._row_to_dict(row))
        self._commit(db)
        db.refresh(row)
        return row

    def delete(self, db: Session, item_id: str, nguoi_dung_id: str | None = None) -> None:
        row = self.get(db, item_id)
        old = self._row_to_dict(row)
        db.delete(row)
        db.flush()
        self._log(db, "DELETE", nguoi_dung_id, du_lieu_cu=old)
        self._commit(db)

    def _row_to_dict(self, row: ModelType) -> dict:
        skip = {"mat_khau_hash"}
        result = {}
        for c in inspect(self.model).columns:
            if c.key in skip:
                continue
            value = getattr(row, c.key)
            if isinstance(value, (date, datetime)):
                value = value.isoformat()
            elif isinstance(value, Decimal):
                value = float(value)
            result[c.key] = value
        return result

    def _log(self, db: Session, hanh_dong: str, nguoi_dung_id: str | None,
             du_lieu_cu: dict | None = None, du_lieu_moi: dict | None = None) -> None:
        if self.model.__tablename__ in _LOG_SKIP_TABLES:
            return
        log = NhatKyThaoTac(
            id_nguoi_dung=nguoi_dung_id,
            thoi_gian=datetime.now(timezone.utc),
            hanh_dong=hanh_dong,
            ten_bang=self.model.__tablename__,
            du_lieu_cu=du_lieu_cu,
            du_lieu_moi=du_lieu_moi,
        )
        db.add(log)
        db.flush()

    def _primary_key_columns(self) -> list[str]:
        return [column.key for column in inspect(self.model).primary_key]

    def _column_keys(self) -> set[str]:
        return {column.key for column in inspect(self.model).columns}

    def _payload_values(self, payload: BaseModel, *, exclude_unset: bool = False) -> dict[str, object]:
        values = payload.model_dump(exclude_unset=exclude_unset)
        normalize_payload(self.model, values)
        column_keys = self._column_keys()
        pk_columns = self._primary_key_columns()
        return {
            field: value for field, value in values.items()
            if field in column_keys and not (field in pk_columns and value is None)
        }

    def _validate_updated_row(self, db: Session, row: ModelType, schema: type[BaseModel]) -> None:
        try:
            schema.model_validate(row)
        except ValidationError as exc:
            db.rollback()
            raise CRUDBadRequestError("Invalid update data") from exc

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

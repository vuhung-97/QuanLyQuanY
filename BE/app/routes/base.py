from importlib import import_module
from collections.abc import Callable
from typing import Any, TypeVar

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, create_model
from sqlalchemy import inspect
from sqlalchemy.orm import Session

from app.crud.base import (
    CRUDBadRequestError,
    CRUDBase,
    CRUDConflictError,
    CRUDDatabaseError,
    CRUDError,
    CRUDNotFoundError,
)
from app.database.session import get_db


ResultType = TypeVar("ResultType")


def serialize_row(row: Any) -> dict[str, Any]:
    return {column.key: getattr(row, column.key) for column in inspect(row.__class__).columns}


def _run_crud(operation: Callable[[], ResultType]) -> ResultType:
    try:
        return operation()
    except CRUDError as exc:
        raise _to_http_exception(exc) from exc


def _to_http_exception(exc: CRUDError) -> HTTPException:
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    if isinstance(exc, CRUDBadRequestError):
        status_code = status.HTTP_400_BAD_REQUEST
    elif isinstance(exc, CRUDNotFoundError):
        status_code = status.HTTP_404_NOT_FOUND
    elif isinstance(exc, CRUDConflictError):
        status_code = status.HTTP_409_CONFLICT
    elif isinstance(exc, CRUDDatabaseError):
        status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    return HTTPException(status_code=status_code, detail=str(exc))


def _schema_class_name(resource: str, suffix: str) -> str:
    return "".join(part.capitalize() for part in resource.split("_")) + suffix


def _resolve_schema(resource: str, suffix: str) -> type[BaseModel]:
    module = import_module(f"app.schemas.{resource}")
    schema_name = _schema_class_name(resource, suffix)
    schema = getattr(module, schema_name, None)
    if not isinstance(schema, type) or not issubclass(schema, BaseModel):
        raise RuntimeError(f"Schema {schema_name} not found in app.schemas.{resource}")
    return schema


def _make_patch_schema(schema: type[BaseModel]) -> type[BaseModel]:
    fields = {name: (field.annotation, None) for name, field in schema.model_fields.items()}
    return create_model(f"{schema.__name__}Patch", __base__=BaseModel, **fields)


def create_crud_router(
    *,
    resource: str,
    crud: CRUDBase[Any, Any, Any],
    create_schema: type[BaseModel] | None = None,
    update_schema: type[BaseModel] | None = None,
    read_schema: type[BaseModel] | None = None,
) -> APIRouter:
    create_schema = create_schema or _resolve_schema(resource, "Create")
    update_schema = update_schema or _resolve_schema(resource, "Update")
    read_schema = read_schema or _resolve_schema(resource, "Read")
    patch_schema = _make_patch_schema(update_schema)

    router = APIRouter(prefix=f"/{resource}", tags=[resource])

    @router.get("", response_model=list[read_schema])
    def list_items(
        db: Session = Depends(get_db),
        limit: int = Query(default=100, ge=1, le=500),
        offset: int = Query(default=0, ge=0),
        sort_by: str | None = Query(default=None),
        sort_desc: bool = Query(default=False),
    ) -> list[read_schema]:
        rows = _run_crud(lambda: crud.get_multi(db, limit=limit, offset=offset, sort_by=sort_by, sort_desc=sort_desc))
        return [serialize_row(row) for row in rows]

    @router.get("/{item_id}", response_model=read_schema)
    def get_item(item_id: str, db: Session = Depends(get_db)) -> read_schema:
        return serialize_row(_run_crud(lambda: crud.get(db, item_id)))

    @router.post("", status_code=status.HTTP_201_CREATED, response_model=read_schema)
    def create_item(payload: create_schema, db: Session = Depends(get_db)) -> read_schema:
        return serialize_row(_run_crud(lambda: crud.create(db, payload)))

    @router.patch("/{item_id}", response_model=read_schema)
    def update_item(payload: patch_schema, item_id: str, db: Session = Depends(get_db)) -> read_schema:
        return serialize_row(_run_crud(lambda: crud.update(db, item_id, payload)))

    @router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
    def delete_item(item_id: str, db: Session = Depends(get_db)) -> None:
        _run_crud(lambda: crud.delete(db, item_id))

    return router

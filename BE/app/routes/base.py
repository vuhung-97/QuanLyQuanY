from importlib import import_module
from collections.abc import Callable
from typing import Any, TypeVar

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
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

    router = APIRouter(prefix=f"/{resource}", tags=[resource])

    @router.get("", response_model=list[read_schema])
    def list_items(
        db: Session = Depends(get_db),
        limit: int = Query(default=100, ge=1, le=500),
        offset: int = Query(default=0, ge=0),
        sort_by: str | None = Query(default=None),
        sort_desc: bool = Query(default=False),
    ) -> list[Any]:
        return _run_crud(lambda: crud.get_multi(db, limit=limit, offset=offset, sort_by=sort_by, sort_desc=sort_desc))

    @router.get("/{item_id}", response_model=read_schema)
    def get_item(item_id: str, db: Session = Depends(get_db)) -> Any:
        return _run_crud(lambda: crud.get(db, item_id))

    @router.post("", status_code=status.HTTP_201_CREATED, response_model=read_schema)
    def create_item(payload: create_schema, db: Session = Depends(get_db)) -> Any:
        return _run_crud(lambda: crud.create(db, payload))

    @router.patch("/{item_id}", response_model=read_schema)
    def update_item(payload: update_schema, item_id: str, db: Session = Depends(get_db)) -> Any:
        return _run_crud(lambda: crud.update(db, item_id, payload))

    @router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
    def delete_item(item_id: str, db: Session = Depends(get_db)) -> None:
        _run_crud(lambda: crud.delete(db, item_id))

    return router

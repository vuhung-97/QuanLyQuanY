from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.auth import get_password_hash
from app.core.dependencies import require_permissions
from app.crud.nguoi_dung import nguoi_dung_crud
from app.database.nguoi_dung import NguoiDung
from app.database.session import get_db
from app.routes.base import _run_crud
from app.crud.utils import normalize_payload
from app.schemas.nguoi_dung import NguoiDungCreate, NguoiDungRead, NguoiDungUpdate


router = APIRouter(prefix="/nguoi_dung", tags=["nguoi_dung"])


def _commit_or_raise(db: Session) -> None:
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Database constraint violation") from exc
    except SQLAlchemyError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Database error") from exc


@router.get("", dependencies=[Depends(require_permissions("nguoi_dung:read"))], response_model=list[NguoiDungRead])
def list_users(
    db: Session = Depends(get_db),
    limit: int = Query(default=100, ge=1, le=500),
    offset: int = Query(default=0, ge=0),
    sort_by: str | None = Query(default=None),
    sort_desc: bool = Query(default=False),
) -> list[Any]:
    return _run_crud(lambda: nguoi_dung_crud.get_multi(db, limit=limit, offset=offset, sort_by=sort_by, sort_desc=sort_desc))


@router.get("/{item_id}", dependencies=[Depends(require_permissions("nguoi_dung:read"))], response_model=NguoiDungRead)
def get_user(item_id: str, db: Session = Depends(get_db)) -> Any:
    return _run_crud(lambda: nguoi_dung_crud.get(db, item_id))


@router.post(
    "",
    dependencies=[Depends(require_permissions("nguoi_dung:create"))],
    status_code=status.HTTP_201_CREATED,
    response_model=NguoiDungRead,
)
def create_user(payload: NguoiDungCreate, db: Session = Depends(get_db)) -> NguoiDung:
    values = payload.model_dump(exclude={"mat_khau"}, exclude_none=True)
    normalize_payload(NguoiDung, values)
    values["mat_khau_hash"] = get_password_hash(payload.mat_khau)
    row = NguoiDung(**values)
    db.add(row)
    _commit_or_raise(db)
    db.refresh(row)
    return row


@router.patch("/{item_id}", dependencies=[Depends(require_permissions("nguoi_dung:update"))], response_model=NguoiDungRead)
def update_user(payload: NguoiDungUpdate, item_id: str, db: Session = Depends(get_db)) -> NguoiDung:
    row = _run_crud(lambda: nguoi_dung_crud.get(db, item_id))
    values = payload.model_dump(exclude_unset=True, exclude={"mat_khau"})
    normalize_payload(NguoiDung, values)
    for field, value in values.items():
        setattr(row, field, value)
    if payload.mat_khau is not None:
        row.mat_khau_hash = get_password_hash(payload.mat_khau)

    _commit_or_raise(db)
    db.refresh(row)
    return row


@router.delete("/{item_id}", dependencies=[Depends(require_permissions("nguoi_dung:delete"))], status_code=status.HTTP_204_NO_CONTENT)
def delete_user(item_id: str, db: Session = Depends(get_db)) -> None:
    _run_crud(lambda: nguoi_dung_crud.delete(db, item_id))

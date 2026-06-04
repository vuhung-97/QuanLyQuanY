from typing import Any

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.auth import get_password_hash, verify_password
from app.core.dependencies import get_current_user, require_permissions
from app.crud.nguoi_dung import nguoi_dung_crud
from app.database.nguoi_dung import NguoiDung
from app.database.nhat_ky_thao_tac import NhatKyThaoTac
from app.database.session import get_db
from app.routes.base import _run_crud
from app.crud.utils import normalize_payload
from app.schemas.nguoi_dung import CapNhatTaiKhoanRequest, DoiMatKhauRequest, NguoiDungCreate, NguoiDungRead, NguoiDungUpdate
from app.services.nguoi_dung_service import attach_vai_tro_name, attach_vai_tro_names


def _row_to_dict(row: NguoiDung) -> dict:
    from sqlalchemy import inspect as sa_inspect
    skip = {"mat_khau_hash"}
    return {
        c.key: getattr(row, c.key)
        for c in sa_inspect(row.__class__).columns
        if c.key not in skip
    }


def _ghi_log_thao_tac(db: Session, hanh_dong: str, id_nguoi_dung: str | None,
                      ten_bang: str, du_lieu_cu: dict | None = None,
                      du_lieu_moi: dict | None = None) -> None:
    log = NhatKyThaoTac(
        id_nguoi_dung=id_nguoi_dung,
        thoi_gian=datetime.now(timezone.utc),
        hanh_dong=hanh_dong,
        ten_bang=ten_bang,
        du_lieu_cu=du_lieu_cu,
        du_lieu_moi=du_lieu_moi,
    )
    db.add(log)
    db.commit()


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
    users = _run_crud(lambda: nguoi_dung_crud.get_multi(db, limit=limit, offset=offset, sort_by=sort_by, sort_desc=sort_desc))
    attach_vai_tro_names(db, users)
    return users


@router.get("/me", response_model=NguoiDungRead)
def get_my_account(
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user),
) -> NguoiDung:
    user = db.get(NguoiDung, current_user.id)
    attach_vai_tro_name(db, user)
    return user


@router.patch("/me")
def update_my_account(
    payload: CapNhatTaiKhoanRequest,
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user),
):
    values = payload.model_dump(exclude_unset=True, exclude_none=True)
    if not values:
        return {"message": "Không có gì để cập nhật"}
    normalize_payload(NguoiDung, values)
    row = db.get(NguoiDung, current_user.id)
    for field, value in values.items():
        setattr(row, field, value)
    _commit_or_raise(db)
    db.refresh(row)
    return {"message": "Cập nhật thông tin thành công"}


@router.post("/me/change-password")
def change_my_password(
    payload: DoiMatKhauRequest,
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user),
):
    if not verify_password(payload.mat_khau_cu, current_user.mat_khau_hash):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Mật khẩu cũ không đúng")
    current_user.mat_khau_hash = get_password_hash(payload.mat_khau_moi)
    _commit_or_raise(db)
    return {"message": "Đổi mật khẩu thành công"}


@router.get("/{item_id}", dependencies=[Depends(require_permissions("nguoi_dung:read"))], response_model=NguoiDungRead)
def get_user(item_id: str, db: Session = Depends(get_db)) -> Any:
    user = _run_crud(lambda: nguoi_dung_crud.get(db, item_id))
    attach_vai_tro_name(db, user)
    return user


@router.post(
    "",
    dependencies=[Depends(require_permissions("nguoi_dung:create"))],
    status_code=status.HTTP_201_CREATED,
    response_model=NguoiDungRead,
)
def create_user(
    payload: NguoiDungCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
) -> NguoiDung:
    values = payload.model_dump(exclude={"mat_khau"}, exclude_none=True)
    normalize_payload(NguoiDung, values)
    values["mat_khau_hash"] = get_password_hash(payload.mat_khau)
    row = NguoiDung(**values)
    db.add(row)
    _commit_or_raise(db)
    db.refresh(row)
    attach_vai_tro_name(db, row)
    _ghi_log_thao_tac(db, "CREATE", current_user.id, "nguoi_dung",
                       du_lieu_moi=_row_to_dict(row))
    return row


@router.patch("/{item_id}", dependencies=[Depends(require_permissions("nguoi_dung:update"))], response_model=NguoiDungRead)
def update_user(
    payload: NguoiDungUpdate,
    item_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
) -> NguoiDung:
    row = _run_crud(lambda: nguoi_dung_crud.get(db, item_id))
    old = _row_to_dict(row)
    values = payload.model_dump(exclude_unset=True, exclude={"mat_khau"})
    normalize_payload(NguoiDung, values)
    for field, value in values.items():
        setattr(row, field, value)
    if payload.mat_khau is not None:
        row.mat_khau_hash = get_password_hash(payload.mat_khau)

    _commit_or_raise(db)
    db.refresh(row)
    attach_vai_tro_name(db, row)
    _ghi_log_thao_tac(db, "UPDATE", current_user.id, "nguoi_dung",
                       du_lieu_cu=old, du_lieu_moi=_row_to_dict(row))
    return row


@router.delete("/{item_id}", dependencies=[Depends(require_permissions("nguoi_dung:delete"))], status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    item_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
) -> None:
    _run_crud(lambda: nguoi_dung_crud.delete(db, item_id, nguoi_dung_id=current_user.id))

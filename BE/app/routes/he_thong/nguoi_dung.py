from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.auth import verify_password, get_password_hash
from app.core.dependencies import get_current_user
from app.crud.nguoi_dung import nguoi_dung_crud
from app.crud.utils import normalize_payload
from app.database.nguoi_dung import NguoiDung
from app.database.session import get_db
from app.routes.base import create_crud_router
from app.schemas.nguoi_dung import (
    CapNhatTaiKhoanRequest,
    DoiMatKhauRequest,
    NguoiDungCreate,
    NguoiDungRead,
)
from app.services.nguoi_dung_service import attach_vai_tro_name, attach_vai_tro_names


def _commit_or_raise(db: Session) -> None:
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Database constraint violation") from exc
    except SQLAlchemyError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Database error") from exc


pre_router = APIRouter()


@pre_router.get("/me", response_model=NguoiDungRead)
def get_my_account(
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user),
) -> NguoiDung:
    user = db.get(NguoiDung, current_user.id)
    attach_vai_tro_name(db, user)
    return user


@pre_router.patch("/me")
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


@pre_router.post("/me/change-password")
def change_my_password(
    payload: DoiMatKhauRequest,
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user),
):
    if not verify_password(payload.mat_khau_cu, current_user.mat_khau_hash):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Mật khẩu cũ không đúng")
    current_user.mat_khau_hash = get_password_hash(payload.mat_khau_moi)
    db.commit()
    return {"message": "Đổi mật khẩu thành công"}


def _attach_vai_tro_name(record, db):
    attach_vai_tro_name(db, record)


def _attach_vai_tro_names(records, db):
    attach_vai_tro_names(db, records)


router = create_crud_router(
    resource="nguoi_dung",
    crud=nguoi_dung_crud,
    pre_router=pre_router,
    create_schema=NguoiDungCreate,
    read_schema=NguoiDungRead,
    read_permission="nguoi_dung:read",
    create_permission="nguoi_dung:create",
    update_permission="nguoi_dung:update",
    delete_permission="nguoi_dung:delete",
    post_get_hook=_attach_vai_tro_name,
    post_list_hook=_attach_vai_tro_names,
)

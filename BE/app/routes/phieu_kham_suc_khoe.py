from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import Field
from sqlalchemy import func, Integer, cast
from sqlalchemy.orm import Session

from app.crud.phieu_kham_suc_khoe import phieu_kham_suc_khoe_crud
from app.database.phieu_kham_suc_khoe import PhieuKhamSucKhoe
from app.database.session import get_db
from app.core.dependencies import require_permissions
from app.routes.base import create_crud_router
from app.schemas.base import SchemaBase
from app.schemas.phieu_kham_suc_khoe import PhieuKhamSucKhoeRead


class TaoMaLayMauRequest(SchemaBase):
    ma_quan_nhan: str = Field(max_length=10)
    ma_lich_kham: str = Field(max_length=10)
    nam: int | None = None


pre_router = APIRouter()


@pre_router.post(
    "/tao-ma-lay-mau",
    dependencies=[Depends(require_permissions("phieu_kham_suc_khoe:create"))],
    status_code=status.HTTP_201_CREATED,
    response_model=PhieuKhamSucKhoeRead,
)
def tao_ma_lay_mau(payload: TaoMaLayMauRequest, db: Session = Depends(get_db)):
    max_code = db.query(func.max(cast(PhieuKhamSucKhoe.ma_lay_mau, Integer))).filter(
        PhieuKhamSucKhoe.ma_lich_kham == payload.ma_lich_kham
    ).scalar()
    next_val = (max_code or 0) + 1
    ma_lay_mau = f"{next_val:04d}"

    phieu = (
        db.query(PhieuKhamSucKhoe)
        .filter(
            PhieuKhamSucKhoe.ma_quan_nhan == payload.ma_quan_nhan,
            PhieuKhamSucKhoe.ma_lich_kham == payload.ma_lich_kham,
        )
        .first()
    )

    if phieu:
        phieu.ma_lay_mau = ma_lay_mau
    else:
        phieu = PhieuKhamSucKhoe(
            ma_quan_nhan=payload.ma_quan_nhan,
            ma_lich_kham=payload.ma_lich_kham,
            nam=payload.nam,
            trang_thai="chua_kham",
            ma_lay_mau=ma_lay_mau,
        )
        db.add(phieu)

    try:
        db.commit()
        db.refresh(phieu)
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Không thể tạo mã lấy máu. Vui lòng thử lại.")

    return phieu


@pre_router.get(
    "/quan-nhan/{ma_quan_nhan}",
    dependencies=[Depends(require_permissions("phieu_kham_suc_khoe:read"))],
    response_model=list[PhieuKhamSucKhoeRead],
)
def get_phieu_history(ma_quan_nhan: str, db: Session = Depends(get_db)):
    return (
        db.query(PhieuKhamSucKhoe)
        .filter(PhieuKhamSucKhoe.ma_quan_nhan == ma_quan_nhan)
        .order_by(PhieuKhamSucKhoe.nam.desc().nullslast(),
                  PhieuKhamSucKhoe.ma_phieu_kham.desc())
        .all()
    )


@pre_router.get(
    "/lich-kham/{ma_lich_kham}",
    dependencies=[Depends(require_permissions("phieu_kham_suc_khoe:read"))],
    response_model=list[PhieuKhamSucKhoeRead],
)
def get_phieu_by_lich_kham(ma_lich_kham: str, db: Session = Depends(get_db)):
    return (
        db.query(PhieuKhamSucKhoe)
        .filter(PhieuKhamSucKhoe.ma_lich_kham == ma_lich_kham)
        .all()
    )


router = create_crud_router(
    resource="phieu_kham_suc_khoe",
    crud=phieu_kham_suc_khoe_crud,
    pre_router=pre_router,
    read_permission="phieu_kham_suc_khoe:read",
    create_permission="phieu_kham_suc_khoe:create",
    update_permission="phieu_kham_suc_khoe:update",
    delete_permission="phieu_kham_suc_khoe:delete",
)

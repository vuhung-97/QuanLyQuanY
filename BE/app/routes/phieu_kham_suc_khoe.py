from fastapi import Depends
from sqlalchemy.orm import Session

from app.crud.phieu_kham_suc_khoe import phieu_kham_suc_khoe_crud
from app.database.phieu_kham_suc_khoe import PhieuKhamSucKhoe
from app.database.session import get_db
from app.core.dependencies import require_permissions
from app.routes.base import create_crud_router
from app.schemas.phieu_kham_suc_khoe import PhieuKhamSucKhoeRead


router = create_crud_router(
    resource="phieu_kham_suc_khoe",
    crud=phieu_kham_suc_khoe_crud,
    read_permission="phieu_kham_suc_khoe:read",
    create_permission="phieu_kham_suc_khoe:create",
    update_permission="phieu_kham_suc_khoe:update",
    delete_permission="phieu_kham_suc_khoe:delete",
)


@router.get(
    "/by-ma-quan-nhan/{ma_quan_nhan}",
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


@router.get(
    "/by-lich-kham/{ma_lich_kham}",
    dependencies=[Depends(require_permissions("phieu_kham_suc_khoe:read"))],
    response_model=list[PhieuKhamSucKhoeRead],
)
def get_phieu_by_lich_kham(ma_lich_kham: str, db: Session = Depends(get_db)):
    return (
        db.query(PhieuKhamSucKhoe)
        .filter(PhieuKhamSucKhoe.ma_lich_kham == ma_lich_kham)
        .all()
    )

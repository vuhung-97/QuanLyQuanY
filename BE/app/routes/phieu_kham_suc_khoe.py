from fastapi import Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.crud.phieu_kham_suc_khoe import phieu_kham_suc_khoe_crud
from app.database.don_vi import DonVi
from app.database.phieu_kham_suc_khoe import PhieuKhamSucKhoe
from app.database.quan_nhan import QuanNhan
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
    "/latest-by-unit/{ma_don_vi}",
    dependencies=[Depends(require_permissions("phieu_kham_suc_khoe:read"))],
    response_model=list[PhieuKhamSucKhoeRead],
)
def get_latest_phieu_by_unit(ma_don_vi: str, db: Session = Depends(get_db)):
    all_units = db.query(DonVi.ma_don_vi, DonVi.ma_don_vi_truc_thuoc).all()
    children_map: dict[str, list[str]] = {}
    for u in all_units:
        if u.ma_don_vi_truc_thuoc:
            children_map.setdefault(u.ma_don_vi_truc_thuoc, []).append(u.ma_don_vi)

    def get_descendants(ma: str) -> list[str]:
        codes = [ma]
        for child in children_map.get(ma, []):
            codes.extend(get_descendants(child))
        return codes

    unit_codes = get_descendants(ma_don_vi)

    subq = (
        db.query(
            PhieuKhamSucKhoe.ma_quan_nhan,
            func.max(PhieuKhamSucKhoe.ma_phieu_kham).label("max_id"),
        )
        .join(QuanNhan, PhieuKhamSucKhoe.ma_quan_nhan == QuanNhan.ma_quan_nhan)
        .filter(QuanNhan.ma_don_vi.in_(unit_codes))
        .group_by(PhieuKhamSucKhoe.ma_quan_nhan)
        .subquery()
    )
    return (
        db.query(PhieuKhamSucKhoe)
        .join(subq, PhieuKhamSucKhoe.ma_phieu_kham == subq.c.max_id)
        .all()
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

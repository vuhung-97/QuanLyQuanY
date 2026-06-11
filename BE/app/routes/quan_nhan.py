from fastapi import Depends
from sqlalchemy.orm import Session

from app.crud.quan_nhan import quan_nhan_crud
from app.database.don_vi import DonVi
from app.database.lich_kham_sk_nam_chi_tiet import LichKhamSkNamChiTiet
from app.database.quan_nhan import QuanNhan
from app.database.session import get_db
from app.routes.base import create_crud_router
from app.schemas.quan_nhan import QuanNhanRead
from app.core.dependencies import require_permissions


router = create_crud_router(
    resource="quan_nhan",
    crud=quan_nhan_crud,
    read_permission="quan_nhan:read",
    create_permission="quan_nhan:create",
    update_permission="quan_nhan:update",
    delete_permission="quan_nhan:delete",
)


@router.get(
    "/by-don-vi/{ma_don_vi}",
    dependencies=[Depends(require_permissions("quan_nhan:read"))],
    response_model=list[QuanNhanRead],
)
def get_quan_nhan_by_don_vi(
    ma_don_vi: str,
    db: Session = Depends(get_db),
):
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
    return db.query(QuanNhan).filter(QuanNhan.ma_don_vi.in_(unit_codes)).all()


@router.get(
    "/by-lich-kham/{ma_lich_kham}",
    dependencies=[Depends(require_permissions("quan_nhan:read"))],
    response_model=list[QuanNhanRead],
)
def get_quan_nhan_by_lich_kham(
    ma_lich_kham: str,
    db: Session = Depends(get_db),
):
    chi_tiet_list = (
        db.query(LichKhamSkNamChiTiet)
        .filter(LichKhamSkNamChiTiet.ma_lich_kham == ma_lich_kham)
        .all()
    )
    if not chi_tiet_list:
        return []

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

    all_codes: set[str] = set()
    for ct in chi_tiet_list:
        all_codes.update(get_descendants(ct.ma_don_vi))

    return (
        db.query(QuanNhan)
        .filter(QuanNhan.ma_don_vi.in_(all_codes))
        .order_by(QuanNhan.ma_don_vi, QuanNhan.ho_ten)
        .all()
    )

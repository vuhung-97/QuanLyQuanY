from fastapi import Depends
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.core.dependencies import require_permissions
from app.crud.chi_tiet_du_tru import chi_tiet_du_tru_crud
from app.database.chi_tiet_du_tru import ChiTietDuTru
from app.database.session import get_db
from app.database.thuoc_vtyt import ThuocVtyt
from app.routes.base import create_crud_router


router = create_crud_router(
    resource="chi_tiet_du_tru",
    crud=chi_tiet_du_tru_crud,
    read_permission="chi_tiet_du_tru:read",
    create_permission="chi_tiet_du_tru:create",
    update_permission="chi_tiet_du_tru:update",
    delete_permission="chi_tiet_du_tru:delete",
)


@router.get(
    "/by-phieu/{ma_phieu_du_tru}",
    dependencies=[Depends(require_permissions("chi_tiet_du_tru:read"))],
)
def get_ct_by_phieu_du_tru(ma_phieu_du_tru: str, db: Session = Depends(get_db)):
    results = (
        db.query(ChiTietDuTru, ThuocVtyt.ten_thuoc_vtyt, ThuocVtyt.don_vi_tinh)
        .outerjoin(ThuocVtyt, ChiTietDuTru.ma_thuoc_vtyt == ThuocVtyt.ma_thuoc_vtyt)
        .filter(ChiTietDuTru.ma_phieu_du_tru == ma_phieu_du_tru)
        .all()
    )
    return [
        {
            "ma_phieu_du_tru": ct.ma_phieu_du_tru,
            "ma_thuoc_vtyt": ct.ma_thuoc_vtyt,
            "so_luong": ct.so_luong,
            "ten_thuoc_vtyt": ten_thuoc,
            "don_vi_tinh": don_vi,
        }
        for ct, ten_thuoc, don_vi in results
    ]

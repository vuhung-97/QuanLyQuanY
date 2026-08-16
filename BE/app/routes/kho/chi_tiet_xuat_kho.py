from fastapi import Depends
from sqlalchemy.orm import Session

from app.core.dependencies import require_permissions
from app.crud.chi_tiet_xuat_kho import chi_tiet_xuat_kho_crud
from app.database.chi_tiet_xuat_kho import ChiTietXuatKho
from app.database.session import get_db
from app.database.thuoc_vtyt import ThuocVtyt
from app.routes.base import create_crud_router


router = create_crud_router(
    resource="chi_tiet_xuat_kho",
    crud=chi_tiet_xuat_kho_crud,
    read_permission="chi_tiet_xuat_kho:read",
    create_permission="chi_tiet_xuat_kho:create",
    update_permission="chi_tiet_xuat_kho:update",
    delete_permission="chi_tiet_xuat_kho:delete",
    enable_read=False,
    enable_update=False,
)


@router.get(
    "/by-phieu/{ma_phieu_xuat}",
    dependencies=[Depends(require_permissions("chi_tiet_xuat_kho:read"))],
)
def get_ct_by_phieu_xuat(ma_phieu_xuat: str, db: Session = Depends(get_db)):
    results = (
        db.query(ChiTietXuatKho, ThuocVtyt.ten_thuoc_vtyt, ThuocVtyt.don_vi_tinh, ThuocVtyt.so_luong)
        .join(ThuocVtyt, ChiTietXuatKho.ma_thuoc_vtyt == ThuocVtyt.ma_thuoc_vtyt)
        .filter(ChiTietXuatKho.ma_phieu_xuat == ma_phieu_xuat)
        .all()
    )
    return [
        {
            "ma_phieu_xuat": ct.ma_phieu_xuat,
            "ma_thuoc_vtyt": ct.ma_thuoc_vtyt,
            "so_luong": ct.so_luong,
            "so_luong_thuc_xuat": ct.so_luong_thuc_xuat,
            "ten_thuoc_vtyt": ten_thuoc,
            "don_vi_tinh": don_vi,
            "so_luong_max": ton_kho,
        }
        for ct, ten_thuoc, don_vi, ton_kho in results
    ]

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import require_permissions
from app.database.chi_tiet_phieu_nhap_kho import ChiTietPhieuNhapKho
from app.database.nguoi_dung import NguoiDung
from app.database.phieu_nhap_kho import PhieuNhapKho
from app.database.session import get_db
from app.database.thuoc_vtyt import ThuocVtyt
from app.crud.phieu_nhap_kho import phieu_nhap_kho_crud
from app.routes.base import create_crud_router


pre_router = APIRouter()


@pre_router.get(
    "/by-phieu-du-tru/{ma_phieu_du_tru}",
    dependencies=[Depends(require_permissions("phieu_nhap_kho:read"))],
)
def get_phieu_nhap_by_phieu_du_tru(ma_phieu_du_tru: str, db: Session = Depends(get_db)):
    phieu_nhap = db.query(PhieuNhapKho).filter(
        PhieuNhapKho.ma_phieu_du_tru == ma_phieu_du_tru
    ).first()

    if not phieu_nhap:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy phiếu nhập kho")

    nguoi_nhap_ho_ten = ""
    if phieu_nhap.nguoi_nhap:
        user = db.get(NguoiDung, phieu_nhap.nguoi_nhap)
        if user:
            nguoi_nhap_ho_ten = user.ho_ten

    chi_tiets = (
        db.query(ChiTietPhieuNhapKho, ThuocVtyt.ten_thuoc_vtyt, ThuocVtyt.don_vi_tinh)
        .outerjoin(ThuocVtyt, ChiTietPhieuNhapKho.ma_thuoc_vtyt == ThuocVtyt.ma_thuoc_vtyt)
        .filter(ChiTietPhieuNhapKho.ma_phieu_nhap == phieu_nhap.ma_phieu_nhap)
        .all()
    )

    return {
        "ma_phieu_nhap": phieu_nhap.ma_phieu_nhap,
        "ma_phieu_du_tru": phieu_nhap.ma_phieu_du_tru,
        "ngay_nhap": str(phieu_nhap.ngay_nhap) if phieu_nhap.ngay_nhap else None,
        "nguoi_nhap": phieu_nhap.nguoi_nhap,
        "nguoi_nhap_ho_ten": nguoi_nhap_ho_ten,
        "chi_tiets": [
            {
                "ma_thuoc_vtyt": ct.ma_thuoc_vtyt,
                "ten_thuoc_vtyt": ten_thuoc or "",
                "don_vi_tinh": don_vi or "",
                "so_luong": ct.so_luong,
            }
            for ct, ten_thuoc, don_vi in chi_tiets
        ],
    }


router = create_crud_router(
    resource="phieu_nhap_kho",
    crud=phieu_nhap_kho_crud,
    pre_router=pre_router,
    read_permission="phieu_nhap_kho:read",
    create_permission="phieu_nhap_kho:create",
    update_permission="phieu_nhap_kho:update",
    delete_permission="phieu_nhap_kho:delete",
)

from sqlalchemy import extract, func
from sqlalchemy.orm import Session

from app.database.chi_tiet_phieu_nhap_kho import ChiTietPhieuNhapKho
from app.database.chi_tiet_xuat_kho import ChiTietXuatKho
from app.database.phieu_nhap_kho import PhieuNhapKho
from app.database.phieu_xuat_kho import PhieuXuatKho
from app.database.thuoc_vtyt import ThuocVtyt


class InventoryReportService:
    def __init__(self, db: Session):
        self.db = db

    def inventory_report(self, thang: int, nam: int) -> dict:
        thuoc_list = self.db.query(ThuocVtyt).order_by(ThuocVtyt.ten_thuoc_vtyt).all()

        danh_sach = []
        for t in thuoc_list:
            nhap = (
                self.db.query(func.coalesce(func.sum(ChiTietPhieuNhapKho.so_luong), 0))
                .join(PhieuNhapKho, ChiTietPhieuNhapKho.ma_phieu_nhap == PhieuNhapKho.ma_phieu_nhap)
                .filter(
                    ChiTietPhieuNhapKho.ma_thuoc_vtyt == t.ma_thuoc_vtyt,
                    extract("year", PhieuNhapKho.ngay_nhap) == nam,
                    extract("month", PhieuNhapKho.ngay_nhap) == thang,
                )
                .scalar()
                or 0
            )

            xuat = (
                self.db.query(func.coalesce(func.sum(ChiTietXuatKho.so_luong), 0))
                .join(PhieuXuatKho, ChiTietXuatKho.ma_phieu_xuat == PhieuXuatKho.ma_phieu_xuat)
                .filter(
                    ChiTietXuatKho.ma_thuoc_vtyt == t.ma_thuoc_vtyt,
                    extract("year", PhieuXuatKho.ngay_thang_nam) == nam,
                    extract("month", PhieuXuatKho.ngay_thang_nam) == thang,
                )
                .scalar()
                or 0
            )

            ton_cuoi = t.so_luong or 0
            ton_dau = ton_cuoi - nhap + xuat

            danh_sach.append({
                "ma_thuoc": t.ma_thuoc_vtyt,
                "ten_thuoc": t.ten_thuoc_vtyt,
                "don_vi": t.don_vi_tinh or "",
                "loai": t.loai,
                "ton_dau_ky": ton_dau,
                "nhap_trong_ky": nhap,
                "xuat_trong_ky": xuat,
                "ton_cuoi_ky": ton_cuoi,
                "han_su_dung": str(t.han_su_dung) if t.han_su_dung else None,
            })

        return {
            "thang": thang,
            "nam": nam,
            "danh_sach": danh_sach,
            "tong_ton_dau": sum(d["ton_dau_ky"] for d in danh_sach),
            "tong_nhap": sum(d["nhap_trong_ky"] for d in danh_sach),
            "tong_xuat": sum(d["xuat_trong_ky"] for d in danh_sach),
            "tong_ton_cuoi": sum(d["ton_cuoi_ky"] for d in danh_sach),
        }

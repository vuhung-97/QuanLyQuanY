from sqlalchemy import extract, func
from sqlalchemy.orm import Session

from app.database.chi_tiet_don_thuoc import ChiTietDonThuoc
from app.database.chi_tiet_phieu_cham_soc import ChiTietPhieuChamSoc
from app.database.chi_tiet_phieu_nhap_kho import ChiTietPhieuNhapKho
from app.database.chi_tiet_xuat_kho import ChiTietXuatKho
from app.database.don_thuoc import DonThuoc
from app.database.kham_benh import KhamBenh
from app.database.phieu_cham_soc import PhieuChamSoc
from app.database.phieu_nhap_kho import PhieuNhapKho
from app.database.phieu_xuat_kho import PhieuXuatKho
from app.database.thuoc_vtyt import ThuocVtyt


class ThuocBaoCaoService:
    def __init__(self, db: Session):
        self.db = db

    def thuoc_da_nhap(self, thang: int | None, nam: int) -> list[dict]:
        nk_filters = [extract("year", PhieuNhapKho.ngay_nhap) == nam]
        if thang is not None:
            nk_filters.append(extract("month", PhieuNhapKho.ngay_nhap) == thang)

        nhap_kho_records = (
            self.db.query(
                ThuocVtyt.ma_thuoc_vtyt,
                ThuocVtyt.ten_thuoc_vtyt,
                ThuocVtyt.don_vi_tinh,
                ThuocVtyt.phan_loai,
                func.coalesce(func.sum(ChiTietPhieuNhapKho.so_luong), 0).label("tong_luong"),
            )
            .join(ChiTietPhieuNhapKho, ThuocVtyt.ma_thuoc_vtyt == ChiTietPhieuNhapKho.ma_thuoc_vtyt)
            .join(PhieuNhapKho, ChiTietPhieuNhapKho.ma_phieu_nhap == PhieuNhapKho.ma_phieu_nhap)
            .filter(*nk_filters)
            .group_by(ThuocVtyt.ma_thuoc_vtyt, ThuocVtyt.ten_thuoc_vtyt, ThuocVtyt.don_vi_tinh, ThuocVtyt.phan_loai)
            .all()
        )

        merged: dict[str, dict] = {}
        for r in nhap_kho_records:
            key = r.ma_thuoc_vtyt
            if key not in merged:
                merged[key] = {
                    "ma_thuoc": r.ma_thuoc_vtyt,
                    "ten_thuoc": r.ten_thuoc_vtyt,
                    "don_vi_tinh": r.don_vi_tinh or "",
                    "phan_loai": r.phan_loai or "",
                    "so_luong": 0,
                }
            merged[key]["so_luong"] += r.tong_luong

        return sorted(merged.values(), key=lambda x: x["so_luong"], reverse=True)

    def thuoc_da_su_dung(self, thang: int | None, nam: int) -> list[dict]:
        # --- Từ đơn thuốc (chỉ tính đã cấp) ---
        dt_filters = [
            extract("year", KhamBenh.ngay_kham) == nam,
            KhamBenh.trang_thai == "đã_nhận_thuốc",
        ]
        if thang is not None:
            dt_filters.append(extract("month", KhamBenh.ngay_kham) == thang)

        don_thuoc_records = (
            self.db.query(
                ThuocVtyt.ma_thuoc_vtyt,
                ThuocVtyt.ten_thuoc_vtyt,
                ThuocVtyt.don_vi_tinh,
                ThuocVtyt.phan_loai,
                func.coalesce(func.sum(ChiTietDonThuoc.so_luong), 0).label("tong_luong"),
            )
            .join(ChiTietDonThuoc, ThuocVtyt.ma_thuoc_vtyt == ChiTietDonThuoc.ma_thuoc_vtyt)
            .join(DonThuoc, ChiTietDonThuoc.ma_don_thuoc == DonThuoc.ma_don_thuoc)
            .join(KhamBenh, DonThuoc.ma_kham_benh == KhamBenh.ma_kham_benh)
            .filter(*dt_filters)
            .group_by(ThuocVtyt.ma_thuoc_vtyt, ThuocVtyt.ten_thuoc_vtyt, ThuocVtyt.don_vi_tinh, ThuocVtyt.phan_loai)
            .all()
        )

        # --- Từ phiếu chăm sóc ---
        cs_filters = [extract("year", PhieuChamSoc.thoi_gian) == nam]
        if thang is not None:
            cs_filters.append(extract("month", PhieuChamSoc.thoi_gian) == thang)

        cham_soc_records = (
            self.db.query(
                ThuocVtyt.ma_thuoc_vtyt,
                ThuocVtyt.ten_thuoc_vtyt,
                ThuocVtyt.don_vi_tinh,
                ThuocVtyt.phan_loai,
                func.coalesce(func.sum(ChiTietPhieuChamSoc.so_luong), 0).label("tong_luong"),
            )
            .join(ChiTietPhieuChamSoc, ThuocVtyt.ma_thuoc_vtyt == ChiTietPhieuChamSoc.ma_thuoc_vtyt)
            .join(PhieuChamSoc, ChiTietPhieuChamSoc.ma_phieu_cs == PhieuChamSoc.ma_phieu_cs)
            .filter(*cs_filters)
            .group_by(ThuocVtyt.ma_thuoc_vtyt, ThuocVtyt.ten_thuoc_vtyt, ThuocVtyt.don_vi_tinh, ThuocVtyt.phan_loai)
            .all()
        )

        # --- Từ phiếu xuất kho ---
        xk_filters = [
            extract("year", PhieuXuatKho.ngay_xuat) == nam,
            PhieuXuatKho.trang_thai == "da_xuat",
        ]
        if thang is not None:
            xk_filters.append(extract("month", PhieuXuatKho.ngay_xuat) == thang)

        xuat_kho_records = (
            self.db.query(
                ThuocVtyt.ma_thuoc_vtyt,
                ThuocVtyt.ten_thuoc_vtyt,
                ThuocVtyt.don_vi_tinh,
                ThuocVtyt.phan_loai,
                func.coalesce(func.sum(ChiTietXuatKho.so_luong_thuc_xuat), 0).label("tong_luong"),
            )
            .join(ChiTietXuatKho, ThuocVtyt.ma_thuoc_vtyt == ChiTietXuatKho.ma_thuoc_vtyt)
            .join(PhieuXuatKho, ChiTietXuatKho.ma_phieu_xuat == PhieuXuatKho.ma_phieu_xuat)
            .filter(*xk_filters)
            .group_by(ThuocVtyt.ma_thuoc_vtyt, ThuocVtyt.ten_thuoc_vtyt, ThuocVtyt.don_vi_tinh, ThuocVtyt.phan_loai)
            .all()
        )

        # --- Merge các nguồn theo mã thuốc ---
        merged: dict[str, dict] = {}
        for r in don_thuoc_records + cham_soc_records + xuat_kho_records:
            key = r.ma_thuoc_vtyt
            if key not in merged:
                merged[key] = {
                    "ma_thuoc": r.ma_thuoc_vtyt,
                    "ten_thuoc": r.ten_thuoc_vtyt,
                    "don_vi_tinh": r.don_vi_tinh or "",
                    "phan_loai": r.phan_loai or "",
                    "so_luong": 0,
                }
            merged[key]["so_luong"] += r.tong_luong

        return sorted(merged.values(), key=lambda x: x["so_luong"], reverse=True)

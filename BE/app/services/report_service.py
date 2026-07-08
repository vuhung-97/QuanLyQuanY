from datetime import date, datetime, timedelta

from sqlalchemy import func, extract
from sqlalchemy.orm import Session

from app.database.benh_an import BenhAn
from app.database.chi_tiet_phieu_nhap_kho import ChiTietPhieuNhapKho
from app.database.chi_tiet_xuat_kho import ChiTietXuatKho
from app.database.dm_nhom_benh import DmNhomBenh
from app.database.don_thuoc import DonThuoc
from app.database.giuong import Giuong
from app.database.kham_benh import KhamBenh
from app.database.phieu_nhap_kho import PhieuNhapKho
from app.database.phieu_xuat_kho import PhieuXuatKho
from app.database.thuoc_vtyt import ThuocVtyt


class ReportService:
    def __init__(self, db: Session):
        self.db = db

    def monthly_medical_report(self, thang: int, nam: int) -> dict:
        base_filter_kham = (
            extract("year", KhamBenh.ngay_kham) == nam,
            extract("month", KhamBenh.ngay_kham) == thang,
        )

        tong_luot_kham = self.db.query(func.count(KhamBenh.ma_kham_benh)).filter(*base_filter_kham).scalar() or 0
        tong_noi_tru = (
            self.db.query(func.count(BenhAn.ma_benh_an))
            .filter(extract("year", BenhAn.ngay_nhap_vien) == nam, extract("month", BenhAn.ngay_nhap_vien) == thang)
            .scalar()
            or 0
        )
        tong_chuyen_tuyen = (
            self.db.query(func.count(KhamBenh.ma_kham_benh))
            .filter(KhamBenh.trang_thai == "chuyển_tuyến", *base_filter_kham)
            .scalar()
            or 0
        )
        tong_don_thuoc = (
            self.db.query(func.count(DonThuoc.ma_don_thuoc))
            .join(KhamBenh, DonThuoc.ma_kham_benh == KhamBenh.ma_kham_benh)
            .filter(*base_filter_kham)
            .scalar()
            or 0
        )

        phan_loai_benh_kham = (
            self.db.query(DmNhomBenh.ma_nhom, DmNhomBenh.ten_nhom, func.count(KhamBenh.ma_kham_benh).label("so_ca"))
            .join(DmNhomBenh, KhamBenh.ma_nhom_benh == DmNhomBenh.ma_nhom, isouter=True)
            .filter(*base_filter_kham)
            .group_by(DmNhomBenh.ma_nhom, DmNhomBenh.ten_nhom)
            .all()
        )

        phan_loai_benh_noi_tru = (
            self.db.query(DmNhomBenh.ma_nhom, DmNhomBenh.ten_nhom, func.count(BenhAn.ma_benh_an).label("so_ca"))
            .join(DmNhomBenh, BenhAn.ma_nhom_benh == DmNhomBenh.ma_nhom, isouter=True)
            .filter(extract("year", BenhAn.ngay_nhap_vien) == nam, extract("month", BenhAn.ngay_nhap_vien) == thang)
            .group_by(DmNhomBenh.ma_nhom, DmNhomBenh.ten_nhom)
            .all()
        )

        total_kham = sum(r.so_ca for r in phan_loai_benh_kham) or 1
        total_noi_tru = sum(r.so_ca for r in phan_loai_benh_noi_tru) or 1

        thang_truoc = thang - 1 if thang > 1 else 12
        nam_truoc = nam if thang > 1 else nam - 1

        so_sanh = self._so_sanh_thang_truoc(thang, nam, thang_truoc, nam_truoc)

        return {
            "thang": thang,
            "nam": nam,
            "tong_quan": {
                "tong_luot_kham": tong_luot_kham,
                "tong_noi_tru": tong_noi_tru,
                "tong_chuyen_tuyen": tong_chuyen_tuyen,
                "tong_don_thuoc": tong_don_thuoc,
            },
            "phan_loai_benh_kham": [
                {"ma_nhom": r.ma_nhom or "", "ten_nhom": r.ten_nhom or "Chưa phân loại", "so_ca": r.so_ca, "ty_le": round(r.so_ca / total_kham * 100, 1)}
                for r in phan_loai_benh_kham
            ],
            "phan_loai_benh_noi_tru": [
                {"ma_nhom": r.ma_nhom or "", "ten_nhom": r.ten_nhom or "Chưa phân loại", "so_ca": r.so_ca, "ty_le": round(r.so_ca / total_noi_tru * 100, 1)}
                for r in phan_loai_benh_noi_tru
            ],
            "so_sanh_thang_truoc": so_sanh,
            "ngay_lap": datetime.now().strftime("%Y-%m-%d"),
            "nguoi_lap": "",
        }

    def _so_sanh_thang_truoc(self, thang: int, nam: int, thang_truoc: int, nam_truoc: int) -> dict:
        def _calc(nam: int, thang: int, field: str) -> int:
            if field == "luot_kham":
                return self.db.query(func.count(KhamBenh.ma_kham_benh)).filter(
                    extract("year", KhamBenh.ngay_kham) == nam, extract("month", KhamBenh.ngay_kham) == thang
                ).scalar() or 0
            elif field == "noi_tru":
                return self.db.query(func.count(BenhAn.ma_benh_an)).filter(
                    extract("year", BenhAn.ngay_nhap_vien) == nam, extract("month", BenhAn.ngay_nhap_vien) == thang
                ).scalar() or 0
            return 0

        def _ty_le(thang_nay: int, thang_truoc: int) -> str:
            if thang_truoc == 0:
                return "N/A"
            delta = round((thang_nay - thang_truoc) / thang_truoc * 100, 1)
            return f"+{delta}%" if delta >= 0 else f"{delta}%"

        luot_kham_nay = _calc(nam, thang, "luot_kham")
        luot_kham_truoc = _calc(nam_truoc, thang_truoc, "luot_kham")
        noi_tru_nay = _calc(nam, thang, "noi_tru")
        noi_tru_truoc = _calc(nam_truoc, thang_truoc, "noi_tru")

        return {
            "luot_kham": {"thang_nay": luot_kham_nay, "thang_truoc": luot_kham_truoc, "thay_doi": _ty_le(luot_kham_nay, luot_kham_truoc)},
            "noi_tru": {"thang_nay": noi_tru_nay, "thang_truoc": noi_tru_truoc, "thay_doi": _ty_le(noi_tru_nay, noi_tru_truoc)},
        }

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

    def daily_stats(self) -> dict:
        hom_nay = date.today()
        ngay_sau = hom_nay + timedelta(days=1)

        luot_kham = (
            self.db.query(func.count(KhamBenh.ma_kham_benh))
            .filter(KhamBenh.ngay_kham >= hom_nay, KhamBenh.ngay_kham < ngay_sau)
            .scalar()
            or 0
        )

        noi_tru = (
            self.db.query(func.count(BenhAn.ma_benh_an))
            .filter(BenhAn.trang_thai == None)
            .scalar()
            or 0
        )

        chuyen_tuyen = (
            self.db.query(func.count(KhamBenh.ma_kham_benh))
            .filter(KhamBenh.trang_thai == "chuyển_tuyến", KhamBenh.ngay_kham >= hom_nay, KhamBenh.ngay_kham < ngay_sau)
            .scalar()
            or 0
        )

        don_thuoc = (
            self.db.query(func.count(DonThuoc.ma_don_thuoc))
            .join(KhamBenh, DonThuoc.ma_kham_benh == KhamBenh.ma_kham_benh)
            .filter(KhamBenh.ngay_kham >= hom_nay, KhamBenh.ngay_kham < ngay_sau)
            .scalar()
            or 0
        )

        tong_giuong = self.db.query(func.count(Giuong.ma_giuong)).scalar() or 0
        giuong_trong = (
            self.db.query(func.count(Giuong.ma_giuong))
            .outerjoin(BenhAn, Giuong.ma_giuong == BenhAn.ma_giuong)
            .filter(BenhAn.ma_benh_an.is_(None))
            .scalar()
            or 0
        )

        tong_thuoc = self.db.query(func.count(ThuocVtyt.ma_thuoc_vtyt)).scalar() or 0

        han_30 = hom_nay + timedelta(days=30)
        sap_het_han = self.db.query(func.count(ThuocVtyt.ma_thuoc_vtyt)).filter(
            ThuocVtyt.han_su_dung.isnot(None),
            ThuocVtyt.han_su_dung <= han_30,
        ).scalar() or 0

        return {
            "hom_nay": {
                "luot_kham": luot_kham,
                "noi_tru": noi_tru,
                "chuyen_tuyen": chuyen_tuyen,
                "don_thuoc": don_thuoc,
            },
            "tong_quan": {
                "tong_giuong": tong_giuong,
                "giuong_trong": giuong_trong,
                "tong_thuoc_vtyt": tong_thuoc,
                "sap_het_han": sap_het_han,
            },
        }

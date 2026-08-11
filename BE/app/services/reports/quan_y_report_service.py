from datetime import datetime

from sqlalchemy import extract, func
from sqlalchemy.orm import Session

from app.database.benh_an import BenhAn
from app.database.dm_nhom_benh import DmNhomBenh
from app.database.don_thuoc import DonThuoc
from app.database.kham_benh import KhamBenh
from app.services.reports.thuoc_bao_cao_service import ThuocBaoCaoService


class QuanYReportService:
    def __init__(self, db: Session):
        self.db = db
        self.thuoc_service = ThuocBaoCaoService(db)

    def monthly_medical_report(self, thang: int, nam: int) -> dict:
        base_filter_kham = (
            extract("year", KhamBenh.ngay_kham) == nam,
            extract("month", KhamBenh.ngay_kham) == thang,
            KhamBenh.trang_thai != "chờ",
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
            "thuoc_da_su_dung": self.thuoc_service.thuoc_da_su_dung(thang, nam),
            "thuoc_da_nhap": self.thuoc_service.thuoc_da_nhap(thang, nam),
            "ngay_lap": datetime.now().strftime("%Y-%m-%d"),
            "nguoi_lap": "",
        }

    def yearly_medical_report(self, nam: int) -> dict:
        base_filter = (
            extract("year", KhamBenh.ngay_kham) == nam,
            KhamBenh.trang_thai != "chờ",
        )

        tong_luot_kham = self.db.query(func.count(KhamBenh.ma_kham_benh)).filter(*base_filter).scalar() or 0
        tong_noi_tru = (
            self.db.query(func.count(BenhAn.ma_benh_an))
            .filter(extract("year", BenhAn.ngay_nhap_vien) == nam)
            .scalar() or 0
        )
        tong_chuyen_tuyen = (
            self.db.query(func.count(KhamBenh.ma_kham_benh))
            .filter(KhamBenh.trang_thai == "chuyển_tuyến", *base_filter)
            .scalar() or 0
        )
        tong_don_thuoc = (
            self.db.query(func.count(DonThuoc.ma_don_thuoc))
            .join(KhamBenh, DonThuoc.ma_kham_benh == KhamBenh.ma_kham_benh)
            .filter(*base_filter)
            .scalar() or 0
        )

        phan_loai_benh_kham = (
            self.db.query(DmNhomBenh.ma_nhom, DmNhomBenh.ten_nhom, func.count(KhamBenh.ma_kham_benh).label("so_ca"))
            .join(DmNhomBenh, KhamBenh.ma_nhom_benh == DmNhomBenh.ma_nhom, isouter=True)
            .filter(*base_filter)
            .group_by(DmNhomBenh.ma_nhom, DmNhomBenh.ten_nhom)
            .all()
        )

        phan_loai_benh_noi_tru = (
            self.db.query(DmNhomBenh.ma_nhom, DmNhomBenh.ten_nhom, func.count(BenhAn.ma_benh_an).label("so_ca"))
            .join(DmNhomBenh, BenhAn.ma_nhom_benh == DmNhomBenh.ma_nhom, isouter=True)
            .filter(extract("year", BenhAn.ngay_nhap_vien) == nam)
            .group_by(DmNhomBenh.ma_nhom, DmNhomBenh.ten_nhom)
            .all()
        )

        total_kham = sum(r.so_ca for r in phan_loai_benh_kham) or 1
        total_noi_tru = sum(r.so_ca for r in phan_loai_benh_noi_tru) or 1

        return {
            "thang": None,
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
            "so_sanh_thang_truoc": None,
            "thuoc_da_su_dung": self.thuoc_service.thuoc_da_su_dung(None, nam),
            "thuoc_da_nhap": self.thuoc_service.thuoc_da_nhap(None, nam),
            "ngay_lap": datetime.now().strftime("%Y-%m-%d"),
            "nguoi_lap": "",
        }

    def _so_sanh_thang_truoc(self, thang: int, nam: int, thang_truoc: int, nam_truoc: int) -> dict:
        def _calc(nam: int, thang: int, field: str) -> int:
            if field == "luot_kham":
                return self.db.query(func.count(KhamBenh.ma_kham_benh)).filter(
                    extract("year", KhamBenh.ngay_kham) == nam,
                    extract("month", KhamBenh.ngay_kham) == thang,
                    KhamBenh.trang_thai != "chờ",
                ).scalar() or 0
            elif field == "noi_tru":
                return self.db.query(func.count(BenhAn.ma_benh_an)).filter(
                    extract("year", BenhAn.ngay_nhap_vien) == nam, extract("month", BenhAn.ngay_nhap_vien) == thang
                ).scalar() or 0
            elif field == "chuyen_tuyen":
                return self.db.query(func.count(KhamBenh.ma_kham_benh)).filter(
                    KhamBenh.trang_thai == "chuyển_tuyến",
                    extract("year", KhamBenh.ngay_kham) == nam,
                    extract("month", KhamBenh.ngay_kham) == thang,
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
        chuyen_tuyen_nay = _calc(nam, thang, "chuyen_tuyen")
        chuyen_tuyen_truoc = _calc(nam_truoc, thang_truoc, "chuyen_tuyen")

        return {
            "luot_kham": {"thang_nay": luot_kham_nay, "thang_truoc": luot_kham_truoc, "thay_doi": _ty_le(luot_kham_nay, luot_kham_truoc)},
            "noi_tru": {"thang_nay": noi_tru_nay, "thang_truoc": noi_tru_truoc, "thay_doi": _ty_le(noi_tru_nay, noi_tru_truoc)},
            "chuyen_tuyen": {"thang_nay": chuyen_tuyen_nay, "thang_truoc": chuyen_tuyen_truoc, "thay_doi": _ty_le(chuyen_tuyen_nay, chuyen_tuyen_truoc)},
        }
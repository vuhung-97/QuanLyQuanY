from datetime import date, datetime, timedelta

from sqlalchemy import distinct, func, extract, or_
from sqlalchemy.orm import Session

from app.database.benh_an import BenhAn
from app.database.chi_tiet_don_thuoc import ChiTietDonThuoc
from app.database.chi_tiet_phieu_cham_soc import ChiTietPhieuChamSoc
from app.database.chi_tiet_phieu_nhap_kho import ChiTietPhieuNhapKho
from app.database.chi_tiet_xuat_kho import ChiTietXuatKho
from app.database.di_tuyen_sau_dieu_tri import DiTuyenSauDieuTri
from app.database.dm_nhom_benh import DmNhomBenh
from app.database.don_thuoc import DonThuoc
from app.database.don_vi import DonVi
from app.database.giay_gioi_thieu import GiayGioiThieu
from app.database.giuong import Giuong
from app.database.kham_benh import KhamBenh
from app.database.lich_kham_sk_nam import LichKhamSkNam
from app.database.phieu_cham_soc import PhieuChamSoc
from app.database.phieu_du_tru import PhieuDuTru
from app.database.phieu_nhap_kho import PhieuNhapKho
from app.database.phieu_xuat_kho import PhieuXuatKho
from app.database.quan_nhan import QuanNhan
from app.database.thuoc_vtyt import ThuocVtyt


class ReportService:
    def __init__(self, db: Session):
        self.db = db

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
            "thuoc_da_su_dung": self._thuoc_da_su_dung(thang, nam),
            "thuoc_da_nhap": self._thuoc_da_nhap(thang, nam),
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
            "thuoc_da_su_dung": self._thuoc_da_su_dung(None, nam),
            "thuoc_da_nhap": self._thuoc_da_nhap(None, nam),
            "ngay_lap": datetime.now().strftime("%Y-%m-%d"),
            "nguoi_lap": "",
        }

    def _thuoc_da_nhap(self, thang: int | None, nam: int) -> list[dict]:
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

    def _thuoc_da_su_dung(self, thang: int | None, nam: int) -> list[dict]:
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
            extract("year", PhieuXuatKho.ngay_thang_nam) == nam,
            PhieuXuatKho.trang_thai == "da_xuat",
        ]
        if thang is not None:
            xk_filters.append(extract("month", PhieuXuatKho.ngay_thang_nam) == thang)

        xuat_kho_records = (
            self.db.query(
                ThuocVtyt.ma_thuoc_vtyt,
                ThuocVtyt.ten_thuoc_vtyt,
                ThuocVtyt.don_vi_tinh,
                ThuocVtyt.phan_loai,
                func.coalesce(func.sum(ChiTietXuatKho.so_luong), 0).label("tong_luong"),
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
            .filter(BenhAn.trang_thai == "đang_điều_trị")
            .scalar()
            or 0
        )

        chuyen_tuyen = (
            self.db.query(func.count(KhamBenh.ma_kham_benh))
            .outerjoin(GiayGioiThieu, KhamBenh.ma_kham_benh == GiayGioiThieu.ma_kham_benh)
            .outerjoin(DiTuyenSauDieuTri, GiayGioiThieu.ma_giay_gt == DiTuyenSauDieuTri.ma_giay_gt)
            .filter(
                KhamBenh.trang_thai == "chuyển_tuyến",
                KhamBenh.da_duyet == True,
                DiTuyenSauDieuTri.ngay_di.isnot(None),
                DiTuyenSauDieuTri.ngay_di <= hom_nay,
                or_(
                    DiTuyenSauDieuTri.ngay_ve.is_(None),
                    DiTuyenSauDieuTri.ngay_ve > hom_nay,
                ),
            )
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
            .filter(Giuong.trang_thai == "trống")
            .scalar()
            or 0
        )

        tong_thuoc = self.db.query(func.count(ThuocVtyt.ma_thuoc_vtyt)).scalar() or 0

        tong_quan_so = self.db.query(func.count(QuanNhan.ma_quan_nhan)).scalar() or 0

        lich_kham_sk_chua_duyet = (
            self.db.query(func.count(LichKhamSkNam.ma_lich_kham))
            .filter(LichKhamSkNam.trang_thai == "cho_duyet")
            .scalar()
            or 0
        )

        nhap_vien_chua_duyet = (
            self.db.query(func.count(KhamBenh.ma_kham_benh))
            .filter(
                KhamBenh.trang_thai == "nhập_viện",
                KhamBenh.da_duyet == False,
            )
            .scalar()
            or 0
        )

        chuyen_tuyen_chua_duyet = (
            self.db.query(func.count(KhamBenh.ma_kham_benh))
            .filter(
                KhamBenh.trang_thai == "chuyển_tuyến",
                KhamBenh.da_duyet == False,
            )
            .scalar()
            or 0
        )

        phieu_du_tru_chua_duyet = (
            self.db.query(func.count(PhieuDuTru.ma_phieu_du_tru))
            .filter(PhieuDuTru.trang_thai == "cho_duyet")
            .scalar()
            or 0
        )

        phieu_xuat_chua_duyet = (
            self.db.query(func.count(PhieuXuatKho.ma_phieu_xuat))
            .filter(PhieuXuatKho.trang_thai == "cho_duyet")
            .scalar()
            or 0
        )

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
                "tong_quan_so": tong_quan_so,
            },
            "cho_xu_ly": {
                "lich_kham_sk_chua_duyet": lich_kham_sk_chua_duyet,
                "nhap_vien_chua_duyet": nhap_vien_chua_duyet,
                "chuyen_tuyen_chua_duyet": chuyen_tuyen_chua_duyet,
                "phieu_du_tru_chua_duyet": phieu_du_tru_chua_duyet,
                "phieu_xuat_chua_duyet": phieu_xuat_chua_duyet,
            },
        }

    def quan_so_khoe(self, thang: int, nam: int) -> dict:
        units = {u.ma_don_vi: u for u in self.db.query(DonVi).all()}

        qs_rows = (
            self.db.query(
                QuanNhan.ma_don_vi,
                func.count(QuanNhan.ma_quan_nhan).label("quan_so"),
            )
            .group_by(QuanNhan.ma_don_vi)
            .all()
        )
        qs_map = {r.ma_don_vi: r.quan_so for r in qs_rows}

        hosp_raw = (
            self.db.query(BenhAn.ma_quan_nhan, QuanNhan.ma_don_vi)
            .join(QuanNhan, BenhAn.ma_quan_nhan == QuanNhan.ma_quan_nhan)
            .filter(
                extract("year", BenhAn.ngay_nhap_vien) == nam,
                extract("month", BenhAn.ngay_nhap_vien) == thang,
            )
            .all()
        )

        hosp_people: dict[str, set] = {}
        hosp_luot: dict[str, int] = {}
        for r in hosp_raw:
            dv = r.ma_don_vi or "__none__"
            hosp_people.setdefault(dv, set()).add(r.ma_quan_nhan)
            hosp_luot[dv] = hosp_luot.get(dv, 0) + 1

        ct_kb_raw = (
            self.db.query(KhamBenh.ma_quan_nhan, QuanNhan.ma_don_vi)
            .join(QuanNhan, KhamBenh.ma_quan_nhan == QuanNhan.ma_quan_nhan)
            .filter(
                KhamBenh.trang_thai == "chuyển_tuyến",
                extract("year", KhamBenh.ngay_kham) == nam,
                extract("month", KhamBenh.ngay_kham) == thang,
            )
            .all()
        )

        ct_dt_raw = (
            self.db.query(DiTuyenSauDieuTri.ma_quan_nhan, QuanNhan.ma_don_vi)
            .join(QuanNhan, DiTuyenSauDieuTri.ma_quan_nhan == QuanNhan.ma_quan_nhan)
            .filter(
                extract("year", DiTuyenSauDieuTri.ngay_di) == nam,
                extract("month", DiTuyenSauDieuTri.ngay_di) == thang,
            )
            .all()
        )

        ct_people: dict[str, set] = {}
        ct_luot: dict[str, int] = {}
        for r in ct_kb_raw + ct_dt_raw:
            dv = r.ma_don_vi or "__none__"
            ct_people.setdefault(dv, set()).add(r.ma_quan_nhan)
            ct_luot[dv] = ct_luot.get(dv, 0) + 1

        danh_sach = []
        tong_quan_so = 0
        tong_nguoi_om = 0
        tong_luot_om = 0

        for ma_dv, u in units.items():
            qs = qs_map.get(ma_dv, 0)
            nguoi_om = len(hosp_people.get(ma_dv, set()) | ct_people.get(ma_dv, set()))
            luot_om = hosp_luot.get(ma_dv, 0) + ct_luot.get(ma_dv, 0)
            qk = max(0, qs - nguoi_om)
            tl = round(qk / qs * 100, 1) if qs > 0 else 100.0

            danh_sach.append({
                "ma_don_vi": ma_dv,
                "ten_don_vi": u.ten_don_vi,
                "ma_don_vi_truc_thuoc": u.ma_don_vi_truc_thuoc,
                "quan_so": qs,
                "so_nguoi_om": nguoi_om,
                "so_luot_om": luot_om,
                "quan_so_khoe": qk,
                "ty_le_khoe": tl,
            })

            tong_quan_so += qs
            tong_nguoi_om += nguoi_om
            tong_luot_om += luot_om

        tong_qk = max(0, tong_quan_so - tong_nguoi_om)

        return {
            "thang": thang,
            "nam": nam,
            "don_vi": danh_sach,
            "tong_quan": {
                "tong_quan_so": tong_quan_so,
                "tong_nguoi_om": tong_nguoi_om,
                "tong_luot_om": tong_luot_om,
                "quan_so_khoe": tong_qk,
                "ty_le_khoe": round(tong_qk / tong_quan_so * 100, 1) if tong_quan_so > 0 else 100.0,
            },
        }

    def daily_visit_stats(self, end_date: date, days: int = 14) -> list[dict]:
        result = []
        for i in range(days - 1, -1, -1):
            ngay = end_date - timedelta(days=i)
            ngay_sau = ngay + timedelta(days=1)

            so_luot_kham = (
                self.db.query(func.count(KhamBenh.ma_kham_benh))
                .filter(KhamBenh.ngay_kham >= ngay, KhamBenh.ngay_kham < ngay_sau)
                .scalar()
                or 0
            )

            so_noi_tru = (
                self.db.query(func.count(BenhAn.ma_benh_an))
                .filter(
                    BenhAn.ngay_nhap_vien >= ngay,
                    BenhAn.ngay_nhap_vien < ngay_sau,
                    BenhAn.trang_thai == "đang_điều_trị",
                )
                .scalar()
                or 0
            )

            so_chuyen_tuyen = (
                self.db.query(func.count(KhamBenh.ma_kham_benh))
                .filter(
                    KhamBenh.trang_thai == "chuyển_tuyến",
                    KhamBenh.ngay_kham >= ngay,
                    KhamBenh.ngay_kham < ngay_sau,
                )
                .scalar()
                or 0
            )

            result.append({
                "label": ngay.strftime("%d/%m"),
                "so_luot_kham": so_luot_kham,
                "so_noi_tru": so_noi_tru,
                "so_chuyen_tuyen": so_chuyen_tuyen,
            })
        return result

    def monthly_visit_stats(self, nam: int) -> list[dict]:
        result = []
        for thang in range(1, 13):
            so_luot_kham = (
                self.db.query(func.count(KhamBenh.ma_kham_benh))
                .filter(
                    extract("year", KhamBenh.ngay_kham) == nam,
                    extract("month", KhamBenh.ngay_kham) == thang,
                )
                .scalar()
                or 0
            )

            so_noi_tru = (
                self.db.query(func.count(BenhAn.ma_benh_an))
                .filter(
                    extract("year", BenhAn.ngay_nhap_vien) == nam,
                    extract("month", BenhAn.ngay_nhap_vien) == thang,
                    BenhAn.trang_thai == "đang_điều_trị",
                )
                .scalar()
                or 0
            )

            so_chuyen_tuyen = (
                self.db.query(func.count(KhamBenh.ma_kham_benh))
                .filter(
                    KhamBenh.trang_thai == "chuyển_tuyến",
                    extract("year", KhamBenh.ngay_kham) == nam,
                    extract("month", KhamBenh.ngay_kham) == thang,
                )
                .scalar()
                or 0
            )

            result.append({
                "label": f"Tháng {thang}",
                "so_luot_kham": so_luot_kham,
                "so_noi_tru": so_noi_tru,
                "so_chuyen_tuyen": so_chuyen_tuyen,
            })
        return result

    def get_chi_tiet_nhom_benh(self, loai: str, ma_nhom: str, thang: int, nam: int) -> list:
        from app.database.don_vi import DonVi
        if loai == "noi_tru":
            rows = (
                self.db.query(
                    BenhAn.ma_benh_an,
                    BenhAn.ma_quan_nhan,
                    BenhAn.ngay_nhap_vien,
                    BenhAn.chan_doan,
                    QuanNhan.ho_ten,
                    QuanNhan.ma_don_vi,
                    QuanNhan.cap_bac,
                    QuanNhan.chuc_vu,
                    DonVi.ten_don_vi,
                )
                .join(QuanNhan, BenhAn.ma_quan_nhan == QuanNhan.ma_quan_nhan)
                .join(DonVi, QuanNhan.ma_don_vi == DonVi.ma_don_vi, isouter=True)
                .filter(
                    BenhAn.ma_nhom_benh == ma_nhom,
                    extract("year", BenhAn.ngay_nhap_vien) == nam,
                    extract("month", BenhAn.ngay_nhap_vien) == thang,
                )
                .all()
            )
            return [
                {
                    "ma_benh_an": r.ma_benh_an,
                    "ma_quan_nhan": r.ma_quan_nhan,
                    "ho_ten": r.ho_ten,
                    "ten_don_vi": r.ten_don_vi or "",
                    "cap_bac": r.cap_bac or "",
                    "chuc_vu": r.chuc_vu or "",
                    "ngay_nhap_vien": r.ngay_nhap_vien.isoformat() if r.ngay_nhap_vien else "",
                    "chan_doan": r.chan_doan or "",
                }
                for r in rows
            ]
        else:
            rows = (
                self.db.query(
                    KhamBenh.ma_kham_benh,
                    KhamBenh.ma_quan_nhan,
                    KhamBenh.ngay_kham,
                    KhamBenh.chan_doan,
                    QuanNhan.ho_ten,
                    QuanNhan.ma_don_vi,
                    QuanNhan.cap_bac,
                    QuanNhan.chuc_vu,
                    DonVi.ten_don_vi,
                )
                .join(QuanNhan, KhamBenh.ma_quan_nhan == QuanNhan.ma_quan_nhan)
                .join(DonVi, QuanNhan.ma_don_vi == DonVi.ma_don_vi, isouter=True)
                .filter(
                    KhamBenh.ma_nhom_benh == ma_nhom,
                    extract("year", KhamBenh.ngay_kham) == nam,
                    extract("month", KhamBenh.ngay_kham) == thang,
                    KhamBenh.trang_thai != "chờ",
                )
                .all()
            )
            return [
                {
                    "ma_kham_benh": r.ma_kham_benh,
                    "ma_quan_nhan": r.ma_quan_nhan,
                    "ho_ten": r.ho_ten,
                    "ten_don_vi": r.ten_don_vi or "",
                    "cap_bac": r.cap_bac or "",
                    "chuc_vu": r.chuc_vu or "",
                    "ngay_kham": r.ngay_kham.isoformat() if r.ngay_kham else "",
                    "chan_doan": r.chan_doan or "",
                }
                for r in rows
            ]

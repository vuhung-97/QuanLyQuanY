from datetime import date, datetime, timedelta

from sqlalchemy import extract, func, or_
from sqlalchemy.orm import Session

from app.database.benh_an import BenhAn
from app.database.di_tuyen_sau_dieu_tri import DiTuyenSauDieuTri
from app.database.don_thuoc import DonThuoc
from app.database.giay_gioi_thieu import GiayGioiThieu
from app.database.giuong import Giuong
from app.database.kham_benh import KhamBenh
from app.database.lich_kham_sk_nam import LichKhamSkNam
from app.database.phieu_du_tru import PhieuDuTru
from app.database.phieu_xuat_kho import PhieuXuatKho
from app.database.quan_nhan import QuanNhan
from app.database.thuoc_vtyt import ThuocVtyt


class DashboardService:
    def __init__(self, db: Session):
        self.db = db

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
            .filter(PhieuDuTru.trang_thai.in_(["chua_duyet", "cho_duyet"]))
            .scalar()
            or 0
        )

        phieu_xuat_chua_duyet = (
            self.db.query(func.count(PhieuXuatKho.ma_phieu_xuat))
            .filter(PhieuXuatKho.trang_thai == "cho_duyet")
            .scalar()
            or 0
        )

        lap_benh_an = (
            self.db.query(func.count(KhamBenh.ma_kham_benh))
            .outerjoin(BenhAn, KhamBenh.ma_kham_benh == BenhAn.ma_kham_benh)
            .filter(
                KhamBenh.trang_thai == "nhập_viện",
                KhamBenh.da_duyet == True,
                BenhAn.ma_kham_benh.is_(None),
            )
            .scalar()
            or 0
        )

        chua_kham = (
            self.db.query(func.count(KhamBenh.ma_kham_benh))
            .filter(KhamBenh.trang_thai == "chờ")
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
                "lap_benh_an": lap_benh_an,
                "chua_kham": chua_kham,
            },
        }

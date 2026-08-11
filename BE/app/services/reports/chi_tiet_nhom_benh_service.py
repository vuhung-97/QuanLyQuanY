from sqlalchemy import extract
from sqlalchemy.orm import Session

from app.database.benh_an import BenhAn
from app.database.don_vi import DonVi
from app.database.kham_benh import KhamBenh
from app.database.quan_nhan import QuanNhan


class ChiTietNhomBenhService:
    def __init__(self, db: Session):
        self.db = db

    def get_chi_tiet_nhom_benh(self, loai: str, ma_nhom: str, thang: int, nam: int) -> list:
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

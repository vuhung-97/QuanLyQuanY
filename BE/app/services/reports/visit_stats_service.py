from datetime import date, timedelta

from sqlalchemy import extract, func
from sqlalchemy.orm import Session

from app.database.benh_an import BenhAn
from app.database.kham_benh import KhamBenh


class VisitStatsService:
    def __init__(self, db: Session):
        self.db = db

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

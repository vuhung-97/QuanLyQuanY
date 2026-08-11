from sqlalchemy import extract, func
from sqlalchemy.orm import Session

from app.database.benh_an import BenhAn
from app.database.di_tuyen_sau_dieu_tri import DiTuyenSauDieuTri
from app.database.don_vi import DonVi
from app.database.kham_benh import KhamBenh
from app.database.quan_nhan import QuanNhan


class QuanSoKhoeService:
    def __init__(self, db: Session):
        self.db = db

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
        tong_luot_nhap_benh_xa = 0
        tong_luot_chuyen_tuyen = 0

        for ma_dv, u in units.items():
            qs = qs_map.get(ma_dv, 0)
            nguoi_om = len(hosp_people.get(ma_dv, set()) | ct_people.get(ma_dv, set()))
            luot_nhap_benh_xa = hosp_luot.get(ma_dv, 0)
            luot_chuyen_tuyen = ct_luot.get(ma_dv, 0)
            luot_om = luot_nhap_benh_xa + luot_chuyen_tuyen
            qk = max(0, qs - nguoi_om)
            tl = round(qk / qs * 100, 1) if qs > 0 else 100.0

            danh_sach.append({
                "ma_don_vi": ma_dv,
                "ten_don_vi": u.ten_don_vi,
                "ma_don_vi_truc_thuoc": u.ma_don_vi_truc_thuoc,
                "quan_so": qs,
                "so_nguoi_om": nguoi_om,
                "so_luot_nhap_benh_xa": luot_nhap_benh_xa,
                "so_luot_chuyen_tuyen": luot_chuyen_tuyen,
                "so_luot_om": luot_om,
                "quan_so_khoe": qk,
                "ty_le_khoe": tl,
            })

            tong_quan_so += qs
            tong_nguoi_om += nguoi_om
            tong_luot_nhap_benh_xa += luot_nhap_benh_xa
            tong_luot_chuyen_tuyen += luot_chuyen_tuyen
            tong_luot_om += luot_om

        tong_qk = max(0, tong_quan_so - tong_nguoi_om)

        return {
            "thang": thang,
            "nam": nam,
            "don_vi": danh_sach,
            "tong_quan": {
                "tong_quan_so": tong_quan_so,
                "tong_nguoi_om": tong_nguoi_om,
                "tong_luot_nhap_benh_xa": tong_luot_nhap_benh_xa,
                "tong_luot_chuyen_tuyen": tong_luot_chuyen_tuyen,
                "tong_luot_om": tong_luot_om,
                "quan_so_khoe": tong_qk,
                "ty_le_khoe": round(tong_qk / tong_quan_so * 100, 1) if tong_quan_so > 0 else 100.0,
            },
        }

    def quan_so_khoe_chi_tiet_don_vi(self, ma_don_vi: str, thang: int, nam: int) -> dict:
        real_ma_don_vi = ma_don_vi.replace("_co_quan", "") if ma_don_vi else ""
        unit = self.db.query(DonVi).filter(DonVi.ma_don_vi == real_ma_don_vi).first()
        ten_don_vi = unit.ten_don_vi if unit else real_ma_don_vi
        if ma_don_vi.endswith("_co_quan"):
            ten_don_vi = f"{ten_don_vi} (Cơ quan)"

        hosp_rows = (
            self.db.query(BenhAn.ma_quan_nhan, QuanNhan.ho_ten, QuanNhan.cap_bac, QuanNhan.chuc_vu)
            .join(QuanNhan, BenhAn.ma_quan_nhan == QuanNhan.ma_quan_nhan)
            .filter(
                QuanNhan.ma_don_vi == real_ma_don_vi,
                extract("year", BenhAn.ngay_nhap_vien) == nam,
                extract("month", BenhAn.ngay_nhap_vien) == thang,
            )
            .all()
        )

        ct_kb_rows = (
            self.db.query(KhamBenh.ma_quan_nhan, QuanNhan.ho_ten, QuanNhan.cap_bac, QuanNhan.chuc_vu)
            .join(QuanNhan, KhamBenh.ma_quan_nhan == QuanNhan.ma_quan_nhan)
            .filter(
                QuanNhan.ma_don_vi == real_ma_don_vi,
                KhamBenh.trang_thai == "chuyển_tuyến",
                extract("year", KhamBenh.ngay_kham) == nam,
                extract("month", KhamBenh.ngay_kham) == thang,
            )
            .all()
        )

        ct_dt_rows = (
            self.db.query(DiTuyenSauDieuTri.ma_quan_nhan, QuanNhan.ho_ten, QuanNhan.cap_bac, QuanNhan.chuc_vu)
            .join(QuanNhan, DiTuyenSauDieuTri.ma_quan_nhan == QuanNhan.ma_quan_nhan)
            .filter(
                QuanNhan.ma_don_vi == real_ma_don_vi,
                extract("year", DiTuyenSauDieuTri.ngay_di) == nam,
                extract("month", DiTuyenSauDieuTri.ngay_di) == thang,
            )
            .all()
        )

        qn_map = {}
        for r in hosp_rows:
            ma_qn = r.ma_quan_nhan
            if ma_qn not in qn_map:
                qn_map[ma_qn] = {
                    "ma_quan_nhan": ma_qn,
                    "ho_ten": r.ho_ten,
                    "cap_bac": r.cap_bac or "--",
                    "chuc_vu": r.chuc_vu or "--",
                    "so_luot_nhap_benh_xa": 0,
                    "so_luot_chuyen_tuyen": 0,
                }
            qn_map[ma_qn]["so_luot_nhap_benh_xa"] += 1

        for r in ct_kb_rows + ct_dt_rows:
            ma_qn = r.ma_quan_nhan
            if ma_qn not in qn_map:
                qn_map[ma_qn] = {
                    "ma_quan_nhan": ma_qn,
                    "ho_ten": r.ho_ten,
                    "cap_bac": r.cap_bac or "--",
                    "chuc_vu": r.chuc_vu or "--",
                    "so_luot_nhap_benh_xa": 0,
                    "so_luot_chuyen_tuyen": 0,
                }
            qn_map[ma_qn]["so_luot_chuyen_tuyen"] += 1

        danh_sach = []
        for item in qn_map.values():
            item["so_luot_om"] = item["so_luot_nhap_benh_xa"] + item["so_luot_chuyen_tuyen"]
            danh_sach.append(item)

        danh_sach.sort(key=lambda x: x["ho_ten"])

        return {
            "ma_don_vi": ma_don_vi,
            "ten_don_vi": ten_don_vi,
            "thang": thang,
            "nam": nam,
            "danh_sach": danh_sach,
            "tong_so_nguoi": len(danh_sach),
        }

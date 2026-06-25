from datetime import datetime

from sqlalchemy.orm import Session

from app.database.benh_an import BenhAn
from app.database.benh_nhan_ra_vao import BenhNhanRaVao
from app.database.chi_tiet_don_thuoc import ChiTietDonThuoc
from app.database.di_tuyen_sau_dieu_tri import DiTuyenSauDieuTri
from app.database.don_thuoc import DonThuoc
from app.database.giay_gioi_thieu import GiayGioiThieu
from app.database.kham_benh import KhamBenh


class MedicalExaminationService:
    def __init__(self, db: Session):
        self.db = db

    def start_examination(self, qn_id: str) -> KhamBenh:
        previous_count = (
            self.db.query(KhamBenh)
            .filter(KhamBenh.ma_quan_nhan == qn_id)
            .count()
        )
        kb = KhamBenh(
            ma_quan_nhan=qn_id,
            trang_thai="chờ",
            kham_lan=previous_count + 1,
        )
        self.db.add(kb)
        self.db.commit()
        self.db.refresh(kb)
        return kb

    def complete_examination(self, kb_id: str, data: dict) -> KhamBenh:
        kb = self.db.query(KhamBenh).filter(KhamBenh.ma_kham_benh == kb_id).first()
        if not kb:
            raise ValueError(f"KhamBenh {kb_id} not found")

        if "trieu_chung" in data:
            kb.trieu_chung = data["trieu_chung"]
        if "phuong_phap_dieu_tri" in data:
            kb.phuong_phap_dieu_tri = data["phuong_phap_dieu_tri"]
        if "chan_doan" in data:
            kb.chan_doan = data["chan_doan"]

        prescription_items = data.get("prescription_items")
        if prescription_items:
            old_dts = self.db.query(DonThuoc).filter(DonThuoc.ma_kham_benh == kb_id).all()
            for old_dt in old_dts:
                self.db.query(ChiTietDonThuoc).filter(
                    ChiTietDonThuoc.ma_don_thuoc == old_dt.ma_don_thuoc
                ).delete()
                self.db.delete(old_dt)
            self.db.flush()

            dt = DonThuoc(
                ma_quan_nhan=kb.ma_quan_nhan,
                ma_kham_benh=kb_id,
            )
            self.db.add(dt)
            self.db.flush()
            for item in prescription_items:
                ctdt = ChiTietDonThuoc(
                    ma_don_thuoc=dt.ma_don_thuoc,
                    ma_thuoc_vtyt=item["ma_thuoc_vtyt"],
                    so_luong=item.get("so_luong", 1),
                    huong_dieu_tri=item.get("huong_dieu_tri"),
                )
                self.db.add(ctdt)
            kb.trang_thai = "chờ_nhận_thuốc"
        else:
            kb.trang_thai = "đã_khám"

        self.db.commit()
        self.db.refresh(kb)
        return kb

    def create_benh_an(self, kb_id: str, data: dict) -> BenhAn:
        kb = self.db.query(KhamBenh).filter(KhamBenh.ma_kham_benh == kb_id).first()
        if not kb:
            raise ValueError(f"KhamBenh {kb_id} not found")
        if kb.trang_thai != "nhập_viện":
            raise ValueError("Chưa được chỉ định nhập viện.")

        ba = BenhAn(
            ma_quan_nhan=kb.ma_quan_nhan,
            ma_kham_benh=kb_id,
            trang_thai="đang_điều_trị",
            ngoai_kieu=data.get("ngoai_kieu"),
            doi_tuong=data.get("doi_tuong"),
            quan_ly_nguoi_benh=data.get("quan_ly_nguoi_benh"),
            chan_doan=data.get("chan_doan", kb.chan_doan),
            chi_tiet_benh_an=data.get("chi_tiet_benh_an"),
        )
        self.db.add(ba)
        self.db.flush()

        bnrv = BenhNhanRaVao(
            ma_benh_an=ba.ma_benh_an,
            ma_kham_benh=kb_id,
            ly_do=data.get("ly_do"),
            ngay_vao=datetime.now().date(),
        )
        self.db.add(bnrv)
        self.db.commit()
        self.db.refresh(ba)
        return ba

    def discharge_patient(self, ba_id: str, data: dict) -> BenhAn:
        ba = self.db.query(BenhAn).filter(BenhAn.ma_benh_an == ba_id).first()
        if not ba:
            raise ValueError(f"BenhAn {ba_id} not found")
        if ba.trang_thai == "đã_ra_viện":
            raise ValueError("Bệnh án đã đóng.")

        ba.tinh_trang_ra_vien = data.get("tinh_trang_ra_vien")
        ba.chi_tiet_benh_an = data.get("chi_tiet_benh_an", ba.chi_tiet_benh_an)
        ba.tong_ket_benh_an = data.get("tong_ket_benh_an")
        ba.trang_thai = "đã_ra_viện"

        bnrv = self.db.query(BenhNhanRaVao).filter(
            BenhNhanRaVao.ma_benh_an == ba_id
        ).first()
        if bnrv:
            bnrv.ngay_ra = data.get("ngay_ra", datetime.now().date())

        self.db.commit()
        self.db.refresh(ba)
        return ba

    def admit_patient(self, kb_id: str) -> dict:
        kb = self.db.query(KhamBenh).filter(KhamBenh.ma_kham_benh == kb_id).first()
        if not kb:
            raise ValueError(f"KhamBenh {kb_id} not found")

        kb.trang_thai = "nhập_viện"
        self.db.commit()
        self.db.refresh(kb)
        return kb

    def refer_patient(self, kb_id: str, data: dict) -> dict:
        kb = self.db.query(KhamBenh).filter(KhamBenh.ma_kham_benh == kb_id).first()
        if not kb:
            raise ValueError(f"KhamBenh {kb_id} not found")

        ggt = GiayGioiThieu(
            ma_quan_nhan=kb.ma_quan_nhan,
            ma_kham_benh=data.get("ma_kham_benh"),
            ten_benh_vien=data.get("ten_benh_vien"),
            can_benh=data.get("can_benh"),
            y_kien_de_nghi=data.get("y_kien_de_nghi"),
            thoi_gian_den_benh_vien=data.get("thoi_gian_den_benh_vien"),
            chan_doan=data.get("chan_doan"),
            quyet_dinh_y_sinh=data.get("quyet_dinh_y_sinh"),
        )
        self.db.add(ggt)
        self.db.flush()

        dtsdt = DiTuyenSauDieuTri(
            ma_quan_nhan=kb.ma_quan_nhan,
            ma_giay_gt=ggt.ma_giay_gt,
            ngay_di=datetime.now().date(),
            chan_doan_luc_di=data.get("chan_doan"),
        )
        self.db.add(dtsdt)

        kb.trang_thai = "chuyển_tuyến"
        self.db.commit()
        self.db.refresh(ggt)
        self.db.refresh(dtsdt)
        return {"kham_benh": kb, "giay_gioi_thieu": ggt, "di_tuyen_sau_dieu_tri": dtsdt}

    def receive_medicine(self, kb_id: str) -> KhamBenh:
        kb = self.db.query(KhamBenh).filter(KhamBenh.ma_kham_benh == kb_id).first()
        if not kb:
            raise ValueError(f"KhamBenh {kb_id} not found")
        kb.trang_thai = "đã_nhận_thuốc"
        self.db.commit()
        self.db.refresh(kb)
        return kb

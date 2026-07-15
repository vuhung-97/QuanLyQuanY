from datetime import date, datetime, timezone

from sqlalchemy import inspect
from sqlalchemy.orm import Session

from app.database.benh_an import BenhAn
from app.database.chi_tiet_don_thuoc import ChiTietDonThuoc
from app.database.di_tuyen_sau_dieu_tri import DiTuyenSauDieuTri
from app.database.don_thuoc import DonThuoc
from app.database.giay_gioi_thieu import GiayGioiThieu
from app.database.giuong import Giuong
from app.database.kham_benh import KhamBenh
from app.database.nhat_ky_thao_tac import NhatKyThaoTac
from app.database.thuoc_vtyt import ThuocVtyt


class MedicalExaminationService:
    def __init__(self, db: Session):
        self.db = db

    @staticmethod
    def _serialize(val):
        if isinstance(val, (datetime, date)):
            return val.isoformat()
        return val

    def _log(self, hanh_dong: str, nguoi_dung_id: str | None, ten_bang: str, du_lieu_cu: dict | None = None, du_lieu_moi: dict | None = None):
        log = NhatKyThaoTac(
            id_nguoi_dung=nguoi_dung_id,
            thoi_gian=datetime.now(timezone.utc),
            hanh_dong=hanh_dong,
            ten_bang=ten_bang,
            du_lieu_cu={k: self._serialize(v) for k, v in du_lieu_cu.items()} if du_lieu_cu else None,
            du_lieu_moi={k: self._serialize(v) for k, v in du_lieu_moi.items()} if du_lieu_moi else None,
        )
        self.db.add(log)
        self.db.commit()

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

    def _decrement_stock(self, items: list[dict]) -> None:
        for item in items:
            thuoc = self.db.query(ThuocVtyt).filter(
                ThuocVtyt.ma_thuoc_vtyt == item["ma_thuoc_vtyt"]
            ).first()
            if not thuoc:
                raise ValueError(f"Thuốc {item['ma_thuoc_vtyt']} không tồn tại")
            so_luong = item.get("so_luong", 1)
            if (thuoc.so_luong or 0) < so_luong:
                raise ValueError(
                    f"Thuốc '{thuoc.ten_thuoc_vtyt}' không đủ số lượng: "
                    f"còn {thuoc.so_luong or 0}, cần {so_luong}"
                )
            thuoc.so_luong = (thuoc.so_luong or 0) - so_luong

    def _restore_stock(self, items: list) -> None:
        for ct in items:
            thuoc = self.db.query(ThuocVtyt).filter(
                ThuocVtyt.ma_thuoc_vtyt == ct.ma_thuoc_vtyt
            ).first()
            if thuoc:
                thuoc.so_luong = (thuoc.so_luong or 0) + ct.so_luong

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

    def create_benh_an(self, kb_id: str, data: dict, nguoi_dung_id: str | None = None) -> BenhAn:
        kb = self.db.query(KhamBenh).filter(KhamBenh.ma_kham_benh == kb_id).first()
        if not kb:
            raise ValueError(f"KhamBenh {kb_id} not found")
        if kb.trang_thai != "nhập_viện":
            raise ValueError("Chưa được chỉ định nhập viện.")

        ma_buong = data.get("ma_buong") or None
        ma_giuong = data.get("ma_giuong") or None
        giuong = None
        if ma_giuong:
            giuong = self.db.query(Giuong).filter(Giuong.ma_giuong == ma_giuong).first()
            if not giuong or giuong.trang_thai != "trống":
                raise ValueError("Giường không hợp lệ hoặc đã có người.")

        ba = BenhAn(
            ma_quan_nhan=kb.ma_quan_nhan,
            ma_kham_benh=kb_id,
            trang_thai="đang_điều_trị",
            ngay_nhap_vien=data.get("ngay_nhap_vien", datetime.now().date()),
            doi_tuong=data.get("doi_tuong"),
            ly_do_nhap_vien=data.get("ly_do_nhap_vien"),
            quan_ly_nguoi_benh=data.get("quan_ly_nguoi_benh"),
            chan_doan=data.get("chan_doan", kb.chan_doan),
            chi_tiet_benh_an=data.get("chi_tiet_benh_an"),
            ma_buong=ma_buong,
            ma_giuong=ma_giuong,
            ma_nguoi_dung=nguoi_dung_id,
        )
        self.db.add(ba)
        self.db.flush()

        if giuong:
            giuong.trang_thai = "có người"
            self.db.flush()

        self.db.commit()
        self.db.refresh(ba)

        self._log("CREATE", nguoi_dung_id, "benh_an", du_lieu_moi={c.key: getattr(ba, c.key) for c in inspect(BenhAn).columns})
        return ba

    def discharge_patient(self, ba_id: str, data: dict, nguoi_dung_id: str | None = None) -> BenhAn:
        ba = self.db.query(BenhAn).filter(BenhAn.ma_benh_an == ba_id).first()
        if not ba:
            raise ValueError(f"BenhAn {ba_id} not found")
        if ba.trang_thai == "đã_ra_viện":
            raise ValueError("Bệnh án đã đóng.")

        old = {c.key: getattr(ba, c.key) for c in inspect(BenhAn).columns}

        ba.chi_tiet_benh_an = data.get("chi_tiet_benh_an", ba.chi_tiet_benh_an)
        ba.tong_ket_benh_an = data.get("tong_ket_benh_an")
        ba.trang_thai = "đã_ra_viện"

        if ba.ma_giuong:
            giuong = self.db.query(Giuong).filter(Giuong.ma_giuong == ba.ma_giuong).first()
            if giuong:
                giuong.trang_thai = "trống"

        self.db.commit()
        self.db.refresh(ba)

        new = {c.key: getattr(ba, c.key) for c in inspect(BenhAn).columns}
        self._log("UPDATE", nguoi_dung_id, "benh_an", du_lieu_cu=old, du_lieu_moi=new)
        return ba

    def admit_patient(self, kb_id: str, nguoi_dung_id: str | None = None) -> dict:
        kb = self.db.query(KhamBenh).filter(KhamBenh.ma_kham_benh == kb_id).first()
        if not kb:
            raise ValueError(f"KhamBenh {kb_id} not found")

        kb.trang_thai = "nhập_viện"
        self.db.commit()
        self.db.refresh(kb)
        self._log("UPDATE", nguoi_dung_id, "kham_benh", du_lieu_moi={c.key: getattr(kb, c.key) for c in inspect(KhamBenh).columns})
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
            ngay_di=data.get("ngay_di"),
            chan_doan_luc_di=data.get("chan_doan"),
        )
        self.db.add(dtsdt)

        kb.trang_thai = "chuyển_tuyến"
        self.db.commit()
        self.db.refresh(ggt)
        self.db.refresh(dtsdt)
        return {"kham_benh": kb, "giay_gioi_thieu": ggt, "di_tuyen_sau_dieu_tri": dtsdt}

    def receive_medicine(self, kb_id: str, nguoi_dung_id: str | None = None) -> KhamBenh:
        kb = self.db.query(KhamBenh).filter(KhamBenh.ma_kham_benh == kb_id).first()
        if not kb:
            raise ValueError(f"KhamBenh {kb_id} not found")
        kb.trang_thai = "đã_nhận_thuốc"
        if nguoi_dung_id:
            dt = self.db.query(DonThuoc).filter(DonThuoc.ma_kham_benh == kb_id).first()
            if dt:
                chi_tiets = self.db.query(ChiTietDonThuoc).filter(
                    ChiTietDonThuoc.ma_don_thuoc == dt.ma_don_thuoc
                ).all()
                items = [
                    {"ma_thuoc_vtyt": ct.ma_thuoc_vtyt, "so_luong": ct.so_luong}
                    for ct in chi_tiets
                ]
                self._decrement_stock(items)
                dt.id_nguoi_dung = nguoi_dung_id
        self.db.commit()
        self.db.refresh(kb)
        return kb

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.database.chi_tiet_don_thuoc import ChiTietDonThuoc
from app.database.don_thuoc import DonThuoc
from app.database.kham_benh import KhamBenh
from app.database.thuoc_vtyt import ThuocVtyt


class KhamBenhCRUD(CRUDBase[KhamBenh, None, None]):
    def delete(self, db: Session, item_id: str, nguoi_dung_id: str | None = None) -> None:
        row = self.get(db, item_id)
        if row.trang_thai in ("đã_khám", "đã_nhận_thuốc"):
            raise HTTPException(
                status_code=400,
                detail="Không thể xoá ca khám đã kết thúc.",
            )
        # Restore stock before cascade delete
        don_thuocs = db.query(DonThuoc).filter(DonThuoc.ma_kham_benh == item_id).all()
        for dt in don_thuocs:
            chi_tiet_list = db.query(ChiTietDonThuoc).filter(
                ChiTietDonThuoc.ma_don_thuoc == dt.ma_don_thuoc
            ).all()
            for ct in chi_tiet_list:
                thuoc = db.query(ThuocVtyt).filter(
                    ThuocVtyt.ma_thuoc_vtyt == ct.ma_thuoc_vtyt
                ).first()
                if thuoc:
                    thuoc.so_luong = (thuoc.so_luong or 0) + ct.so_luong
        super().delete(db, item_id, nguoi_dung_id=nguoi_dung_id)


kham_benh_crud = KhamBenhCRUD(KhamBenh)

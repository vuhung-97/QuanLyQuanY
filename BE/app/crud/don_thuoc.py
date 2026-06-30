from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.database.chi_tiet_don_thuoc import ChiTietDonThuoc
from app.database.don_thuoc import DonThuoc
from app.database.thuoc_vtyt import ThuocVtyt


class DonThuocCRUD(CRUDBase[DonThuoc, None, None]):
    def delete(self, db: Session, item_id: str, nguoi_dung_id: str | None = None) -> None:
        row = self.get(db, item_id)
        chi_tiet_list = db.query(ChiTietDonThuoc).filter(
            ChiTietDonThuoc.ma_don_thuoc == item_id
        ).all()
        for ct in chi_tiet_list:
            thuoc = db.query(ThuocVtyt).filter(
                ThuocVtyt.ma_thuoc_vtyt == ct.ma_thuoc_vtyt
            ).first()
            if thuoc:
                thuoc.so_luong = (thuoc.so_luong or 0) + ct.so_luong
        super().delete(db, item_id, nguoi_dung_id=nguoi_dung_id)


don_thuoc_crud = DonThuocCRUD(DonThuoc)

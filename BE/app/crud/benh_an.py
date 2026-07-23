from app.crud.base import CRUDBase
from app.database.benh_an import BenhAn
from app.database.giuong import Giuong


class BenhAnCRUD(CRUDBase):
    def delete(self, db, item_id, nguoi_dung_id=None):
        row = self.get(db, item_id)
        old = self._row_to_dict(row)
        if row.ma_giuong:
            db.query(Giuong).filter(Giuong.ma_giuong == row.ma_giuong).update({"trang_thai": "trống"})
        db.delete(row)
        self._commit(db)
        self._log(db, "DELETE", nguoi_dung_id, du_lieu_cu=old)


benh_an_crud = BenhAnCRUD(BenhAn)

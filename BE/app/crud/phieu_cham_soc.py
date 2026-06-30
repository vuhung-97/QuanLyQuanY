from app.crud.base import CRUDBase, CRUDBadRequestError
from app.database.phieu_cham_soc import PhieuChamSoc
from app.database.chi_tiet_phieu_cham_soc import ChiTietPhieuChamSoc
from app.database.thuoc_vtyt import ThuocVtyt
from sqlalchemy.orm import Session


class CRUDPhieuChamSoc(CRUDBase):
    def _get_thuoc(self, db: Session, ma_thuoc_vtyt: str) -> ThuocVtyt:
        thuoc = db.query(ThuocVtyt).filter(ThuocVtyt.ma_thuoc_vtyt == ma_thuoc_vtyt).first()
        if not thuoc:
            raise CRUDBadRequestError(f"Thuốc {ma_thuoc_vtyt} không tồn tại")
        return thuoc

    def _decrement_stock(self, db: Session, chi_tiet_data: list) -> None:
        for item in chi_tiet_data:
            ma_thuoc = item.ma_thuoc_vtyt if hasattr(item, "ma_thuoc_vtyt") else item.get("ma_thuoc_vtyt")
            so_luong = item.so_luong if hasattr(item, "so_luong") else item.get("so_luong") or 1
            thuoc = self._get_thuoc(db, ma_thuoc)
            if (thuoc.so_luong or 0) < so_luong:
                raise CRUDBadRequestError(
                    f"Thuốc '{thuoc.ten_thuoc_vtyt}' không đủ số lượng: "
                    f"còn {thuoc.so_luong or 0}, cần {so_luong}"
                )
            thuoc.so_luong = (thuoc.so_luong or 0) - so_luong

    def _restore_stock(self, db: Session, ma_phieu_cs: str) -> None:
        old_chi_tiet = db.query(ChiTietPhieuChamSoc).filter(
            ChiTietPhieuChamSoc.ma_phieu_cs == ma_phieu_cs
        ).all()
        for ct in old_chi_tiet:
            thuoc = db.query(ThuocVtyt).filter(
                ThuocVtyt.ma_thuoc_vtyt == ct.ma_thuoc_vtyt
            ).first()
            if thuoc:
                thuoc.so_luong = (thuoc.so_luong or 0) + ct.so_luong

    def create(self, db: Session, payload, nguoi_dung_id: str | None = None) -> PhieuChamSoc:
        values = self._payload_values(payload)
        row = self.model(**values)
        if nguoi_dung_id:
            row.ma_nguoi_dung = nguoi_dung_id
        db.add(row)
        db.flush()

        chi_tiet_data = getattr(payload, "chi_tiet", [])
        if chi_tiet_data:
            self._decrement_stock(db, chi_tiet_data)
            for item in chi_tiet_data:
                ct = ChiTietPhieuChamSoc(
                    ma_phieu_cs=row.ma_phieu_cs,
                    ma_thuoc_vtyt=item.ma_thuoc_vtyt if hasattr(item, "ma_thuoc_vtyt") else item.get("ma_thuoc_vtyt"),
                    so_luong=item.so_luong if hasattr(item, "so_luong") else item.get("so_luong"),
                )
                db.add(ct)

        self._commit(db)
        db.refresh(row)
        self._log(db, "CREATE", nguoi_dung_id, du_lieu_moi=self._row_to_dict(row))
        return row

    def update(self, db: Session, item_id: str, payload, nguoi_dung_id: str | None = None) -> PhieuChamSoc:
        row = self.get(db, item_id)
        old = self._row_to_dict(row)
        values = self._payload_values(payload, exclude_unset=True)
        for field, value in values.items():
            if field in self._primary_key_columns():
                continue
            setattr(row, field, value)

        chi_tiet_data = getattr(payload, "chi_tiet", None)
        if chi_tiet_data is not None:
            self._restore_stock(db, row.ma_phieu_cs)
            db.query(ChiTietPhieuChamSoc).filter(
                ChiTietPhieuChamSoc.ma_phieu_cs == row.ma_phieu_cs
            ).delete()
            self._decrement_stock(db, chi_tiet_data)
            for item in chi_tiet_data:
                ct = ChiTietPhieuChamSoc(
                    ma_phieu_cs=row.ma_phieu_cs,
                    ma_thuoc_vtyt=item.ma_thuoc_vtyt if hasattr(item, "ma_thuoc_vtyt") else item.get("ma_thuoc_vtyt"),
                    so_luong=item.so_luong if hasattr(item, "so_luong") else item.get("so_luong"),
                )
                db.add(ct)

        if nguoi_dung_id:
            row.ma_nguoi_dung = nguoi_dung_id

        self._validate_updated_row(db, row, type(payload))
        self._commit(db)
        db.refresh(row)
        self._log(db, "UPDATE", nguoi_dung_id, du_lieu_cu=old, du_lieu_moi=self._row_to_dict(row))
        return row

    def delete(self, db: Session, item_id: str, nguoi_dung_id: str | None = None) -> None:
        row = self.get(db, item_id)
        old = self._row_to_dict(row)
        self._restore_stock(db, row.ma_phieu_cs)
        db.delete(row)
        self._commit(db)
        self._log(db, "DELETE", nguoi_dung_id, du_lieu_cu=old)


phieu_cham_soc_crud = CRUDPhieuChamSoc(PhieuChamSoc)
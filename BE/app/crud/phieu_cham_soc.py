from app.crud.base import CRUDBase
from app.database.phieu_cham_soc import PhieuChamSoc
from app.database.chi_tiet_phieu_cham_soc import ChiTietPhieuChamSoc
from sqlalchemy.orm import Session


class CRUDPhieuChamSoc(CRUDBase):
    def create(self, db: Session, payload, nguoi_dung_id: str | None = None) -> PhieuChamSoc:
        values = self._payload_values(payload)
        row = self.model(**values)
        db.add(row)
        db.flush()

        chi_tiet_data = getattr(payload, "chi_tiet", [])
        if chi_tiet_data:
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
            db.query(ChiTietPhieuChamSoc).filter(
                ChiTietPhieuChamSoc.ma_phieu_cs == row.ma_phieu_cs
            ).delete()
            for item in chi_tiet_data:
                ct = ChiTietPhieuChamSoc(
                    ma_phieu_cs=row.ma_phieu_cs,
                    ma_thuoc_vtyt=item.ma_thuoc_vtyt if hasattr(item, "ma_thuoc_vtyt") else item.get("ma_thuoc_vtyt"),
                    so_luong=item.so_luong if hasattr(item, "so_luong") else item.get("so_luong"),
                )
                db.add(ct)

        self._validate_updated_row(db, row, type(payload))
        self._commit(db)
        db.refresh(row)
        self._log(db, "UPDATE", nguoi_dung_id, du_lieu_cu=old, du_lieu_moi=self._row_to_dict(row))
        return row


phieu_cham_soc_crud = CRUDPhieuChamSoc(PhieuChamSoc)
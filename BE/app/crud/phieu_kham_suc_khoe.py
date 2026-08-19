from app.crud.base import CRUDBase
from app.database.phieu_kham_suc_khoe import PhieuKhamSucKhoe
from app.schemas.phieu_kham_suc_khoe import PhieuKhamSucKhoeRead

JSON_MERGE_COLUMNS = {"tong_quan", "kham_lam_sang", "xet_nghiem", "chan_doan_hinh_anh", "ket_luan"}


class PhieuKhamSucKhoeCRUD(CRUDBase):

    def create(self, db, payload, nguoi_dung_id=None):
        row = self.model(**self._payload_values(payload))
        for col in JSON_MERGE_COLUMNS:
            val = getattr(payload, col, None)
            if val is not None:
                setattr(row, col, val)
        db.add(row)
        self._commit(db)
        db.refresh(row)
        self._log(db, "CREATE", nguoi_dung_id, du_lieu_moi=self._row_to_dict(row))
        return row

    def update(self, db, item_id, payload, nguoi_dung_id=None):
        row = self.get(db, item_id)
        old = self._row_to_dict(row)

        payload_dict = payload.model_dump(exclude_unset=True)
        for field, value in payload_dict.items():
            if field in self._primary_key_columns():
                continue
            if field in JSON_MERGE_COLUMNS and value is not None:
                existing = getattr(row, field, None)
                if isinstance(value, list):
                    setattr(row, field, value)
                elif isinstance(value, dict) and isinstance(existing, dict):
                    merged = dict(existing)
                    merged.update(value)
                    setattr(row, field, merged)
                else:
                    setattr(row, field, value)
            elif field in self._column_keys():
                setattr(row, field, value)

        db.flush()
        db.refresh(row)
        self._validate_updated_row(db, row, PhieuKhamSucKhoeRead)
        self._commit(db)
        db.refresh(row)
        self._log(db, "UPDATE", nguoi_dung_id, du_lieu_cu=old, du_lieu_moi=self._row_to_dict(row))
        return row


phieu_kham_suc_khoe_crud = PhieuKhamSucKhoeCRUD(PhieuKhamSucKhoe)

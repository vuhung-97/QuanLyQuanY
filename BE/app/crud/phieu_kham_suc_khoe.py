import json

from app.crud.base import CRUDBase
from app.database.phieu_kham_suc_khoe import PhieuKhamSucKhoe

# Các cột JSON cần merge (chỉ ghi đè field có trong request)
JSON_MERGE_COLUMNS = {"tien_su_benh_tat", "kham_lam_sang", "xet_nghiem", "chan_doan_hinh_anh", "ket_luan"}


def _merge_json(old_val: str | None, new_val: str | None) -> str:
    old_json = json.loads(old_val) if old_val else {}
    new_json = json.loads(new_val) if new_val else {}
    merged = {**old_json, **new_json}
    return json.dumps(merged, ensure_ascii=False)


class PhieuKhamSucKhoeCRUD(CRUDBase):

    def create(self, db, payload, nguoi_dung_id=None):
        row = self.model(**self._payload_values(payload))
        # Khi tạo mới: nếu payload gửi {} thì lưu {} thay vì null
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
                old_val = getattr(row, field, None)
                merged = _merge_json(old_val, value)
                setattr(row, field, merged)
            elif field in self._column_keys():
                setattr(row, field, value)

        self._validate_updated_row(db, row, type(payload))
        self._commit(db)
        db.refresh(row)
        self._log(db, "UPDATE", nguoi_dung_id, du_lieu_cu=old, du_lieu_moi=self._row_to_dict(row))
        return row


phieu_kham_suc_khoe_crud = PhieuKhamSucKhoeCRUD(PhieuKhamSucKhoe)

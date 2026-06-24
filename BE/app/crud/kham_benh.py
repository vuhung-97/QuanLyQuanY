from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.database.kham_benh import KhamBenh


class KhamBenhCRUD(CRUDBase[KhamBenh, None, None]):
    def delete(self, db: Session, item_id: str, nguoi_dung_id: str | None = None) -> None:
        row = self.get(db, item_id)
        if row.trang_thai in ("đã_khám", "đã_nhận_thuốc"):
            raise HTTPException(
                status_code=400,
                detail="Không thể xoá ca khám đã kết thúc.",
            )
        super().delete(db, item_id, nguoi_dung_id=nguoi_dung_id)


kham_benh_crud = KhamBenhCRUD(KhamBenh)

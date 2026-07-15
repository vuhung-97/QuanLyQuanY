from sqlalchemy.orm import Session

from app.core.auth import get_password_hash
from app.crud.base import CRUDBase
from app.database.nguoi_dung import NguoiDung
from app.schemas.nguoi_dung import NguoiDungCreate, NguoiDungUpdate


class NguoiDungCRUD(CRUDBase[NguoiDung, NguoiDungCreate, NguoiDungUpdate]):
    def create(self, db: Session, payload: NguoiDungCreate, nguoi_dung_id: str | None = None) -> NguoiDung:
        return super().create(
            db, payload, nguoi_dung_id=nguoi_dung_id,
            mat_khau_hash=get_password_hash(payload.mat_khau),
        )

    def update(self, db: Session, item_id: str, payload: NguoiDungUpdate, nguoi_dung_id: str | None = None) -> NguoiDung:
        extra = {}
        if payload.mat_khau:
            extra["mat_khau_hash"] = get_password_hash(payload.mat_khau)
        return super().update(db, item_id, payload, nguoi_dung_id=nguoi_dung_id, **extra)


nguoi_dung_crud = NguoiDungCRUD(NguoiDung)

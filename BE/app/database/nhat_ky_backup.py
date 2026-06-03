from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from ..services.id_helper import generate_id


class NhatKyBackup(Base):
    __tablename__ = "nhat_ky_backup"

    id: Mapped[str] = mapped_column(String(20), primary_key=True, default=lambda: generate_id(20))
    thoi_gian_backup: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    duong_dan: Mapped[str | None] = mapped_column(String(100), nullable=True)
    id_nguoi_dung: Mapped[str | None] = mapped_column(
        String(20),
        ForeignKey("nguoi_dung.id", ondelete="SET NULL"),
        nullable=True,
    )

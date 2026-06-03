from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from app.database.id_helper import generate_id


class NhatKyThaoTac(Base):
    __tablename__ = "nhat_ky_thao_tac"

    id: Mapped[str] = mapped_column(String(20), primary_key=True, default=lambda: generate_id(20))
    id_nguoi_dung: Mapped[str | None] = mapped_column(
        String(20),
        ForeignKey("nguoi_dung.id", ondelete="SET NULL"),
        nullable=True,
    )
    thoi_gian: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    hanh_dong: Mapped[str | None] = mapped_column(String(50), nullable=True)
    ten_bang: Mapped[str | None] = mapped_column(String(50), nullable=True)
    du_lieu_cu: Mapped[dict | list | None] = mapped_column(JSONB, nullable=True)
    du_lieu_moi: Mapped[dict | list | None] = mapped_column(JSONB, nullable=True)
    dia_chi_ip: Mapped[str | None] = mapped_column(String(50), nullable=True)

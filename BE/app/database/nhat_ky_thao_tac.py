from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class NhatKyThaoTac(Base):
    __tablename__ = "nhat_ky_thao_tac"

    id: Mapped[str] = mapped_column(String(20), primary_key=True)
    id_nguoi_dung: Mapped[str | None] = mapped_column(
        String(20),
        ForeignKey("nguoi_dung.id", ondelete="SET NULL"),
    )
    thoi_gian: Mapped[datetime | None] = mapped_column(DateTime)
    hanh_dong: Mapped[str | None] = mapped_column(String(50))
    ten_bang: Mapped[str | None] = mapped_column(String(50))
    du_lieu_cu: Mapped[dict | list | None] = mapped_column(JSONB)
    du_lieu_moi: Mapped[dict | list | None] = mapped_column(JSONB)
    dia_chi_ip: Mapped[str | None] = mapped_column(String(50))

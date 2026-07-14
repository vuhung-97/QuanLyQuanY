from datetime import datetime

from sqlalchemy import Boolean, DateTime, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from ..services.id_helper import generate_id


class LichKhamSkNam(Base):
    __tablename__ = "lich_kham_sk_nam"

    ma_lich_kham: Mapped[str] = mapped_column(String(10), primary_key=True, default=lambda: generate_id(10))
    thoi_gian_bat_dau: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    thoi_gian_ket_thuc: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    da_duyet: Mapped[bool] = mapped_column(Boolean, default=False)

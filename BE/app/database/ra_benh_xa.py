from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class RaBenhXa(Base):
    __tablename__ = "ra_benh_xa"

    ma_ra_benh_xa: Mapped[str] = mapped_column(String(10), primary_key=True)
    ma_benh_an: Mapped[str | None] = mapped_column(String(10), ForeignKey("benh_an.ma_benh_an", ondelete="CASCADE"), nullable=True)
    thoi_gian_vao: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    thoi_gian_ra: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    phuong_phap_dieu_tri: Mapped[str | None] = mapped_column(Text, nullable=True)
    ghi_chu: Mapped[str | None] = mapped_column(Text, nullable=True)

from datetime import date

from sqlalchemy import Date, ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from ..services.id_helper import generate_id


class BenhNhanRaVao(Base):
    __tablename__ = "benh_nhan_ra_vao"

    ma_ra_vao: Mapped[str] = mapped_column(String(10), primary_key=True, default=lambda: generate_id(10))
    ma_benh_an: Mapped[str | None] = mapped_column(String(10), ForeignKey("benh_an.ma_benh_an", ondelete="CASCADE"), nullable=True)
    ngay_thang_nam: Mapped[date | None] = mapped_column(Date, server_default=func.current_date(), nullable=True)
    ly_do: Mapped[str | None] = mapped_column(Text, nullable=True)
    ngay_vao: Mapped[date | None] = mapped_column(Date, nullable=True)
    ngay_ra: Mapped[date | None] = mapped_column(Date, nullable=True)

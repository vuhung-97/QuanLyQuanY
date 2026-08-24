from datetime import datetime, date

from sqlalchemy import Date, DateTime, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from ..services.id_helper import generate_id


class PhieuNhapKho(Base):
    __tablename__ = "phieu_nhap_kho"

    ma_phieu_nhap: Mapped[str] = mapped_column(String(10), primary_key=True, default=lambda: generate_id(10))
    ma_phieu_du_tru: Mapped[str | None] = mapped_column(String(10), nullable=True)
    ngay_nhap: Mapped[date | None] = mapped_column(Date, server_default=func.current_date(), nullable=True)
    nguoi_nhap: Mapped[str | None] = mapped_column(String(20), nullable=True)
    ghi_chu: Mapped[str | None] = mapped_column(Text, nullable=True)

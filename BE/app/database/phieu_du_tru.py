from datetime import date

from sqlalchemy import Date, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class PhieuDuTru(Base):
    __tablename__ = "phieu_du_tru"

    ma_phieu_du_tru: Mapped[str] = mapped_column(String(10), primary_key=True)
    ngay_lap_phieu: Mapped[date | None] = mapped_column(Date, server_default=func.current_date())
    ghi_chu: Mapped[str | None] = mapped_column(Text)

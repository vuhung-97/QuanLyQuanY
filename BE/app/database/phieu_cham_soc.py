from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class PhieuChamSoc(Base):
    __tablename__ = "phieu_cham_soc"

    ma_phieu_cs: Mapped[str] = mapped_column(String(10), primary_key=True)
    ma_benh_an: Mapped[str | None] = mapped_column(String(10), ForeignKey("benh_an.ma_benh_an", ondelete="CASCADE"), nullable=True)
    so_giuong: Mapped[str | None] = mapped_column(String(50), nullable=True)
    buong: Mapped[str | None] = mapped_column(String(50), nullable=True)
    thoi_gian: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    theo_doi_dien_bien: Mapped[str | None] = mapped_column(Text, nullable=True)
    thuc_hien_y_lenh: Mapped[str | None] = mapped_column(Text, nullable=True)

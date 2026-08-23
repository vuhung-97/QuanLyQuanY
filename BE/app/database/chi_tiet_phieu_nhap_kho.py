from datetime import date

from sqlalchemy import Date, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class ChiTietPhieuNhapKho(Base):
    __tablename__ = "chi_tiet_phieu_nhap_kho"

    ma_phieu_nhap: Mapped[str] = mapped_column(String(10), ForeignKey("phieu_nhap_kho.ma_phieu_nhap", ondelete="CASCADE"), primary_key=True)
    ma_thuoc_vtyt: Mapped[str] = mapped_column(String(10), ForeignKey("thuoc_vtyt.ma_thuoc_vtyt", ondelete="RESTRICT"), primary_key=True)
    so_luong: Mapped[int] = mapped_column(Integer)
    so_lo: Mapped[str | None] = mapped_column(String(100), nullable=True)
    han_su_dung: Mapped[date | None] = mapped_column(Date, nullable=True)
    don_gia: Mapped[int | None] = mapped_column(Integer, nullable=True)

from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class ChiTietDonThuoc(Base):
    __tablename__ = "chi_tiet_don_thuoc"

    ma_don_thuoc: Mapped[str] = mapped_column(String(10), ForeignKey("don_thuoc.ma_don_thuoc", ondelete="CASCADE"), primary_key=True)
    ma_thuoc_vtyt: Mapped[str] = mapped_column(String(10), ForeignKey("thuoc_vtyt.ma_thuoc_vtyt", ondelete="RESTRICT"), primary_key=True)
    so_luong: Mapped[int] = mapped_column(Integer, default=1)
    huong_dieu_tri: Mapped[str | None] = mapped_column(Text, nullable=True)

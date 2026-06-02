from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class BenhAn(Base):
    __tablename__ = "benh_an"

    ma_benh_an: Mapped[str] = mapped_column(String(10), primary_key=True)
    ma_quan_nhan: Mapped[str | None] = mapped_column(String(10), ForeignKey("quan_nhan.ma_quan_nhan", ondelete="CASCADE"), nullable=True)
    ngoai_kieu: Mapped[str | None] = mapped_column(String(100), nullable=True)
    doi_tuong: Mapped[str | None] = mapped_column(String(100), nullable=True)
    quan_ly_nguoi_benh: Mapped[str | None] = mapped_column(Text, nullable=True)
    chan_doan: Mapped[str | None] = mapped_column(Text, nullable=True)
    tinh_trang_ra_vien: Mapped[str | None] = mapped_column(Text, nullable=True)
    chi_tiet_benh_an: Mapped[str | None] = mapped_column(Text, nullable=True)
    tong_ket_benh_an: Mapped[str | None] = mapped_column(Text, nullable=True)

from datetime import date

from sqlalchemy import Date, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from ..services.id_helper import generate_id


class DiTuyenSauDieuTri(Base):
    __tablename__ = "di_tuyen_sau_dieu_tri"

    ma_chuyen_tuyen: Mapped[str] = mapped_column(String(10), primary_key=True, default=lambda: generate_id(10))
    ma_quan_nhan: Mapped[str | None] = mapped_column(String(10), ForeignKey("quan_nhan.ma_quan_nhan", ondelete="CASCADE"), nullable=True)
    ma_giay_gt: Mapped[str | None] = mapped_column(String(10), ForeignKey("giay_gioi_thieu.ma_giay_gt", ondelete="CASCADE"), nullable=True)
    ngay_di: Mapped[date | None] = mapped_column(Date, nullable=True)
    chan_doan_luc_di: Mapped[str | None] = mapped_column(Text, nullable=True)
    ngay_ve: Mapped[date | None] = mapped_column(Date, nullable=True)
    chan_doan_luc_ve: Mapped[str | None] = mapped_column(Text, nullable=True)
    ket_qua_huong_dieu_tri: Mapped[str | None] = mapped_column(Text, nullable=True)
    noi_dieu_tri: Mapped[str | None] = mapped_column(String(255), nullable=True)

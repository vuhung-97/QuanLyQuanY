from datetime import date

from sqlalchemy import Date, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class DiTuyenSauDieuTri(Base):
    __tablename__ = "di_tuyen_sau_dieu_tri"

    ma_chuyen_tuyen: Mapped[str] = mapped_column(String(10), primary_key=True)
    ma_quan_nhan: Mapped[str | None] = mapped_column(String(10), ForeignKey("quan_nhan.ma_quan_nhan", ondelete="CASCADE"))
    ngay_di: Mapped[date | None] = mapped_column(Date)
    chan_doan_luc_di: Mapped[str | None] = mapped_column(Text)
    ngay_ve: Mapped[date | None] = mapped_column(Date)
    chan_doan_luc_ve: Mapped[str | None] = mapped_column(Text)
    ket_qua_huong_dieu_tri: Mapped[str | None] = mapped_column(Text)
    noi_dieu_tri: Mapped[str | None] = mapped_column(String(255))

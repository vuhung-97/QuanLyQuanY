from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from ..services.id_helper import generate_id


class KhamBenh(Base):
    __tablename__ = "kham_benh"

    ma_kham_benh: Mapped[str] = mapped_column(String(10), primary_key=True, default=lambda: generate_id(10))
    ma_quan_nhan: Mapped[str | None] = mapped_column(String(10), ForeignKey("quan_nhan.ma_quan_nhan", ondelete="CASCADE"), nullable=True)
    trang_thai: Mapped[str | None] = mapped_column(String(20), nullable=True)
    ngay_kham: Mapped[datetime | None] = mapped_column(DateTime, server_default=func.now(), nullable=True)
    trieu_chung: Mapped[str | None] = mapped_column(Text, nullable=True)
    phuong_phap_dieu_tri: Mapped[str | None] = mapped_column(Text, nullable=True)
    kham_lan: Mapped[int | None] = mapped_column(Integer, nullable=True)
    chan_doan: Mapped[str | None] = mapped_column(Text, nullable=True)
    ma_nhom_benh: Mapped[str | None] = mapped_column(String(10), ForeignKey("dm_nhom_benh.ma_nhom"), nullable=True)
    id_nguoi_dung: Mapped[str | None] = mapped_column(String(20), nullable=True)

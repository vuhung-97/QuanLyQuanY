from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class KhamBenh(Base):
    __tablename__ = "kham_benh"

    ma_kham_benh: Mapped[str] = mapped_column(String(10), primary_key=True)
    ma_quan_nhan: Mapped[str | None] = mapped_column(String(10), ForeignKey("quan_nhan.ma_quan_nhan", ondelete="CASCADE"), nullable=True)
    trieu_chung_chan_doan: Mapped[str | None] = mapped_column(Text, nullable=True)
    phuong_phap_dieu_tri: Mapped[str | None] = mapped_column(Text, nullable=True)
    kham_lan: Mapped[int | None] = mapped_column(Integer, nullable=True)
    ket_qua: Mapped[str | None] = mapped_column(Text, nullable=True)

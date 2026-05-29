from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class KhamBenh(Base):
    __tablename__ = "kham_benh"

    ma_kham_benh: Mapped[str] = mapped_column(String(10), primary_key=True)
    ma_quan_nhan: Mapped[str | None] = mapped_column(String(10), ForeignKey("quan_nhan.ma_quan_nhan", ondelete="CASCADE"))
    trieu_chung_chan_doan: Mapped[str | None] = mapped_column(Text)
    phuong_phap_dieu_tri: Mapped[str | None] = mapped_column(Text)
    kham_lan: Mapped[int | None] = mapped_column(Integer)
    ket_qua: Mapped[str | None] = mapped_column(Text)

from datetime import date

from sqlalchemy import Date, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from app.database.id_helper import generate_id


class LichKhamSkNam(Base):
    __tablename__ = "lich_kham_sk_nam"

    ma_lich_kham: Mapped[str] = mapped_column(String(10), primary_key=True, default=lambda: generate_id(10))
    ma_don_vi: Mapped[str | None] = mapped_column(String(10), ForeignKey("don_vi.ma_don_vi", ondelete="CASCADE"), nullable=True)
    thoi_gian_bat_dau: Mapped[date | None] = mapped_column(Date, nullable=True)
    thoi_gian_ket_thuc: Mapped[date | None] = mapped_column(Date, nullable=True)
    dia_diem: Mapped[str | None] = mapped_column(Text, nullable=True)

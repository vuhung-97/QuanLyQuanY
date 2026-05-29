from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class LichKhamSkNam(Base):
    __tablename__ = "lich_kham_sk_nam"

    ma_lich_kham: Mapped[str] = mapped_column(String(10), primary_key=True)
    ma_don_vi: Mapped[str | None] = mapped_column(String(10), ForeignKey("don_vi.ma_don_vi", ondelete="CASCADE"))
    thoi_gian_bat_dau: Mapped[datetime | None] = mapped_column(DateTime)
    thoi_gian_ket_thuc: Mapped[datetime | None] = mapped_column(DateTime)
    dia_diem: Mapped[str | None] = mapped_column(Text)

from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class LichKhamSkNamChiTiet(Base):
    __tablename__ = "lich_kham_sk_nam_chi_tiet"

    ma_lich_kham: Mapped[str] = mapped_column(String(10), ForeignKey("lich_kham_sk_nam.ma_lich_kham", ondelete="CASCADE"), primary_key=True)
    ma_don_vi: Mapped[str] = mapped_column(String(10), ForeignKey("don_vi.ma_don_vi", ondelete="CASCADE"), primary_key=True)
    thoi_gian_bat_dau: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    thoi_gian_ket_thuc: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    thoi_gian_lay_mau_bat_dau: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    thoi_gian_lay_mau_ket_thuc: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    thoi_gian_du_tru_lay_mau_bat_dau: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    thoi_gian_du_tru_lay_mau_ket_thuc: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    thoi_gian_du_tru_kham_bat_dau: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    thoi_gian_du_tru_kham_ket_thuc: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    dia_diem: Mapped[str | None] = mapped_column(Text, nullable=True)

from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class GiayGioiThieu(Base):
    __tablename__ = "giay_gioi_thieu"

    ma_giay_gt: Mapped[str] = mapped_column(String(10), primary_key=True)
    ma_quan_nhan: Mapped[str | None] = mapped_column(String(10), ForeignKey("quan_nhan.ma_quan_nhan", ondelete="CASCADE"), nullable=True)
    ten_benh_vien: Mapped[str | None] = mapped_column(String(255), nullable=True)
    can_benh: Mapped[str | None] = mapped_column(Text, nullable=True)
    y_kien_de_nghi: Mapped[str | None] = mapped_column(Text, nullable=True)
    thoi_gian_den_benh_vien: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    chan_doan: Mapped[str | None] = mapped_column(Text, nullable=True)
    quyet_dinh_y_sinh: Mapped[str | None] = mapped_column(Text, nullable=True)

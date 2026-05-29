from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class GiayGioiThieu(Base):
    __tablename__ = "giay_gioi_thieu"

    ma_giay_gt: Mapped[str] = mapped_column(String(10), primary_key=True)
    ma_quan_nhan: Mapped[str | None] = mapped_column(String(10), ForeignKey("quan_nhan.ma_quan_nhan", ondelete="CASCADE"))
    ten_benh_vien: Mapped[str | None] = mapped_column(String(255))
    so_suc_khoe: Mapped[str | None] = mapped_column(String(100))
    can_benh: Mapped[str | None] = mapped_column(Text)
    y_kien_de_nghi: Mapped[str | None] = mapped_column(Text)
    thoi_gian_den_benh_vien: Mapped[datetime | None] = mapped_column(DateTime)
    chan_doan: Mapped[str | None] = mapped_column(Text)
    quyet_dinh_y_sinh: Mapped[str | None] = mapped_column(Text)

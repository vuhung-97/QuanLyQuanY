from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class DonThuoc(Base):
    __tablename__ = "don_thuoc"

    ma_don_thuoc: Mapped[str] = mapped_column(String(10), primary_key=True)
    ma_quan_nhan: Mapped[str | None] = mapped_column(String(10), ForeignKey("quan_nhan.ma_quan_nhan", ondelete="CASCADE"))
    gioi_tinh: Mapped[str | None] = mapped_column(String(20))
    chan_doan: Mapped[str | None] = mapped_column(Text)

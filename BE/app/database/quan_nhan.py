from datetime import date

from sqlalchemy import Date, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class QuanNhan(Base):
    __tablename__ = "quan_nhan"

    ma_quan_nhan: Mapped[str] = mapped_column(String(10), primary_key=True)
    ma_don_vi: Mapped[str | None] = mapped_column(String(10), ForeignKey("don_vi.ma_don_vi", ondelete="SET NULL"))
    ho_ten: Mapped[str] = mapped_column(String(255), nullable=False)
    cap_bac: Mapped[str | None] = mapped_column(String(100))
    chuc_vu: Mapped[str | None] = mapped_column(String(100))
    ngay_sinh: Mapped[date | None] = mapped_column(Date)
    dia_chi: Mapped[str | None] = mapped_column(Text)
    so_dien_thoai: Mapped[str | None] = mapped_column(String(20))
    so_the_bhyt: Mapped[str | None] = mapped_column(String(50))
    han_bhyt: Mapped[date | None] = mapped_column(Date)

from datetime import date

from sqlalchemy import Boolean, Date, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class QuanNhan(Base):
    __tablename__ = "quan_nhan"

    ma_quan_nhan: Mapped[str] = mapped_column(String(10), primary_key=True)
    ho_ten: Mapped[str] = mapped_column(String(255))
    ma_don_vi: Mapped[str | None] = mapped_column(String(10), ForeignKey("don_vi.ma_don_vi", ondelete="SET NULL"), nullable=True)
    cap_bac: Mapped[str | None] = mapped_column(String(100), nullable=True)
    chuc_vu: Mapped[str | None] = mapped_column(String(100), nullable=True)
    ngay_sinh: Mapped[date | None] = mapped_column(Date, nullable=True)
    gioi_tinh: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    dan_toc: Mapped[str | None] = mapped_column(String(50), nullable=True)
    nghe_nghiep: Mapped[str | None] = mapped_column(String(100), nullable=True)
    dia_chi: Mapped[str | None] = mapped_column(Text, nullable=True)
    so_dien_thoai: Mapped[str | None] = mapped_column(String(20), nullable=True)
    so_the_bhyt: Mapped[str | None] = mapped_column(String(50), nullable=True)
    han_bhyt: Mapped[date | None] = mapped_column(Date, nullable=True)

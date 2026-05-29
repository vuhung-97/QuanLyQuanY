from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class PhieuXuatKho(Base):
    __tablename__ = "phieu_xuat_kho"

    ma_phieu_xuat: Mapped[str] = mapped_column(String(10), primary_key=True)
    ma_don_vi_nhan: Mapped[str | None] = mapped_column(String(10), ForeignKey("don_vi.ma_don_vi", ondelete="SET NULL"))
    ngay_thang_nam: Mapped[datetime | None] = mapped_column(DateTime, server_default=func.current_timestamp())
    ho_ten_nguoi_nhan: Mapped[str | None] = mapped_column(String(255))
    ly_do_xuat: Mapped[str | None] = mapped_column(Text)
    ghi_chu: Mapped[str | None] = mapped_column(Text)

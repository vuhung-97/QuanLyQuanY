from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from ..services.id_helper import generate_id


class PhieuXuatKho(Base):
    __tablename__ = "phieu_xuat_kho"

    ma_phieu_xuat: Mapped[str] = mapped_column(String(10), primary_key=True, default=lambda: generate_id(10))
    ma_don_vi_nhan: Mapped[str | None] = mapped_column(String(10), ForeignKey("don_vi.ma_don_vi", ondelete="SET NULL"), nullable=True)
    ngay_thang_nam: Mapped[datetime | None] = mapped_column(DateTime, server_default=func.current_timestamp(), nullable=True)
    ho_ten_nguoi_nhan: Mapped[str | None] = mapped_column(String(255), nullable=True)
    ly_do_xuat: Mapped[str | None] = mapped_column(Text, nullable=True)
    ghi_chu: Mapped[str | None] = mapped_column(Text, nullable=True)
    trang_thai: Mapped[str | None] = mapped_column(String(50), nullable=True)
    nguoi_xuat: Mapped[str | None] = mapped_column(String(10), nullable=True)
    nguoi_duyet: Mapped[str | None] = mapped_column(String(10), nullable=True)

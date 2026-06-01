from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class NhatKyDangNhap(Base):
    __tablename__ = "nhat_ky_dang_nhap"

    id: Mapped[str] = mapped_column(String(20), primary_key=True)
    id_nguoi_dung: Mapped[str | None] = mapped_column(
        String(20),
        ForeignKey("nguoi_dung.id", ondelete="SET NULL"),
    )
    thoi_gian: Mapped[datetime | None] = mapped_column(DateTime)
    trang_thai_thanh_cong: Mapped[bool | None] = mapped_column(Boolean)
    thiet_bi: Mapped[str | None] = mapped_column(Text)

from datetime import datetime
from decimal import Decimal

from sqlalchemy import DateTime, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class SoNhapXuat(Base):
    __tablename__ = "so_nhap_xuat"

    ma_giao_dich: Mapped[str] = mapped_column(String(10), primary_key=True)
    ma_thuoc_vtyt: Mapped[str | None] = mapped_column(String(10), ForeignKey("thuoc_vtyt.ma_thuoc_vtyt", ondelete="RESTRICT"), nullable=True)
    quy_cach: Mapped[str | None] = mapped_column(String(255), nullable=True)
    don_gia: Mapped[Decimal | None] = mapped_column(Numeric(15, 2), nullable=True)
    ngay_nhap_xuat: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    ten_don_vi_doi_tac: Mapped[str | None] = mapped_column(String(255), nullable=True)
    so_xuat_nhap_lenh: Mapped[str | None] = mapped_column(String(100), nullable=True)
    so_luong_nhap: Mapped[int | None] = mapped_column(Integer, default=0, nullable=True)
    so_luong_xuat: Mapped[int | None] = mapped_column(Integer, default=0, nullable=True)
    so_luong_con_lai: Mapped[int | None] = mapped_column(Integer, default=0, nullable=True)
    ghi_chu: Mapped[str | None] = mapped_column(Text, nullable=True)

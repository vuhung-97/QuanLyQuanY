from datetime import date
from decimal import Decimal

from sqlalchemy import Date, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from ..services.id_helper import generate_id


class ThuocVtyt(Base):
    __tablename__ = "thuoc_vtyt"

    ma_thuoc_vtyt: Mapped[str] = mapped_column(String(10), primary_key=True, default=lambda: generate_id(10))
    ten_thuoc_vtyt: Mapped[str] = mapped_column(String(255))
    don_vi_tinh: Mapped[str | None] = mapped_column(String(50), nullable=True)
    so_luong: Mapped[int | None] = mapped_column(Integer, default=0, nullable=True)
    so_lo_han_dung: Mapped[str | None] = mapped_column(String(255), nullable=True)
    nam_san_xuat: Mapped[int | None] = mapped_column(Integer, nullable=True)
    cap_chat_luong: Mapped[str | None] = mapped_column(String(100), nullable=True)
    phan_loai: Mapped[str | None] = mapped_column(String(100), nullable=True)
    mo_ta: Mapped[str | None] = mapped_column(Text, nullable=True)
    han_su_dung: Mapped[date | None] = mapped_column(Date, nullable=True)
    don_gia: Mapped[Decimal | None] = mapped_column(Numeric(15, 2), nullable=True)
    nha_san_xuat: Mapped[str | None] = mapped_column(String(255), nullable=True)
    hoat_chat: Mapped[str | None] = mapped_column(String(255), nullable=True)

from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class ThuocVtyt(Base):
    __tablename__ = "thuoc_vtyt"

    ma_thuoc_vtyt: Mapped[str] = mapped_column(String(10), primary_key=True)
    ten_thuoc_vtyt: Mapped[str] = mapped_column(String(255))
    don_vi_tinh: Mapped[str | None] = mapped_column(String(50), nullable=True)
    so_luong: Mapped[int | None] = mapped_column(Integer, default=0, nullable=True)
    so_lo_han_dung: Mapped[str | None] = mapped_column(String(255), nullable=True)
    nam_san_xuat: Mapped[int | None] = mapped_column(Integer, nullable=True)
    cap_chat_luong: Mapped[str | None] = mapped_column(String(100), nullable=True)

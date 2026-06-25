from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from ..services.id_helper import generate_id


class Buong(Base):
    __tablename__ = "buong"

    ma_buong: Mapped[str] = mapped_column(String(10), primary_key=True, default=lambda: generate_id(10))
    ten_buong: Mapped[str] = mapped_column(String(50))
    so_giuong_toi_da: Mapped[int | None] = mapped_column(Integer, default=4)

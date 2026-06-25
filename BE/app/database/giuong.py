from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from ..services.id_helper import generate_id


class Giuong(Base):
    __tablename__ = "giuong"

    ma_giuong: Mapped[str] = mapped_column(String(10), primary_key=True, default=lambda: generate_id(10))
    ma_buong: Mapped[str] = mapped_column(String(10), ForeignKey("buong.ma_buong", ondelete="CASCADE"))
    ten_giuong: Mapped[str] = mapped_column(String(10))
    trang_thai: Mapped[str] = mapped_column(String(20), default="trống")

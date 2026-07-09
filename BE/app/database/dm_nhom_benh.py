from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from app.services.id_helper import generate_id


class DmNhomBenh(Base):
    __tablename__ = "dm_nhom_benh"

    ma_nhom: Mapped[str] = mapped_column(String(10), primary_key=True, default=lambda: generate_id(10))
    ten_nhom: Mapped[str] = mapped_column(String(255))
    mo_ta: Mapped[str | None] = mapped_column(Text, nullable=True)

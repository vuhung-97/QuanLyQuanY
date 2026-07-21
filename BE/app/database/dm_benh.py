from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from app.services.id_helper import generate_id


class DmBenh(Base):
    __tablename__ = "dm_benh"

    ma_benh: Mapped[str] = mapped_column(
        String(10), primary_key=True, default=lambda: generate_id(10)
    )
    ten_benh: Mapped[str] = mapped_column(String(255))
    ma_nhom_benh: Mapped[str | None] = mapped_column(
        String(10), ForeignKey("dm_nhom_benh.ma_nhom"), nullable=True
    )
    mo_ta: Mapped[str | None] = mapped_column(Text, nullable=True)

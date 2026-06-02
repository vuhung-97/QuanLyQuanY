from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class VaiTro(Base):
    __tablename__ = "vai_tro"

    id: Mapped[str] = mapped_column(String(20), primary_key=True)
    ten_vai_tro: Mapped[str] = mapped_column(String(100))
    mo_ta: Mapped[str | None] = mapped_column(Text, nullable=True)

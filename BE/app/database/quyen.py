from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class Quyen(Base):
    __tablename__ = "quyen"

    id: Mapped[str] = mapped_column(String(100), primary_key=True)
    ten_quyen: Mapped[str] = mapped_column(String(100), nullable=False)
    mo_ta: Mapped[str | None] = mapped_column(Text, nullable=True)

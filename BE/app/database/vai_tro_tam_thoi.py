from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class VaiTroTamThoi(Base):
    __tablename__ = "vai_tro_tam_thoi"

    ma_vai_tro: Mapped[str] = mapped_column(String(30), primary_key=True)
    ten_vai_tro: Mapped[str] = mapped_column(String(100))

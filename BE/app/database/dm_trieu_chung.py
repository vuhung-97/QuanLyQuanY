from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from app.services.id_helper import generate_id


class DmTrieuChung(Base):
    __tablename__ = "dm_trieu_chung"

    ma_trieu_chung: Mapped[str] = mapped_column(
        String(10), primary_key=True, default=lambda: generate_id(10)
    )
    ten_trieu_chung: Mapped[str] = mapped_column(String(255))
    mo_ta: Mapped[str | None] = mapped_column(Text, nullable=True)

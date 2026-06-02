from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class VaiTroQuyen(Base):
    __tablename__ = "vai_tro_quyen"

    id_vai_tro: Mapped[str] = mapped_column(
        String(20),
        ForeignKey("vai_tro.id", ondelete="CASCADE"),
        primary_key=True,
    )
    id_quyen: Mapped[str] = mapped_column(
        String(100),
        ForeignKey("quyen.id", ondelete="CASCADE"),
        primary_key=True,
    )

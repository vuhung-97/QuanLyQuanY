from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class DonVi(Base):
    __tablename__ = "don_vi"

    ma_don_vi: Mapped[str] = mapped_column(String(10), primary_key=True)
    ten_don_vi: Mapped[str] = mapped_column(String(255))
    ma_don_vi_truc_thuoc: Mapped[str | None] = mapped_column(
        String(10), ForeignKey("don_vi.ma_don_vi", ondelete="SET NULL"), nullable=True,
    )

    don_vi_truc_thuoc: Mapped["DonVi | None"] = relationship(remote_side=[ma_don_vi])

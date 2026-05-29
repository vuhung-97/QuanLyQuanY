from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class ChiTietDuTru(Base):
    __tablename__ = "chi_tiet_du_tru"

    ma_phieu_du_tru: Mapped[str] = mapped_column(String(10), ForeignKey("phieu_du_tru.ma_phieu_du_tru", ondelete="CASCADE"), primary_key=True)
    ma_thuoc_vtyt: Mapped[str] = mapped_column(String(10), ForeignKey("thuoc_vtyt.ma_thuoc_vtyt", ondelete="CASCADE"), primary_key=True)
    so_luong: Mapped[int] = mapped_column(Integer, nullable=False, default=1)

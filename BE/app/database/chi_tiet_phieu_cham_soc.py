from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class ChiTietPhieuChamSoc(Base):
    __tablename__ = "chi_tiet_phieu_cham_soc"

    ma_phieu_cs: Mapped[str] = mapped_column(String(10), ForeignKey("phieu_cham_soc.ma_phieu_cs", ondelete="CASCADE"), primary_key=True)
    ma_thuoc_vtyt: Mapped[str] = mapped_column(String(10), ForeignKey("thuoc_vtyt.ma_thuoc_vtyt", ondelete="RESTRICT"), primary_key=True)
    so_luong: Mapped[int] = mapped_column(Integer, default=1)

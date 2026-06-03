from datetime import date

from sqlalchemy import Date, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from app.database.id_helper import generate_id


class PhieuKhamSucKhoe(Base):
    __tablename__ = "phieu_kham_suc_khoe"

    ma_phieu_kham: Mapped[str] = mapped_column(String(10), primary_key=True, default=lambda: generate_id(10))
    ma_quan_nhan: Mapped[str | None] = mapped_column(String(10), ForeignKey("quan_nhan.ma_quan_nhan", ondelete="CASCADE"), nullable=True)
    ngay_nhap_ngu: Mapped[date | None] = mapped_column(Date, nullable=True)
    tien_su_benh_tat: Mapped[str | None] = mapped_column(Text, nullable=True)
    kham_lam_sang: Mapped[str | None] = mapped_column(Text, nullable=True)
    kham_can_lam_sang: Mapped[str | None] = mapped_column(Text, nullable=True)
    ket_luan: Mapped[str | None] = mapped_column(Text, nullable=True)
    chi_dan_can_thiet: Mapped[str | None] = mapped_column(Text, nullable=True)

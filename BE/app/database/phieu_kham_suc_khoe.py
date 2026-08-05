from sqlalchemy import ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from ..services.id_helper import generate_id


class PhieuKhamSucKhoe(Base):
    __tablename__ = "phieu_kham_suc_khoe"
    __table_args__ = (
        UniqueConstraint("ma_lich_kham", "ma_lay_mau", name="uq_phieu_lich_ma_lay_mau"),
    )

    ma_phieu_kham: Mapped[str] = mapped_column(String(10), primary_key=True, default=lambda: generate_id(10))
    ma_quan_nhan: Mapped[str | None] = mapped_column(String(10), ForeignKey("quan_nhan.ma_quan_nhan", ondelete="CASCADE"), nullable=True)
    ma_lich_kham: Mapped[str | None] = mapped_column(String(10), ForeignKey("lich_kham_sk_nam.ma_lich_kham", ondelete="SET NULL"), nullable=True)
    nam: Mapped[int | None] = mapped_column(Integer, nullable=True)
    tong_quan: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    kham_lam_sang: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    xet_nghiem: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    chan_doan_hinh_anh: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    ket_luan: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    trang_thai: Mapped[str | None] = mapped_column(String(20), nullable=True, default="chua_lay_mau")
    ma_lay_mau: Mapped[str | None] = mapped_column(String(4), nullable=True)

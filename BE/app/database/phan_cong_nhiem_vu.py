from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from ..services.id_helper import generate_id


class PhanCongNhiemVu(Base):
    __tablename__ = "phan_cong_nhiem_vu"

    id: Mapped[str] = mapped_column(String(10), primary_key=True, default=lambda: generate_id(10))
    ma_lich_kham: Mapped[str] = mapped_column(String(10), ForeignKey("lich_kham_sk_nam.ma_lich_kham", ondelete="CASCADE"))
    id_nguoi_dung: Mapped[str] = mapped_column(String(20))  # No FK — tách bảo mật & nghiệp vụ
    ma_vai_tro: Mapped[str] = mapped_column(String(30), ForeignKey("vai_tro_tam_thoi.ma_vai_tro"))

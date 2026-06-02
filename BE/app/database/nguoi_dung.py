from sqlalchemy import Boolean, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class NguoiDung(Base):
    __tablename__ = "nguoi_dung"

    id: Mapped[str] = mapped_column(String(20), primary_key=True)
    ten_dang_nhap: Mapped[str] = mapped_column(String(50))
    mat_khau_hash: Mapped[str] = mapped_column(Text)
    ho_ten: Mapped[str] = mapped_column(String(100))
    id_vai_tro: Mapped[str | None] = mapped_column(
        String(20),
        ForeignKey("vai_tro.id", ondelete="SET NULL"),
        nullable=True,
    )
    id_quan_nhan: Mapped[str | None] = mapped_column(String(20), nullable=True)
    trang_thai: Mapped[bool] = mapped_column(Boolean, default=False)

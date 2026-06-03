from datetime import datetime

from app.schemas.base import SchemaBase
from pydantic import Field


class NhatKyDangNhapBase(SchemaBase):
    id_nguoi_dung: str | None = Field(default=None, max_length=20)
    thoi_gian: datetime | None = None
    trang_thai_thanh_cong: bool | None = None
    thiet_bi: str | None = None


class NhatKyDangNhapCreate(NhatKyDangNhapBase):
    id: str | None = None


class NhatKyDangNhapUpdate(SchemaBase):
    id_nguoi_dung: str | None = None
    thoi_gian: datetime | None = None
    trang_thai_thanh_cong: bool | None = None
    thiet_bi: str | None = None


class NhatKyDangNhapRead(NhatKyDangNhapBase):
    id: str = Field(max_length=20)
    ho_ten: str | None = None

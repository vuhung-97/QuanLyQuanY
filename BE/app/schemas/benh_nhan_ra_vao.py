from datetime import date

from app.schemas.base import SchemaBase
from pydantic import Field


class BenhNhanRaVaoBase(SchemaBase):
    ma_benh_an: str | None = Field(default=None, max_length=10)
    ngay_thang_nam: date | None = None
    ly_do: str | None = None
    ngay_vao: date | None = None
    ngay_ra: date | None = None


class BenhNhanRaVaoCreate(BenhNhanRaVaoBase):
    ma_ra_vao: str | None = None


class BenhNhanRaVaoUpdate(SchemaBase):
    ma_benh_an: str | None = None
    ngay_thang_nam: date | None = None
    ly_do: str | None = None
    ngay_vao: date | None = None
    ngay_ra: date | None = None


class BenhNhanRaVaoRead(BenhNhanRaVaoBase):
    ma_ra_vao: str = Field(max_length=10)
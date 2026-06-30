from datetime import date

from app.schemas.base import SchemaBase
from pydantic import Field


class PhieuNhapKhoBase(SchemaBase):
    ma_phieu_du_tru: str | None = Field(default=None, max_length=10)
    ngay_nhap: date | None = None
    nguoi_nhap: str | None = Field(default=None, max_length=10)
    ghi_chu: str | None = None


class PhieuNhapKhoCreate(PhieuNhapKhoBase):
    ma_phieu_nhap: str | None = None


class PhieuNhapKhoUpdate(SchemaBase):
    ma_phieu_du_tru: str | None = Field(default=None, max_length=10)
    ngay_nhap: date | None = None
    nguoi_nhap: str | None = Field(default=None, max_length=10)
    ghi_chu: str | None = None


class PhieuNhapKhoRead(PhieuNhapKhoBase):
    ma_phieu_nhap: str = Field(max_length=10)

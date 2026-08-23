from datetime import date

from app.schemas.base import SchemaBase
from pydantic import Field


class ChiTietPhieuNhapKhoBase(SchemaBase):
    so_luong: int = Field(ge=0)
    so_lo: str | None = Field(default=None, max_length=100)
    han_su_dung: date | None = None
    don_gia: int | None = Field(default=None, ge=0)


class ChiTietPhieuNhapKhoCreate(ChiTietPhieuNhapKhoBase):
    ma_phieu_nhap: str = Field(max_length=10)
    ma_thuoc_vtyt: str = Field(max_length=10)


class ChiTietPhieuNhapKhoUpdate(SchemaBase):
    so_luong: int | None = Field(default=None, ge=0)
    so_lo: str | None = Field(default=None, max_length=100)
    han_su_dung: date | None = None
    don_gia: int | None = Field(default=None, ge=0)


class ChiTietPhieuNhapKhoRead(ChiTietPhieuNhapKhoBase):
    ma_phieu_nhap: str = Field(max_length=10)
    ma_thuoc_vtyt: str = Field(max_length=10)

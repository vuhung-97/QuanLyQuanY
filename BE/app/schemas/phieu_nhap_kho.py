from datetime import date

from app.schemas.base import SchemaBase
from pydantic import Field


class PhieuNhapKhoBase(SchemaBase):
    ma_phieu_du_tru: str | None = Field(default=None, max_length=10)
    ngay_nhap: date | None = None
    nguoi_nhap: str | None = Field(default=None, max_length=10)
    ghi_chu: str | None = Field(default=None, max_length=1000)


class PhieuNhapKhoCreate(PhieuNhapKhoBase):
    ma_phieu_nhap: str | None = None


class PhieuNhapKhoUpdate(SchemaBase):
    ma_phieu_du_tru: str | None = Field(default=None, max_length=10)
    ngay_nhap: date | None = None
    nguoi_nhap: str | None = Field(default=None, max_length=10)
    ghi_chu: str | None = Field(default=None, max_length=1000)


class PhieuNhapKhoRead(PhieuNhapKhoBase):
    ma_phieu_nhap: str = Field(max_length=10)


class NhapKhoItem(SchemaBase):
    ma_thuoc_vtyt: str = Field(max_length=10)
    so_luong: int = Field(ge=0)


class NhapKhoRequest(SchemaBase):
    items: list[NhapKhoItem]
    ngay_nhap: date | None = None


class TaoPhieuNhapItem(SchemaBase):
    ma_thuoc_vtyt: str = Field(max_length=10)
    so_luong: int = Field(ge=0)
    so_lo: str | None = Field(default=None, max_length=100)
    han_su_dung: date | None = None
    don_gia: int | None = Field(default=None, ge=0)


class TaoPhieuNhapRequest(SchemaBase):
    ma_phieu_du_tru: str | None = Field(default=None, max_length=10)
    items: list[TaoPhieuNhapItem] = Field(min_length=1)
    ngay_nhap: date | None = None
    ghi_chu: str | None = Field(default=None, max_length=1000)


class CapNhatPhieuNhapRequest(SchemaBase):
    items: list[TaoPhieuNhapItem] = Field(min_length=1)
    ngay_nhap: date | None = None
    ghi_chu: str | None = Field(default=None, max_length=1000)

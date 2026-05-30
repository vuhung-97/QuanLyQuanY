from datetime import datetime
from decimal import Decimal

from app.schemas.base import SchemaBase
from pydantic import Field


class SoNhapXuatBase(SchemaBase):
    ma_thuoc_vtyt: str | None = Field(default=None, max_length=10)
    quy_cach: str | None = Field(default=None, max_length=255)
    don_gia: Decimal | None = None
    ngay_nhap_xuat: datetime | None = None
    ten_don_vi_doi_tac: str | None = Field(default=None, max_length=255)
    so_xuat_nhap_lenh: str | None = Field(default=None, max_length=100)
    so_luong_nhap: int | None = 0
    so_luong_xuat: int | None = 0
    so_luong_con_lai: int | None = 0
    ghi_chu: str | None = None


class SoNhapXuatCreate(SoNhapXuatBase):
    ma_giao_dich: str = Field(max_length=10)


class SoNhapXuatUpdate(SchemaBase):
    ma_thuoc_vtyt: str | None = None
    quy_cach: str | None = None
    don_gia: Decimal | None = None
    ngay_nhap_xuat: datetime | None = None
    ten_don_vi_doi_tac: str | None = None
    so_xuat_nhap_lenh: str | None = None
    so_luong_nhap: int | None = None
    so_luong_xuat: int | None = None
    so_luong_con_lai: int | None = None
    ghi_chu: str | None = None


class SoNhapXuatRead(SoNhapXuatBase):
    ma_giao_dich: str = Field(max_length=10)
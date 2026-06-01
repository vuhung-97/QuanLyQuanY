from datetime import datetime
from decimal import Decimal

from app.schemas.base import SchemaBase
from pydantic import Field, model_validator


class SoNhapXuatBase(SchemaBase):
    ma_thuoc_vtyt: str | None = Field(default=None, max_length=10)
    quy_cach: str | None = Field(default=None, max_length=255)
    don_gia: Decimal | None = Field(default=None, ge=0)
    ngay_nhap_xuat: datetime | None = None
    ten_don_vi_doi_tac: str | None = Field(default=None, max_length=255)
    so_xuat_nhap_lenh: str | None = Field(default=None, max_length=100)
    so_luong_nhap: int | None = Field(default=0, ge=0)
    so_luong_xuat: int | None = Field(default=0, ge=0)
    so_luong_con_lai: int | None = Field(default=0, ge=0)
    ghi_chu: str | None = None

    @model_validator(mode='after')
    def validate_ngay_nhap_xuat(self):
        if self.ngay_nhap_xuat and self.ngay_nhap_xuat.year < 1900:
            raise ValueError("Năm nhập xuất không hợp lệ")
        return self


class SoNhapXuatCreate(SoNhapXuatBase):
    ma_giao_dich: str = Field(max_length=10)


class SoNhapXuatUpdate(SchemaBase):
    ma_thuoc_vtyt: str | None = Field(default=None, max_length=10)
    quy_cach: str | None = Field(default=None, max_length=255)
    don_gia: Decimal | None = Field(default=None, ge=0)
    ngay_nhap_xuat: datetime | None = None
    ten_don_vi_doi_tac: str | None = Field(default=None, max_length=255)
    so_xuat_nhap_lenh: str | None = Field(default=None, max_length=100)
    so_luong_nhap: int | None = Field(default=None, ge=0)
    so_luong_xuat: int | None = Field(default=None, ge=0)
    so_luong_con_lai: int | None = Field(default=None, ge=0)
    ghi_chu: str | None = None

    @model_validator(mode='after')
    def validate_ngay_nhap_xuat(self):
        if self.ngay_nhap_xuat and self.ngay_nhap_xuat.year < 1900:
            raise ValueError("Năm nhập xuất không hợp lệ")
        return self


class SoNhapXuatRead(SoNhapXuatBase):
    ma_giao_dich: str = Field(max_length=10)

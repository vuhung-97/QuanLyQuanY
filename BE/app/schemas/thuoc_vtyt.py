from datetime import date

from app.schemas.base import SchemaBase
from pydantic import Field


class ThuocVtytBase(SchemaBase):
    ten_thuoc_vtyt: str = Field(max_length=255)
    don_vi_tinh: str | None = Field(default=None, max_length=50)
    so_luong: int | None = Field(default=0, ge=0)
    so_lo_han_dung: str | None = Field(default=None, max_length=255)
    nam_san_xuat: int | None = Field(default=None, ge=1900, le=2100)
    cap_chat_luong: str | None = Field(default=None, max_length=100)
    phan_loai: str | None = Field(default=None, max_length=100)
    mo_ta: str | None = Field(default=None)
    han_su_dung: date | None = None
    don_gia: int | None = Field(default=None, ge=0)
    nha_san_xuat: str | None = Field(default=None, max_length=255)
    hoat_chat: str | None = Field(default=None, max_length=255)
    loai: str | None = Field(default=None, max_length=10)

class ThuocVtytCreate(ThuocVtytBase):
    ma_thuoc_vtyt: str | None = None

class ThuocVtytUpdate(SchemaBase):
    ten_thuoc_vtyt: str | None = Field(default=None, max_length=255)
    don_vi_tinh: str | None = Field(default=None, max_length=50)
    so_luong: int | None = Field(default=None, ge=0)
    so_lo_han_dung: str | None = Field(default=None, max_length=255)
    nam_san_xuat: int | None = Field(default=None, ge=1900, le=2100)
    cap_chat_luong: str | None = Field(default=None, max_length=100)
    phan_loai: str | None = Field(default=None, max_length=100)
    mo_ta: str | None = Field(default=None)
    han_su_dung: date | None = None
    don_gia: int | None = Field(default=None, ge=0)
    nha_san_xuat: str | None = Field(default=None, max_length=255)
    hoat_chat: str | None = Field(default=None, max_length=255)
    loai: str | None = Field(default=None, max_length=10)


class ThuocVtytRead(ThuocVtytBase):
    ma_thuoc_vtyt: str = Field(max_length=10)

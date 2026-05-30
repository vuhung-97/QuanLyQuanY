from app.schemas.base import SchemaBase
from pydantic import Field


class ThuocVtytBase(SchemaBase):
    ten_thuoc_vtyt: str = Field(max_length=255)
    don_vi_tinh: str | None = Field(default=None, max_length=50)
    so_luong: int | None = 0
    so_lo_han_dung: str | None = Field(default=None, max_length=255)
    nam_san_xuat: int | None = None
    cap_chat_luong: str | None = Field(default=None, max_length=100)


class ThuocVtytCreate(ThuocVtytBase):
    ma_thuoc_vtyt: str = Field(max_length=10)


class ThuocVtytUpdate(SchemaBase):
    ten_thuoc_vtyt: str | None = None
    don_vi_tinh: str | None = None
    so_luong: int | None = None
    so_lo_han_dung: str | None = None
    nam_san_xuat: int | None = None
    cap_chat_luong: str | None = None


class ThuocVtytRead(ThuocVtytBase):
    ma_thuoc_vtyt: str = Field(max_length=10)
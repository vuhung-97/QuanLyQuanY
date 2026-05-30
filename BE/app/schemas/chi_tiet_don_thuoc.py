from app.schemas.base import SchemaBase
from pydantic import Field


class ChiTietDonThuocBase(SchemaBase):
    so_luong: int = 1
    huong_dieu_tri: str | None = None


class ChiTietDonThuocCreate(ChiTietDonThuocBase):
    ma_don_thuoc: str = Field(max_length=10)
    ma_thuoc_vtyt: str = Field(max_length=10)


class ChiTietDonThuocUpdate(SchemaBase):
    so_luong: int | None = None
    huong_dieu_tri: str | None = None


class ChiTietDonThuocRead(ChiTietDonThuocBase):
    ma_don_thuoc: str = Field(max_length=10)
    ma_thuoc_vtyt: str = Field(max_length=10)
from app.schemas.base import SchemaBase
from pydantic import Field


class ChiTietXuatKhoBase(SchemaBase):
    so_luong: int


class ChiTietXuatKhoCreate(ChiTietXuatKhoBase):
    ma_phieu_xuat: str = Field(max_length=10)
    ma_thuoc_vtyt: str = Field(max_length=10)


class ChiTietXuatKhoUpdate(SchemaBase):
    so_luong: int | None = None


class ChiTietXuatKhoRead(ChiTietXuatKhoBase):
    ma_phieu_xuat: str = Field(max_length=10)
    ma_thuoc_vtyt: str = Field(max_length=10)
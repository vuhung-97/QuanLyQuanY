from app.schemas.base import SchemaBase
from pydantic import Field


class ChiTietXuatKhoBase(SchemaBase):
    so_luong: int
    so_luong_thuc_xuat: int | None = None


class ChiTietXuatKhoCreate(ChiTietXuatKhoBase):
    ma_phieu_xuat: str = Field(max_length=10)
    ma_thuoc_vtyt: str = Field(max_length=10)


class ChiTietXuatKhoUpdate(SchemaBase):
    so_luong: int | None = None
    so_luong_thuc_xuat: int | None = None


class ChiTietXuatKhoRead(ChiTietXuatKhoBase):
    ma_phieu_xuat: str = Field(max_length=10)
    ma_thuoc_vtyt: str = Field(max_length=10)
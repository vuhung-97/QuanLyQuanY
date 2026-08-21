from app.schemas.base import SchemaBase
from pydantic import Field


class ChiTietPhieuChamSocBase(SchemaBase):
    so_luong: int = Field(default=1, ge=0)


class ChiTietPhieuChamSocCreate(ChiTietPhieuChamSocBase):
    ma_phieu_cs: str = Field(max_length=10)
    ma_thuoc_vtyt: str = Field(max_length=10)


class ChiTietPhieuChamSocUpdate(SchemaBase):
    so_luong: int | None = Field(default=None, ge=0)


class ChiTietPhieuChamSocRead(ChiTietPhieuChamSocBase):
    ma_phieu_cs: str = Field(max_length=10)
    ma_thuoc_vtyt: str = Field(max_length=10)
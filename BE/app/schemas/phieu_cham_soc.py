from datetime import datetime

from app.schemas.base import SchemaBase
from pydantic import Field


class ChiTietPhieuChamSocItem(SchemaBase):
    ma_thuoc_vtyt: str = Field(max_length=10)
    so_luong: int | None = Field(default=None, ge=0)


class PhieuChamSocBase(SchemaBase):
    ma_benh_an: str | None = Field(default=None, max_length=10)
    so_giuong: str | None = Field(default=None, max_length=50)
    buong: str | None = Field(default=None, max_length=50)
    thoi_gian: datetime | None = None
    theo_doi_dien_bien: str | None = Field(default=None, max_length=5000)
    thuc_hien_y_lenh: str | None = Field(default=None, max_length=5000)
    ma_nguoi_dung: str | None = Field(default=None, max_length=20)


class PhieuChamSocCreate(PhieuChamSocBase):
    ma_phieu_cs: str | None = None
    chi_tiet: list[ChiTietPhieuChamSocItem] = []


class PhieuChamSocUpdate(SchemaBase):
    ma_benh_an: str | None = None
    so_giuong: str | None = None
    buong: str | None = None
    thoi_gian: datetime | None = None
    theo_doi_dien_bien: str | None = Field(default=None, max_length=5000)
    thuc_hien_y_lenh: str | None = Field(default=None, max_length=5000)
    ma_nguoi_dung: str | None = None
    chi_tiet: list[ChiTietPhieuChamSocItem] | None = None


class PhieuChamSocRead(PhieuChamSocBase):
    ma_phieu_cs: str = Field(max_length=10)
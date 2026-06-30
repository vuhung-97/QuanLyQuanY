from app.schemas.base import SchemaBase
from pydantic import Field


class DonThuocBase(SchemaBase):
    ma_quan_nhan: str | None = Field(default=None, max_length=10)
    ma_kham_benh: str | None = Field(default=None, max_length=10)


class DonThuocCreate(DonThuocBase):
    ma_don_thuoc: str | None = None


class DonThuocUpdate(SchemaBase):
    ma_quan_nhan: str | None = None
    ma_kham_benh: str | None = None


class DonThuocRead(DonThuocBase):
    ma_don_thuoc: str = Field(max_length=10)
    id_nguoi_dung: str | None = None
    ten_nguoi_cap_thuoc: str | None = None
    vai_tro_nguoi_cap_thuoc: str | None = None
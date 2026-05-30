from app.schemas.base import SchemaBase
from pydantic import Field


class DonThuocBase(SchemaBase):
    ma_quan_nhan: str | None = Field(default=None, max_length=10)
    gioi_tinh: str | None = Field(default=None, max_length=20)
    chan_doan: str | None = None


class DonThuocCreate(DonThuocBase):
    ma_don_thuoc: str = Field(max_length=10)


class DonThuocUpdate(SchemaBase):
    ma_quan_nhan: str | None = None
    gioi_tinh: str | None = None
    chan_doan: str | None = None


class DonThuocRead(DonThuocBase):
    ma_don_thuoc: str = Field(max_length=10)
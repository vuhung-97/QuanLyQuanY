from datetime import datetime

from app.schemas.base import SchemaBase
from pydantic import Field


class LichKhamSkNamBase(SchemaBase):
    ma_don_vi: str | None = Field(default=None, max_length=10)
    thoi_gian_bat_dau: datetime | None = None
    thoi_gian_ket_thuc: datetime | None = None
    dia_diem: str | None = None


class LichKhamSkNamCreate(LichKhamSkNamBase):
    ma_lich_kham: str = Field(max_length=10)


class LichKhamSkNamUpdate(SchemaBase):
    ma_don_vi: str | None = None
    thoi_gian_bat_dau: datetime | None = None
    thoi_gian_ket_thuc: datetime | None = None
    dia_diem: str | None = None


class LichKhamSkNamRead(LichKhamSkNamBase):
    ma_lich_kham: str = Field(max_length=10)
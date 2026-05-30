from datetime import datetime

from app.schemas.base import SchemaBase
from pydantic import Field


class RaBenhXaBase(SchemaBase):
    ma_benh_an: str | None = Field(default=None, max_length=10)
    thoi_gian_vao: datetime | None = None
    thoi_gian_ra: datetime | None = None
    phuong_phap_dieu_tri: str | None = None
    ghi_chu: str | None = None


class RaBenhXaCreate(RaBenhXaBase):
    ma_ra_benh_xa: str = Field(max_length=10)


class RaBenhXaUpdate(SchemaBase):
    ma_benh_an: str | None = None
    thoi_gian_vao: datetime | None = None
    thoi_gian_ra: datetime | None = None
    phuong_phap_dieu_tri: str | None = None
    ghi_chu: str | None = None


class RaBenhXaRead(RaBenhXaBase):
    ma_ra_benh_xa: str = Field(max_length=10)
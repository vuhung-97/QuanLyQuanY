from datetime import datetime

from app.schemas.base import SchemaBase
from pydantic import Field, model_validator


class RaBenhXaBase(SchemaBase):
    ma_benh_an: str | None = Field(default=None, max_length=10)
    thoi_gian_vao: datetime | None = None
    thoi_gian_ra: datetime | None = None
    phuong_phap_dieu_tri: str | None = None
    ghi_chu: str | None = None

    @model_validator(mode='after')
    def validate_thoi_gian_ra_truoc_vao(self):
        if self.thoi_gian_ra and self.thoi_gian_vao:
            if self.thoi_gian_ra < self.thoi_gian_vao:
                raise ValueError("Thời gian ra bệnh xá phải sau thời gian vào")
        return self


class RaBenhXaCreate(RaBenhXaBase):
    ma_ra_benh_xa: str | None = None


class RaBenhXaUpdate(SchemaBase):
    ma_benh_an: str | None = Field(default=None, max_length=10)
    thoi_gian_vao: datetime | None = None
    thoi_gian_ra: datetime | None = None
    phuong_phap_dieu_tri: str | None = None
    ghi_chu: str | None = None

    @model_validator(mode='after')
    def validate_thoi_gian_ra_truoc_vao(self):
        if self.thoi_gian_ra and self.thoi_gian_vao:
            if self.thoi_gian_ra < self.thoi_gian_vao:
                raise ValueError("Thời gian ra bệnh xá phải sau thời gian vào")
        return self


class RaBenhXaRead(RaBenhXaBase):
    ma_ra_benh_xa: str = Field(max_length=10)

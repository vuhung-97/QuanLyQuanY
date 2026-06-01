from datetime import datetime

from app.schemas.base import SchemaBase
from pydantic import Field, model_validator


class LichKhamSkNamBase(SchemaBase):
    ma_don_vi: str | None = Field(default=None, max_length=10)
    thoi_gian_bat_dau: datetime | None = None
    thoi_gian_ket_thuc: datetime | None = None
    dia_diem: str | None = None

    @model_validator(mode='after')
    def validate_thoi_gian(self):
        if self.thoi_gian_bat_dau and self.thoi_gian_ket_thuc:
            if self.thoi_gian_ket_thuc < self.thoi_gian_bat_dau:
                raise ValueError("Thời gian kết thúc phải sau thời gian bắt đầu")
        return self


class LichKhamSkNamCreate(LichKhamSkNamBase):
    ma_lich_kham: str = Field(max_length=10)


class LichKhamSkNamUpdate(SchemaBase):
    ma_don_vi: str | None = Field(default=None, max_length=10)
    thoi_gian_bat_dau: datetime | None = None
    thoi_gian_ket_thuc: datetime | None = None
    dia_diem: str | None = None

    @model_validator(mode='after')
    def validate_thoi_gian(self):
        if self.thoi_gian_bat_dau and self.thoi_gian_ket_thuc:
            if self.thoi_gian_ket_thuc < self.thoi_gian_bat_dau:
                raise ValueError("Thời gian kết thúc phải sau thời gian bắt đầu")
        return self


class LichKhamSkNamRead(LichKhamSkNamBase):
    ma_lich_kham: str = Field(max_length=10)

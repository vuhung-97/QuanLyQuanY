from datetime import datetime

from app.schemas.base import SchemaBase
from pydantic import Field, field_validator, model_validator


class LichKhamSkNamBase(SchemaBase):
    thoi_gian_bat_dau: datetime | None = None
    thoi_gian_ket_thuc: datetime | None = None
    trang_thai: str = "cho_gui"

    @field_validator("thoi_gian_bat_dau", "thoi_gian_ket_thuc", mode="before")
    @classmethod
    def empty_str_to_none(cls, v):
        if v == "":
            return None
        return v

    @model_validator(mode='after')
    def validate_thoi_gian(self):
        if self.thoi_gian_bat_dau and self.thoi_gian_ket_thuc:
            if self.thoi_gian_ket_thuc <= self.thoi_gian_bat_dau:
                raise ValueError("Thời gian kết thúc phải sau thời gian bắt đầu")
        return self


class LichKhamSkNamCreate(LichKhamSkNamBase):
    ma_lich_kham: str | None = None


class LichKhamSkNamUpdate(SchemaBase):
    thoi_gian_bat_dau: datetime | None = None
    thoi_gian_ket_thuc: datetime | None = None
    trang_thai: str | None = None

    @field_validator("thoi_gian_bat_dau", "thoi_gian_ket_thuc", mode="before")
    @classmethod
    def empty_str_to_none(cls, v):
        if v == "":
            return None
        return v

    @model_validator(mode='after')
    def validate_thoi_gian(self):
        if self.thoi_gian_bat_dau and self.thoi_gian_ket_thuc:
            if self.thoi_gian_ket_thuc <= self.thoi_gian_bat_dau:
                raise ValueError("Thời gian kết thúc phải sau thời gian bắt đầu")
        return self


class LichKhamSkNamRead(LichKhamSkNamBase):
    ma_lich_kham: str = Field(max_length=10)

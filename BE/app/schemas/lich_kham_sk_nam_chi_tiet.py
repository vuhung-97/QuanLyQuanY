from datetime import datetime

from app.schemas.base import SchemaBase
from pydantic import Field, field_validator, model_validator


class LichKhamSkNamChiTietBase(SchemaBase):
    ma_lich_kham: str = Field(max_length=10)
    ma_don_vi: str = Field(max_length=10)
    thoi_gian_bat_dau: datetime | None = None
    thoi_gian_ket_thuc: datetime | None = None
    dia_diem: str | None = None

    @model_validator(mode='after')
    def validate_thoi_gian(self):
        if self.thoi_gian_bat_dau and self.thoi_gian_ket_thuc:
            if self.thoi_gian_ket_thuc <= self.thoi_gian_bat_dau:
                raise ValueError("Thời gian kết thúc phải sau thời gian bắt đầu")
        return self


class LichKhamSkNamChiTietCreate(SchemaBase):
    ma_don_vi: str = Field(max_length=10)
    thoi_gian_bat_dau: datetime | None = None
    thoi_gian_ket_thuc: datetime | None = None
    dia_diem: str | None = None

    @field_validator("thoi_gian_bat_dau", "thoi_gian_ket_thuc", mode="before")
    @classmethod
    def empty_str_to_none(cls, v):
        if v == "":
            return None
        return v


class LichKhamSkNamChiTietUpdate(SchemaBase):
    thoi_gian_bat_dau: datetime | None = None
    thoi_gian_ket_thuc: datetime | None = None
    dia_diem: str | None = None

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


class LichKhamSkNamChiTietRead(LichKhamSkNamChiTietBase):
    pass

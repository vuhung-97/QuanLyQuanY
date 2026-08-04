from datetime import datetime

from app.schemas.base import SchemaBase
from pydantic import Field, field_validator, model_validator


THOI_GIAN_FIELDS = [
    "thoi_gian_bat_dau",
    "thoi_gian_ket_thuc",
    "thoi_gian_lay_mau_bat_dau",
    "thoi_gian_lay_mau_ket_thuc",
    "thoi_gian_du_tru_lay_mau_bat_dau",
    "thoi_gian_du_tru_lay_mau_ket_thuc",
    "thoi_gian_du_tru_kham_bat_dau",
    "thoi_gian_du_tru_kham_ket_thuc",
]

TIME_RANGES = [
    ("thoi_gian_bat_dau", "thoi_gian_ket_thuc", "Thời gian khám"),
    ("thoi_gian_lay_mau_bat_dau", "thoi_gian_lay_mau_ket_thuc", "Thời gian lấy máu"),
    ("thoi_gian_du_tru_lay_mau_bat_dau", "thoi_gian_du_tru_lay_mau_ket_thuc", "Thời gian dự trù lấy máu"),
    ("thoi_gian_du_tru_kham_bat_dau", "thoi_gian_du_tru_kham_ket_thuc", "Thời gian dự trù khám sức khỏe"),
]


class LichKhamSkNamChiTietBase(SchemaBase):
    ma_lich_kham: str = Field(max_length=10)
    ma_don_vi: str = Field(max_length=10)
    thoi_gian_bat_dau: datetime | None = None
    thoi_gian_ket_thuc: datetime | None = None
    thoi_gian_lay_mau_bat_dau: datetime | None = None
    thoi_gian_lay_mau_ket_thuc: datetime | None = None
    thoi_gian_du_tru_lay_mau_bat_dau: datetime | None = None
    thoi_gian_du_tru_lay_mau_ket_thuc: datetime | None = None
    thoi_gian_du_tru_kham_bat_dau: datetime | None = None
    thoi_gian_du_tru_kham_ket_thuc: datetime | None = None
    dia_diem: str | None = None

    @model_validator(mode='after')
    def validate_thoi_gian(self):
        values = self.model_dump()
        for bat_dau_field, ket_thuc_field, label in TIME_RANGES:
            bd = values.get(bat_dau_field)
            kt = values.get(ket_thuc_field)
            if bd and kt and kt <= bd:
                raise ValueError(f"{label}: thời gian kết thúc phải sau thời gian bắt đầu")
        return self


class LichKhamSkNamChiTietCreate(SchemaBase):
    ma_don_vi: str = Field(max_length=10)
    thoi_gian_bat_dau: datetime | None = None
    thoi_gian_ket_thuc: datetime | None = None
    thoi_gian_lay_mau_bat_dau: datetime | None = None
    thoi_gian_lay_mau_ket_thuc: datetime | None = None
    thoi_gian_du_tru_lay_mau_bat_dau: datetime | None = None
    thoi_gian_du_tru_lay_mau_ket_thuc: datetime | None = None
    thoi_gian_du_tru_kham_bat_dau: datetime | None = None
    thoi_gian_du_tru_kham_ket_thuc: datetime | None = None
    dia_diem: str | None = None

    @field_validator(*THOI_GIAN_FIELDS, mode="before")
    @classmethod
    def empty_str_to_none(cls, v):
        if v == "":
            return None
        return v

    @model_validator(mode='after')
    def validate_thoi_gian(self):
        values = self.model_dump()
        for bat_dau_field, ket_thuc_field, label in TIME_RANGES:
            bd = values.get(bat_dau_field)
            kt = values.get(ket_thuc_field)
            if bd and kt and kt <= bd:
                raise ValueError(f"{label}: thời gian kết thúc phải sau thời gian bắt đầu")
        return self


class LichKhamSkNamChiTietUpdate(SchemaBase):
    thoi_gian_bat_dau: datetime | None = None
    thoi_gian_ket_thuc: datetime | None = None
    thoi_gian_lay_mau_bat_dau: datetime | None = None
    thoi_gian_lay_mau_ket_thuc: datetime | None = None
    thoi_gian_du_tru_lay_mau_bat_dau: datetime | None = None
    thoi_gian_du_tru_lay_mau_ket_thuc: datetime | None = None
    thoi_gian_du_tru_kham_bat_dau: datetime | None = None
    thoi_gian_du_tru_kham_ket_thuc: datetime | None = None
    dia_diem: str | None = None

    @field_validator(*THOI_GIAN_FIELDS, mode="before")
    @classmethod
    def empty_str_to_none(cls, v):
        if v == "":
            return None
        return v

    @model_validator(mode='after')
    def validate_thoi_gian(self):
        values = self.model_dump()
        for bat_dau_field, ket_thuc_field, label in TIME_RANGES:
            bd = values.get(bat_dau_field)
            kt = values.get(ket_thuc_field)
            if bd and kt and kt <= bd:
                raise ValueError(f"{label}: thời gian kết thúc phải sau thời gian bắt đầu")
        return self


class LichKhamSkNamChiTietRead(LichKhamSkNamChiTietBase):
    pass

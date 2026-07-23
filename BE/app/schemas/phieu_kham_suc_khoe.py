import json

from pydantic import Field, field_validator

from app.schemas.base import SchemaBase


class PhieuKhamSucKhoeBase(SchemaBase):
    ma_quan_nhan: str | None = Field(default=None, max_length=10)
    ma_lich_kham: str | None = Field(default=None, max_length=10)
    nam: int | None = None
    tong_quan: str | None = None
    kham_lam_sang: str | None = None
    xet_nghiem: str | None = None
    chan_doan_hinh_anh: str | None = None
    ket_luan: str | None = None
    trang_thai: str | None = None
    ma_lay_mau: str | None = None


class PhieuKhamSucKhoeCreate(PhieuKhamSucKhoeBase):
    ma_phieu_kham: str | None = None


class PhieuKhamSucKhoeUpdate(SchemaBase):
    ma_quan_nhan: str | None = None
    ma_lich_kham: str | None = Field(default=None, max_length=10)
    nam: int | None = None
    tong_quan: dict | str | None = None
    kham_lam_sang: dict | str | None = None
    xet_nghiem: dict | str | None = None
    chan_doan_hinh_anh: dict | str | None = None
    ket_luan: dict | str | None = None
    trang_thai: str | None = None
    ma_lay_mau: str | None = None

    @field_validator("tong_quan", "kham_lam_sang", "xet_nghiem", "chan_doan_hinh_anh", "ket_luan", mode="before")
    @classmethod
    def parse_json_string(cls, v):
        if isinstance(v, str):
            return json.loads(v)
        return v


class PhieuKhamSucKhoeRead(PhieuKhamSucKhoeBase):
    ma_phieu_kham: str = Field(max_length=10)
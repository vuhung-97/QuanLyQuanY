from app.schemas.base import SchemaBase
from pydantic import Field


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


class PhieuKhamSucKhoeCreate(PhieuKhamSucKhoeBase):
    ma_phieu_kham: str | None = None


class PhieuKhamSucKhoeUpdate(SchemaBase):
    ma_quan_nhan: str | None = None
    ma_lich_kham: str | None = Field(default=None, max_length=10)
    nam: int | None = None
    tong_quan: str | None = None
    kham_lam_sang: str | None = None
    xet_nghiem: str | None = None
    chan_doan_hinh_anh: str | None = None
    ket_luan: str | None = None
    trang_thai: str | None = None


class PhieuKhamSucKhoeRead(PhieuKhamSucKhoeBase):
    ma_phieu_kham: str = Field(max_length=10)
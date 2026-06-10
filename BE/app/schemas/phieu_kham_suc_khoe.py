from datetime import date

from app.schemas.base import SchemaBase
from pydantic import Field


class PhieuKhamSucKhoeBase(SchemaBase):
    ma_quan_nhan: str | None = Field(default=None, max_length=10)
    tien_su_benh_tat: str | None = None
    kham_lam_sang: str | None = None
    kham_can_lam_sang: str | None = None
    ket_luan: str | None = None


class PhieuKhamSucKhoeCreate(PhieuKhamSucKhoeBase):
    ma_phieu_kham: str | None = None


class PhieuKhamSucKhoeUpdate(SchemaBase):
    ma_quan_nhan: str | None = None
    tien_su_benh_tat: str | None = None
    kham_lam_sang: str | None = None
    kham_can_lam_sang: str | None = None
    ket_luan: str | None = None


class PhieuKhamSucKhoeRead(PhieuKhamSucKhoeBase):
    ma_phieu_kham: str = Field(max_length=10)
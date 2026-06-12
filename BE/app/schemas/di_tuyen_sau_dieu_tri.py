from datetime import date

from app.schemas.base import SchemaBase
from pydantic import Field


class DiTuyenSauDieuTriBase(SchemaBase):
    ma_quan_nhan: str | None = Field(default=None, max_length=10)
    ma_giay_gt: str | None = Field(default=None, max_length=10)
    ngay_di: date | None = None
    chan_doan_luc_di: str | None = None
    ngay_ve: date | None = None
    chan_doan_luc_ve: str | None = None
    ket_qua_huong_dieu_tri: str | None = None
    noi_dieu_tri: str | None = Field(default=None, max_length=255)


class DiTuyenSauDieuTriCreate(DiTuyenSauDieuTriBase):
    ma_chuyen_tuyen: str | None = None


class DiTuyenSauDieuTriUpdate(SchemaBase):
    ma_quan_nhan: str | None = None
    ma_giay_gt: str | None = None
    ngay_di: date | None = None
    chan_doan_luc_di: str | None = None
    ngay_ve: date | None = None
    chan_doan_luc_ve: str | None = None
    ket_qua_huong_dieu_tri: str | None = None
    noi_dieu_tri: str | None = None


class DiTuyenSauDieuTriRead(DiTuyenSauDieuTriBase):
    ma_chuyen_tuyen: str = Field(max_length=10)
from datetime import datetime

from app.schemas.base import SchemaBase
from pydantic import Field


class KhamBenhBase(SchemaBase):
    ma_quan_nhan: str | None = Field(default=None, max_length=10)
    trang_thai: str | None = "chờ"
    ngay_kham: datetime | None = None
    trieu_chung: str | None = None
    phuong_phap_dieu_tri: str | None = None
    kham_lan: int | None = None
    chan_doan: str | None = None


class KhamBenhCreate(KhamBenhBase):
    ma_kham_benh: str | None = None


class KhamBenhUpdate(SchemaBase):
    ma_quan_nhan: str | None = None
    trang_thai: str | None = None
    trieu_chung: str | None = None
    phuong_phap_dieu_tri: str | None = None
    kham_lan: int | None = None
    chan_doan: str | None = None


class KhamBenhRead(KhamBenhBase):
    ma_kham_benh: str = Field(max_length=10)
    ho_ten: str | None = None
    ma_don_vi: str | None = None
    ten_don_vi: str | None = None
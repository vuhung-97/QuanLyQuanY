from datetime import datetime

from app.schemas.base import SchemaBase
from pydantic import Field


class GiayGioiThieuBase(SchemaBase):
    ma_quan_nhan: str | None = Field(default=None, max_length=10)
    ma_kham_benh: str | None = Field(default=None, max_length=10)
    ten_benh_vien: str | None = Field(default=None, max_length=255)
    can_benh: str | None = Field(default=None, max_length=5000)
    y_kien_de_nghi: str | None = Field(default=None, max_length=5000)
    thoi_gian_den_benh_vien: datetime | None = None
    chan_doan: str | None = Field(default=None, max_length=5000)
    quyet_dinh_y_sinh: str | None = Field(default=None, max_length=5000)


class GiayGioiThieuCreate(GiayGioiThieuBase):
    ma_giay_gt: str | None = None


class GiayGioiThieuUpdate(SchemaBase):
    ma_quan_nhan: str | None = None
    ten_benh_vien: str | None = None
    can_benh: str | None = Field(default=None, max_length=5000)
    y_kien_de_nghi: str | None = Field(default=None, max_length=5000)
    thoi_gian_den_benh_vien: datetime | None = None
    chan_doan: str | None = Field(default=None, max_length=5000)
    quyet_dinh_y_sinh: str | None = Field(default=None, max_length=5000)


class GiayGioiThieuRead(GiayGioiThieuBase):
    ma_giay_gt: str = Field(max_length=10)
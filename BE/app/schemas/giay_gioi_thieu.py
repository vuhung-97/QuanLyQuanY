from datetime import datetime

from app.schemas.base import SchemaBase
from pydantic import Field


class GiayGioiThieuBase(SchemaBase):
    ma_quan_nhan: str | None = Field(default=None, max_length=10)
    ten_benh_vien: str | None = Field(default=None, max_length=255)
    so_suc_khoe: bool = Field(default=False)
    can_benh: str | None = None
    y_kien_de_nghi: str | None = None
    thoi_gian_den_benh_vien: datetime | None = None
    chan_doan: str | None = None
    quyet_dinh_y_sinh: str | None = None


class GiayGioiThieuCreate(GiayGioiThieuBase):
    ma_giay_gt: str = Field(max_length=10)


class GiayGioiThieuUpdate(SchemaBase):
    ma_quan_nhan: str | None = None
    ten_benh_vien: str | None = None
    so_suc_khoe: bool | None = None
    can_benh: str | None = None
    y_kien_de_nghi: str | None = None
    thoi_gian_den_benh_vien: datetime | None = None
    chan_doan: str | None = None
    quyet_dinh_y_sinh: str | None = None


class GiayGioiThieuRead(GiayGioiThieuBase):
    ma_giay_gt: str = Field(max_length=10)
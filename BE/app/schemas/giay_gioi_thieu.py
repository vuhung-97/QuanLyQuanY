from datetime import datetime

from app.schemas.base import SchemaBase


class GiayGioiThieuBase(SchemaBase):
    ma_giay_gt: str
    ma_quan_nhan: str | None = None
    ten_benh_vien: str | None = None
    so_suc_khoe: str | None = None
    can_benh: str | None = None
    y_kien_de_nghi: str | None = None
    thoi_gian_den_benh_vien: datetime | None = None
    chan_doan: str | None = None
    quyet_dinh_y_sinh: str | None = None
    

class GiayGioiThieuCreate(GiayGioiThieuBase):
    pass


class GiayGioiThieuUpdate(GiayGioiThieuBase):
    pass


class GiayGioiThieuRead(GiayGioiThieuBase):
    pass

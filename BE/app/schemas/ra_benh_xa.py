from datetime import datetime

from app.schemas.base import SchemaBase


class RaBenhXaBase(SchemaBase):
    ma_ra_benh_xa: str
    ma_benh_an: str | None = None
    thoi_gian_vao: datetime | None = None
    thoi_gian_ra: datetime | None = None
    phuong_phap_dieu_tri: str | None = None
    ghi_chu: str | None = None


class RaBenhXaCreate(RaBenhXaBase):
    pass


class RaBenhXaUpdate(RaBenhXaBase):
    pass


class RaBenhXaRead(RaBenhXaBase):
    pass

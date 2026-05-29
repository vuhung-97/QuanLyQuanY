from datetime import date
from app.schemas.base import SchemaBase


class BenhNhanRaVaoBase(SchemaBase):
    ma_ra_vao: str
    ma_benh_an: str | None = None
    ngay_thang_nam: date | None = None
    ly_do: str | None = None
    ngay_vao: date | None = None
    ngay_ra: date | None = None


class BenhNhanRaVaoCreate(BenhNhanRaVaoBase):
    pass


class BenhNhanRaVaoUpdate(BenhNhanRaVaoBase):
    pass


class BenhNhanRaVaoRead(BenhNhanRaVaoBase):
    pass

from datetime import date

from app.schemas.base import SchemaBase


class QuanNhanBase(SchemaBase):
    ma_quan_nhan: str
    ma_don_vi: str | None = None
    ho_ten: str
    cap_bac: str | None = None
    chuc_vu: str | None = None
    ngay_sinh: date | None = None
    dia_chi: str | None = None
    so_dien_thoai: str | None = None
    so_the_bhyt: str | None = None
    han_bhyt: date | None = None


class QuanNhanCreate(QuanNhanBase):
    pass


class QuanNhanUpdate(SchemaBase):
    ma_quan_nhan: str | None = None
    ma_don_vi: str | None = None
    ho_ten: str | None = None
    cap_bac: str | None = None
    chuc_vu: str | None = None
    ngay_sinh: date | None = None
    dia_chi: str | None = None
    so_dien_thoai: str | None = None
    so_the_bhyt: str | None = None
    han_bhyt: date | None = None


class QuanNhanRead(QuanNhanBase):
    pass

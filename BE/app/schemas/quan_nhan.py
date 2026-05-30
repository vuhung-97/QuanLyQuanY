from datetime import date

from app.schemas.base import SchemaBase
from pydantic import Field


class QuanNhanBase(SchemaBase):
    ma_don_vi: str | None = Field(default=None, max_length=10)
    ho_ten: str = Field(max_length=255)
    cap_bac: str | None = Field(default=None, max_length=100)
    chuc_vu: str | None = Field(default=None, max_length=100)
    ngay_sinh: date | None = None
    dia_chi: str | None = None
    so_dien_thoai: str | None = Field(default=None, max_length=20)
    so_the_bhyt: str | None = Field(default=None, max_length=50)
    han_bhyt: date | None = None


class QuanNhanCreate(QuanNhanBase):
    ma_quan_nhan: str = Field(max_length=10)


class QuanNhanUpdate(SchemaBase):
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
    ma_quan_nhan: str = Field(max_length=10)
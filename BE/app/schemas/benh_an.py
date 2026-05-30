from app.schemas.base import SchemaBase
from pydantic import Field


class BenhAnBase(SchemaBase):
    ma_quan_nhan: str | None = Field(default=None, max_length=10)
    gioi_tinh: str | None = Field(default=None, max_length=20)
    nghe_nghiep: str | None = Field(default=None, max_length=100)
    dan_toc: str | None = Field(default=None, max_length=50)
    ngoai_kieu: str | None = Field(default=None, max_length=100)
    doi_tuong: str | None = Field(default=None, max_length=100)
    quan_ly_nguoi_benh: str | None = None
    chan_doan: str | None = None
    tinh_trang_ra_vien: str | None = None
    chi_tiet_benh_an: str | None = None
    tong_ket_benh_an: str | None = None


class BenhAnCreate(BenhAnBase):
    ma_benh_an: str = Field(max_length=10)


class BenhAnUpdate(SchemaBase):
    ma_quan_nhan: str | None = None
    gioi_tinh: str | None = None
    nghe_nghiep: str | None = None
    dan_toc: str | None = None
    ngoai_kieu: str | None = None
    doi_tuong: str | None = None
    quan_ly_nguoi_benh: str | None = None
    chan_doan: str | None = None
    tinh_trang_ra_vien: str | None = None
    chi_tiet_benh_an: str | None = None
    tong_ket_benh_an: str | None = None


class BenhAnRead(BenhAnBase):
    ma_benh_an: str = Field(max_length=10)
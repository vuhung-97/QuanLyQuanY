from datetime import datetime

from app.schemas.base import SchemaBase
from pydantic import Field


class PhieuXuatKhoBase(SchemaBase):
    ma_don_vi_nhan: str | None = Field(default=None, max_length=10)
    ma_quan_nhan_nhan: str | None = Field(default=None, max_length=10)
    ngay_thang_nam: datetime | None = None
    ho_ten_nguoi_nhan: str | None = Field(default=None, max_length=255)
    ly_do_xuat: str | None = None
    ghi_chu: str | None = None
    trang_thai: str = Field(default="cho_gui", max_length=50)
    nguoi_xuat: str | None = Field(default=None, max_length=50)
    nguoi_duyet: str | None = Field(default=None, max_length=50)


class PhieuXuatKhoCreate(PhieuXuatKhoBase):
    ma_phieu_xuat: str | None = None


class PhieuXuatKhoUpdate(SchemaBase):
    ma_don_vi_nhan: str | None = None
    ma_quan_nhan_nhan: str | None = None
    ngay_thang_nam: datetime | None = None
    ho_ten_nguoi_nhan: str | None = None
    ly_do_xuat: str | None = None
    ghi_chu: str | None = None
    trang_thai: str | None = Field(default=None, max_length=50)
    nguoi_xuat: str | None = Field(default=None, max_length=50)
    nguoi_duyet: str | None = Field(default=None, max_length=50)


class PhieuXuatKhoRead(PhieuXuatKhoBase):
    ma_phieu_xuat: str = Field(max_length=10)
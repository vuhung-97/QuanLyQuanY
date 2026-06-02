from app.schemas.base import SchemaBase
from pydantic import Field


class NguoiDungBase(SchemaBase):
    ten_dang_nhap: str = Field(max_length=50)
    ho_ten: str = Field(max_length=100)
    id_vai_tro: str | None = Field(default=None, max_length=20)
    id_quan_nhan: str | None = Field(default=None, max_length=20)
    trang_thai: bool = Field(default=False)


class NguoiDungCreate(NguoiDungBase):
    id: str = Field(max_length=20)
    mat_khau: str = Field(min_length=8)


class NguoiDungUpdate(SchemaBase):
    ten_dang_nhap: str | None = None
    mat_khau: str | None = Field(default=None, min_length=8)
    ho_ten: str | None = None
    id_vai_tro: str | None = None
    id_quan_nhan: str | None = None
    trang_thai: bool | None = None


class NguoiDungRead(NguoiDungBase):
    id: str = Field(max_length=20)

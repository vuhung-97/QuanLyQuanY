from app.schemas.base import SchemaBase
from pydantic import Field


class GiuongBase(SchemaBase):
    ma_buong: str = Field(max_length=10)
    ten_giuong: str = Field(max_length=10)
    trang_thai: str = "trống"


class GiuongCreate(GiuongBase):
    ma_giuong: str | None = None


class GiuongUpdate(SchemaBase):
    ma_buong: str | None = None
    ten_giuong: str | None = None
    trang_thai: str | None = None


class GiuongRead(GiuongBase):
    ma_giuong: str = Field(max_length=10)


class ChuyenGiuongRequest(SchemaBase):
    ma_giuong_moi: str = Field(max_length=10)

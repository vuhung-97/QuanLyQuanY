from app.schemas.base import SchemaBase
from pydantic import Field


class BuongBase(SchemaBase):
    ten_buong: str = Field(max_length=50)
    so_giuong_toi_da: int | None = None


class BuongCreate(BuongBase):
    ma_buong: str | None = None


class BuongUpdate(SchemaBase):
    ten_buong: str | None = None
    so_giuong_toi_da: int | None = None


class BuongRead(BuongBase):
    ma_buong: str = Field(max_length=10)

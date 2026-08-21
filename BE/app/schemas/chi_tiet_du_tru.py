from app.schemas.base import SchemaBase
from pydantic import Field


class ChiTietDuTruBase(SchemaBase):
    so_luong: int = Field(default=1, ge=0)


class ChiTietDuTruCreate(ChiTietDuTruBase):
    ma_phieu_du_tru: str = Field(max_length=10)
    ma_thuoc_vtyt: str = Field(max_length=10)


class ChiTietDuTruUpdate(SchemaBase):
    so_luong: int | None = Field(default=None, ge=0)


class ChiTietDuTruRead(ChiTietDuTruBase):
    ma_phieu_du_tru: str = Field(max_length=10)
    ma_thuoc_vtyt: str = Field(max_length=10)
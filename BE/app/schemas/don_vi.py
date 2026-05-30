from app.schemas.base import SchemaBase
from pydantic import Field


class DonViBase(SchemaBase):
    ten_don_vi: str = Field(max_length=255)
    ma_don_vi_truc_thuoc: str | None = Field(default=None, max_length=10)


class DonViCreate(DonViBase):
    ma_don_vi: str = Field(max_length=10)


class DonViUpdate(SchemaBase):
    ten_don_vi: str | None = None
    ma_don_vi_truc_thuoc: str | None = None


class DonViRead(DonViBase):
    ma_don_vi: str = Field(max_length=10)
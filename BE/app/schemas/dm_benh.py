from app.schemas.base import SchemaBase
from pydantic import Field


class DmBenhBase(SchemaBase):
    ten_benh: str = Field(max_length=255)
    ma_nhom_benh: str | None = None
    mo_ta: str | None = None


class DmBenhCreate(DmBenhBase):
    ma_benh: str | None = Field(default=None, max_length=10)


class DmBenhUpdate(SchemaBase):
    ten_benh: str | None = None
    ma_nhom_benh: str | None = None
    mo_ta: str | None = None


class DmBenhRead(DmBenhBase):
    ma_benh: str = Field(max_length=10)

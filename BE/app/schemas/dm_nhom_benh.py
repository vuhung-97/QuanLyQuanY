from app.schemas.base import SchemaBase
from pydantic import Field


class DmNhomBenhBase(SchemaBase):
    ten_nhom: str = Field(max_length=255)
    mo_ta: str | None = None


class DmNhomBenhCreate(DmNhomBenhBase):
    ma_nhom: str = Field(max_length=10)


class DmNhomBenhUpdate(SchemaBase):
    ten_nhom: str | None = None
    mo_ta: str | None = None


class DmNhomBenhRead(DmNhomBenhBase):
    ma_nhom: str = Field(max_length=10)

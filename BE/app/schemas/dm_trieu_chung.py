from app.schemas.base import SchemaBase
from pydantic import Field


class DmTrieuChungBase(SchemaBase):
    ten_trieu_chung: str = Field(max_length=255)
    mo_ta: str | None = None


class DmTrieuChungCreate(DmTrieuChungBase):
    ma_trieu_chung: str | None = Field(default=None, max_length=10)


class DmTrieuChungUpdate(SchemaBase):
    ten_trieu_chung: str | None = None
    mo_ta: str | None = None


class DmTrieuChungRead(DmTrieuChungBase):
    ma_trieu_chung: str = Field(max_length=10)

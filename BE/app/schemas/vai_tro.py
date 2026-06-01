from app.schemas.base import SchemaBase
from pydantic import Field


class VaiTroBase(SchemaBase):
    ten_vai_tro: str = Field(max_length=100)
    mo_ta: str | None = None


class VaiTroCreate(VaiTroBase):
    id: str = Field(max_length=20)


class VaiTroUpdate(SchemaBase):
    ten_vai_tro: str | None = None
    mo_ta: str | None = None


class VaiTroRead(VaiTroBase):
    id: str = Field(max_length=20)

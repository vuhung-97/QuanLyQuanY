from app.schemas.base import SchemaBase
from pydantic import Field


class VaiTroTamThoiBase(SchemaBase):
    ma_vai_tro: str = Field(max_length=30)
    ten_vai_tro: str = Field(max_length=100)


class VaiTroTamThoiCreate(VaiTroTamThoiBase):
    pass


class VaiTroTamThoiUpdate(SchemaBase):
    ten_vai_tro: str | None = None


class VaiTroTamThoiRead(VaiTroTamThoiBase):
    pass

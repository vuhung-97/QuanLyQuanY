from app.schemas.base import SchemaBase
from pydantic import Field


class VaiTroQuyenBase(SchemaBase):
    id_vai_tro: str = Field(max_length=20)
    id_quyen: str = Field(max_length=20)


class VaiTroQuyenCreate(VaiTroQuyenBase):
    pass


class VaiTroQuyenUpdate(SchemaBase):
    id_vai_tro: str | None = None
    id_quyen: str | None = None


class VaiTroQuyenRead(VaiTroQuyenBase):
    pass

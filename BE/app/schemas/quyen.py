from app.schemas.base import SchemaBase
from pydantic import Field


class QuyenBase(SchemaBase):
    ten_quyen: str = Field(max_length=100)
    mo_ta: str | None = None


class QuyenCreate(QuyenBase):
    id: str = Field(max_length=20)


class QuyenUpdate(SchemaBase):
    ten_quyen: str | None = None
    mo_ta: str | None = None


class QuyenRead(QuyenBase):
    id: str = Field(max_length=20)

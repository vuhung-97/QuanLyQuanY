from datetime import datetime

from app.schemas.base import SchemaBase
from pydantic import Field


class NhatKyThaoTacBase(SchemaBase):
    id_nguoi_dung: str | None = Field(default=None, max_length=20)
    thoi_gian: datetime | None = None
    hanh_dong: str | None = Field(default=None, max_length=50)
    ten_bang: str | None = Field(default=None, max_length=50)
    du_lieu_cu: dict | list | None = None
    du_lieu_moi: dict | list | None = None
    dia_chi_ip: str | None = Field(default=None, max_length=50)


class NhatKyThaoTacCreate(NhatKyThaoTacBase):
    id: str | None = None


class NhatKyThaoTacUpdate(SchemaBase):
    id_nguoi_dung: str | None = None
    thoi_gian: datetime | None = None
    hanh_dong: str | None = None
    ten_bang: str | None = None
    du_lieu_cu: dict | list | None = None
    du_lieu_moi: dict | list | None = None
    dia_chi_ip: str | None = None


class NhatKyThaoTacRead(NhatKyThaoTacBase):
    id: str = Field(max_length=20)

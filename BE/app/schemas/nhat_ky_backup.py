from datetime import datetime

from app.schemas.base import SchemaBase
from pydantic import Field


class NhatKyBackupBase(SchemaBase):
    thoi_gian_backup: datetime | None = None
    duong_dan: str | None = Field(default=None, max_length=100)
    id_nguoi_dung: str | None = Field(default=None, max_length=20)


class NhatKyBackupCreate(NhatKyBackupBase):
    id: str = Field(max_length=20)


class NhatKyBackupUpdate(SchemaBase):
    thoi_gian_backup: datetime | None = None
    duong_dan: str | None = None
    id_nguoi_dung: str | None = None


class NhatKyBackupRead(NhatKyBackupBase):
    id: str = Field(max_length=20)

from datetime import date

from app.schemas.base import SchemaBase
from pydantic import Field


class PhieuDuTruBase(SchemaBase):
    ngay_lap_phieu: date | None = None
    ghi_chu: str | None = None


class PhieuDuTruCreate(PhieuDuTruBase):
    ma_phieu_du_tru: str = Field(max_length=10)


class PhieuDuTruUpdate(SchemaBase):
    ngay_lap_phieu: date | None = None
    ghi_chu: str | None = None


class PhieuDuTruRead(PhieuDuTruBase):
    ma_phieu_du_tru: str = Field(max_length=10)
from datetime import date

from app.schemas.base import SchemaBase
from pydantic import Field


class PhieuDuTruBase(SchemaBase):
    ngay_lap_phieu: date | None = None
    ghi_chu: str | None = None
    trang_thai: str | None = Field(default=None, max_length=50)
    ma_don_vi: str | None = Field(default=None, max_length=10)
    nguoi_lap: str | None = Field(default=None, max_length=20)


class PhieuDuTruCreate(PhieuDuTruBase):
    ma_phieu_du_tru: str | None = None


class PhieuDuTruUpdate(SchemaBase):
    ngay_lap_phieu: date | None = None
    ghi_chu: str | None = None
    trang_thai: str | None = Field(default=None, max_length=50)
    ma_don_vi: str | None = Field(default=None, max_length=10)
    nguoi_lap: str | None = Field(default=None, max_length=20)


class PhieuDuTruRead(PhieuDuTruBase):
    ma_phieu_du_tru: str = Field(max_length=10)
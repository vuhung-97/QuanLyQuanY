from datetime import date

from app.schemas.base import SchemaBase


class PhieuDuTruBase(SchemaBase):
    ma_phieu_du_tru: str
    ngay_lap_phieu: date | None = None
    ghi_chu: str | None = None


class PhieuDuTruCreate(PhieuDuTruBase):
    pass


class PhieuDuTruUpdate(PhieuDuTruBase):
    pass


class PhieuDuTruRead(PhieuDuTruBase):
    pass

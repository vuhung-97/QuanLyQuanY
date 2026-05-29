from datetime import datetime

from app.schemas.base import SchemaBase


class LichKhamSkNamBase(SchemaBase):
    ma_lich_kham: str
    ma_don_vi: str | None = None
    thoi_gian_bat_dau: datetime | None = None
    thoi_gian_ket_thuc: datetime | None = None
    dia_diem: str | None = None
    

class LichKhamSkNamCreate(LichKhamSkNamBase):
    pass


class LichKhamSkNamUpdate(LichKhamSkNamBase):
    pass


class LichKhamSkNamRead(LichKhamSkNamBase):
    pass

from app.schemas.base import SchemaBase


class DonThuocBase(SchemaBase):
    ma_don_thuoc: str
    ma_quan_nhan: str | None = None
    gioi_tinh: str | None = None
    chan_doan: str | None = None


class DonThuocCreate(DonThuocBase):
    pass


class DonThuocUpdate(DonThuocBase):
    pass


class DonThuocRead(DonThuocBase):
    pass

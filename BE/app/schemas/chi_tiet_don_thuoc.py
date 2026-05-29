from app.schemas.base import SchemaBase


class ChiTietDonThuocBase(SchemaBase):
    ma_don_thuoc: str
    ma_thuoc_vtyt: str
    so_luong: int = 1
    huong_dieu_tri: str | None = None


class ChiTietDonThuocCreate(ChiTietDonThuocBase):
    pass


class ChiTietDonThuocUpdate(ChiTietDonThuocBase):
    pass


class ChiTietDonThuocRead(ChiTietDonThuocBase):
    pass

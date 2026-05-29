from app.schemas.base import SchemaBase


class ChiTietDuTruBase(SchemaBase):
    ma_phieu_du_tru: str
    ma_thuoc_vtyt: str
    so_luong: int = 1


class ChiTietDuTruCreate(ChiTietDuTruBase):
    pass


class ChiTietDuTruUpdate(ChiTietDuTruBase):
    pass


class ChiTietDuTruRead(ChiTietDuTruBase):
    pass

from app.schemas.base import SchemaBase


class ChiTietXuatKhoBase(SchemaBase):
    ma_phieu_xuat: str
    ma_thuoc_vtyt: str
    so_luong: int


class ChiTietXuatKhoCreate(ChiTietXuatKhoBase):
    pass


class ChiTietXuatKhoUpdate(ChiTietXuatKhoBase):
    pass


class ChiTietXuatKhoRead(ChiTietXuatKhoBase):
    pass

from app.schemas.base import SchemaBase


class ChiTietPhieuChamSocBase(SchemaBase):
    ma_phieu_cs: str
    ma_thuoc_vtyt: str
    so_luong: int = 1
    

class ChiTietPhieuChamSocCreate(ChiTietPhieuChamSocBase):
    pass


class ChiTietPhieuChamSocUpdate(ChiTietPhieuChamSocBase):
    pass


class ChiTietPhieuChamSocRead(ChiTietPhieuChamSocBase):
    pass

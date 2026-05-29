from datetime import datetime

from app.schemas.base import SchemaBase


class PhieuChamSocBase(SchemaBase):
    ma_phieu_cs: str
    ma_benh_an: str | None = None
    so_giuong: str | None = None
    buong: str | None = None
    thoi_gian: datetime | None = None
    theo_doi_dien_bien: str | None = None
    thuc_hien_y_lenh: str | None = None
    

class PhieuChamSocCreate(PhieuChamSocBase):
    pass


class PhieuChamSocUpdate(PhieuChamSocBase):
    pass


class PhieuChamSocRead(PhieuChamSocBase):
    pass

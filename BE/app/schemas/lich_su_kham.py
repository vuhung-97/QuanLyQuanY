from app.schemas.base import SchemaBase
from app.schemas.benh_an import BenhAnRead
from app.schemas.don_thuoc import DonThuocRead
from app.schemas.giay_gioi_thieu import GiayGioiThieuRead
from app.schemas.kham_benh import KhamBenhRead


class LichSuKhamRead(SchemaBase):
    kham_benh: list[KhamBenhRead] = []
    don_thuoc: list[DonThuocRead] = []
    benh_an: list[BenhAnRead] = []
    chuyen_tuyen: list[GiayGioiThieuRead] = []

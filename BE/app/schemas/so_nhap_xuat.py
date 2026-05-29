from datetime import datetime
from decimal import Decimal

from app.schemas.base import SchemaBase


class SoNhapXuatBase(SchemaBase):
    ma_giao_dich: str
    ma_thuoc_vtyt: str | None = None
    quy_cach: str | None = None
    don_gia: Decimal | None = None
    ngay_nhap_xuat: datetime | None = None
    ten_don_vi_doi_tac: str | None = None
    so_xuat_nhap_lenh: str | None = None
    so_luong_nhap: int | None = 0
    so_luong_xuat: int | None = 0
    so_luong_con_lai: int | None = 0
    ghi_chu: str | None = None


class SoNhapXuatCreate(SoNhapXuatBase):
    pass


class SoNhapXuatUpdate(SoNhapXuatBase):
    pass


class SoNhapXuatRead(SoNhapXuatBase):
    pass

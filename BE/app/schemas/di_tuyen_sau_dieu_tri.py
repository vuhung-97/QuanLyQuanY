from datetime import date

from app.schemas.base import SchemaBase


class DiTuyenSauDieuTriBase(SchemaBase):
    ma_chuyen_tuyen: str
    ma_quan_nhan: str | None = None
    ngay_di: date | None = None
    chan_doan_luc_di: str | None = None
    ngay_ve: date | None = None
    chan_doan_luc_ve: str | None = None
    ket_qua_huong_dieu_tri: str | None = None
    noi_dieu_tri: str | None = None

    
class DiTuyenSauDieuTriCreate(DiTuyenSauDieuTriBase):
    pass


class DiTuyenSauDieuTriUpdate(DiTuyenSauDieuTriBase):
    pass


class DiTuyenSauDieuTriRead(DiTuyenSauDieuTriBase):
    pass

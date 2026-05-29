from datetime import date
from app.schemas.base import SchemaBase


class PhieuKhamSucKhoeBase(SchemaBase):
    ma_phieu_kham: str
    ma_quan_nhan: str | None = None
    ngay_nhap_ngu: date | None = None
    tien_su_benh_tat: str | None = None
    kham_lam_sang: str | None = None
    kham_can_lam_sang: str | None = None
    ket_luan: str | None = None
    chi_dan_can_thiet: str | None = None


class PhieuKhamSucKhoeCreate(PhieuKhamSucKhoeBase):
    pass


class PhieuKhamSucKhoeUpdate(PhieuKhamSucKhoeBase):
    pass


class PhieuKhamSucKhoeRead(PhieuKhamSucKhoeBase):
    pass

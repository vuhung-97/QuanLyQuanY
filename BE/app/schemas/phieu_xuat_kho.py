from datetime import datetime

from app.schemas.base import SchemaBase


class PhieuXuatKhoBase(SchemaBase):
    ma_phieu_xuat: str
    ma_don_vi_nhan: str | None = None
    ngay_thang_nam: datetime | None = None
    ho_ten_nguoi_nhan: str | None = None
    ly_do_xuat: str | None = None
    ghi_chu: str | None = None
    

class PhieuXuatKhoCreate(PhieuXuatKhoBase):
    pass


class PhieuXuatKhoUpdate(PhieuXuatKhoBase):
    pass


class PhieuXuatKhoRead(PhieuXuatKhoBase):
    pass

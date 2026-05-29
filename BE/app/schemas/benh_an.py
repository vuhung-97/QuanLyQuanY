from app.schemas.base import SchemaBase


class BenhAnBase(SchemaBase):
    ma_benh_an: str
    ma_quan_nhan: str | None = None
    gioi_tinh: str | None = None
    nghe_nghiep: str | None = None
    dan_toc: str | None = None
    ngoai_kieu: str | None = None
    doi_tuong: str | None = None
    quan_ly_nguoi_benh: str | None = None
    chan_doan: str | None = None
    tinh_trang_ra_vien: str | None = None
    chi_tiet_benh_an: str | None = None
    tong_ket_benh_an: str | None = None


class BenhAnCreate(BenhAnBase):
    pass


class BenhAnUpdate(BenhAnBase):
    pass


class BenhAnRead(BenhAnBase):
    pass

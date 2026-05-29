from app.schemas.base import SchemaBase


class ThuocVtytBase(SchemaBase):
    ma_thuoc_vtyt: str
    ten_thuoc_vtyt: str
    don_vi_tinh: str | None = None
    so_luong: int | None = 0
    so_lo_han_dung: str | None = None
    nam_san_xuat: int | None = None
    cap_chat_luong: str | None = None


class ThuocVtytCreate(ThuocVtytBase):
    pass


class ThuocVtytUpdate(SchemaBase):
    ma_thuoc_vtyt: str | None = None
    ten_thuoc_vtyt: str | None = None
    don_vi_tinh: str | None = None
    so_luong: int | None = None
    so_lo_han_dung: str | None = None
    nam_san_xuat: int | None = None
    cap_chat_luong: str | None = None


class ThuocVtytRead(ThuocVtytBase):
    pass

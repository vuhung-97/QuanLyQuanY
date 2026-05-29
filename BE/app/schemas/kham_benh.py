from app.schemas.base import SchemaBase


class KhamBenhBase(SchemaBase):
    ma_kham_benh: str
    ma_quan_nhan: str | None = None
    trieu_chung_chan_doan: str | None = None
    phuong_phap_dieu_tri: str | None = None
    kham_lan: int | None = None
    ket_qua: str | None = None


class KhamBenhCreate(KhamBenhBase):
    pass


class KhamBenhUpdate(KhamBenhBase):
    pass


class KhamBenhRead(KhamBenhBase):
    pass

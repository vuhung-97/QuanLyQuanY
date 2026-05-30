from app.schemas.base import SchemaBase
from pydantic import Field


class KhamBenhBase(SchemaBase):
    ma_quan_nhan: str | None = Field(default=None, max_length=10)
    trieu_chung_chan_doan: str | None = None
    phuong_phap_dieu_tri: str | None = None
    kham_lan: int | None = None
    ket_qua: str | None = None


class KhamBenhCreate(KhamBenhBase):
    ma_kham_benh: str = Field(max_length=10)


class KhamBenhUpdate(SchemaBase):
    ma_quan_nhan: str | None = None
    trieu_chung_chan_doan: str | None = None
    phuong_phap_dieu_tri: str | None = None
    kham_lan: int | None = None
    ket_qua: str | None = None


class KhamBenhRead(KhamBenhBase):
    ma_kham_benh: str = Field(max_length=10)
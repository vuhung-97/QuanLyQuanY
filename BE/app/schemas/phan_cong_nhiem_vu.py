from app.schemas.base import SchemaBase
from pydantic import Field


class PhanCongNhiemVuBase(SchemaBase):
    id_nguoi_dung: str = Field(max_length=20)
    ma_vai_tro: str = Field(max_length=30)


class PhanCongNhiemVuCreate(PhanCongNhiemVuBase):
    pass


class PhanCongNhiemVuUpdate(SchemaBase):
    id_nguoi_dung: str | None = None
    ma_vai_tro: str | None = None


class PhanCongNhiemVuRead(PhanCongNhiemVuBase):
    id: str = Field(max_length=10)
    ma_lich_kham: str = Field(max_length=10)
    ten_nguoi_dung: str = ""
    ten_vai_tro: str = ""

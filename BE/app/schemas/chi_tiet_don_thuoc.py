from app.schemas.base import SchemaBase
from pydantic import Field, model_validator


class ChiTietDonThuocBase(SchemaBase):
    so_luong: int = Field(default=1, ge=0)
    huong_dieu_tri: str | None = None

    @model_validator(mode='after')
    def validate_thuoc_vtyt_relationship(self):
        if self.so_luong < 0:
            raise ValueError("Số lượng không được âm")
        return self

class ChiTietDonThuocCreate(ChiTietDonThuocBase):
    ma_don_thuoc: str = Field(max_length=10)
    ma_thuoc_vtyt: str = Field(max_length=10)

class ChiTietDonThuocUpdate(SchemaBase):
    so_luong: int | None = Field(default=None, ge=0)
    huong_dieu_tri: str | None = None

    @model_validator(mode='after')
    def validate_thuoc_vtyt_relationship(self):
        if self.so_luong and self.so_luong < 0:
            raise ValueError("Số lượng không được âm")
        return self

class ChiTietDonThuocRead(ChiTietDonThuocBase):
    ma_don_thuoc: str = Field(max_length=10)
    ma_thuoc_vtyt: str = Field(max_length=10)

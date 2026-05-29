from app.schemas.base import SchemaBase


class DonViBase(SchemaBase):
    ma_don_vi: str
    ten_don_vi: str
    ma_don_vi_truc_thuoc: str | None = None


class DonViCreate(DonViBase):
    pass


class DonViUpdate(SchemaBase):
    ma_don_vi: str | None = None
    ten_don_vi: str | None = None
    ma_don_vi_truc_thuoc: str | None = None


class DonViRead(DonViBase):
    pass

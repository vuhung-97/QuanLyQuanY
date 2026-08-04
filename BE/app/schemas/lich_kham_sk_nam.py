from datetime import datetime

from app.schemas.base import SchemaBase
from pydantic import BaseModel, Field, field_validator, model_validator

THOI_GIAN_FIELDS = [
    "thoi_gian_bat_dau",
    "thoi_gian_ket_thuc",
    "thoi_gian_lay_mau_bat_dau",
    "thoi_gian_lay_mau_ket_thuc",
    "thoi_gian_du_tru_lay_mau_bat_dau",
    "thoi_gian_du_tru_lay_mau_ket_thuc",
    "thoi_gian_du_tru_kham_bat_dau",
    "thoi_gian_du_tru_kham_ket_thuc",
]

TIME_RANGES = [
    ("thoi_gian_bat_dau", "thoi_gian_ket_thuc", "Thời gian khám"),
    ("thoi_gian_lay_mau_bat_dau", "thoi_gian_lay_mau_ket_thuc", "Thời gian lấy máu"),
    (
        "thoi_gian_du_tru_lay_mau_bat_dau",
        "thoi_gian_du_tru_lay_mau_ket_thuc",
        "Thời gian dự trù lấy máu",
    ),
    (
        "thoi_gian_du_tru_kham_bat_dau",
        "thoi_gian_du_tru_kham_ket_thuc",
        "Thời gian dự trù khám sức khỏe",
    ),
]


def _empty_str_to_none(v):
    if v == "":
        return None
    return v


def _validate_range_only(model):
    values = model.model_dump()
    for bat_dau_field, ket_thuc_field, label in TIME_RANGES:
        bd = values.get(bat_dau_field)
        kt = values.get(ket_thuc_field)
        if bd and kt and kt <= bd:
            raise ValueError(f"{label}: thời gian kết thúc phải sau thời gian bắt đầu")
    return model


def _validate_write_times(model):
    """Chỉ áp dụng khi tạo/sửa (Create/Replace): lấy máu phải đủ & không trùng khám,
    dự trù (nếu điền) đủ cặp, không trùng và phải sau thời gian khám."""
    values = model.model_dump()

    for bat_dau_field, ket_thuc_field, label in TIME_RANGES[1:]:
        bd = values.get(bat_dau_field)
        kt = values.get(ket_thuc_field)
        if (bd is None) != (kt is None):
            raise ValueError(f"{label}: phải điền đầy đủ thời gian bắt đầu và kết thúc")
        if bd and kt and kt <= bd:
            raise ValueError(f"{label}: thời gian kết thúc phải sau thời gian bắt đầu")

    kham_bd = values.get("thoi_gian_bat_dau")
    kham_kt = values.get("thoi_gian_ket_thuc")

    lay_mau_bd = values.get("thoi_gian_lay_mau_bat_dau")
    lay_mau_kt = values.get("thoi_gian_lay_mau_ket_thuc")
    if kham_bd and kham_kt and lay_mau_bd and lay_mau_kt:
        if lay_mau_bd < kham_kt and kham_bd < lay_mau_kt:
            raise ValueError("Thời gian lấy máu không được trùng với thời gian khám")

    for bat_dau_field, ket_thuc_field, label in TIME_RANGES[2:]:
        bd = values.get(bat_dau_field)
        kt = values.get(ket_thuc_field)
        if bd and kt and kham_bd and kham_kt and bd < kham_kt:
            raise ValueError(
                f"{label} phải sau thời gian khám và không được trùng thời gian khám"
            )

    return model


class ChiTietInput(BaseModel):
    ma_don_vi: str
    thoi_gian_bat_dau: datetime | None = None
    thoi_gian_ket_thuc: datetime | None = None
    thoi_gian_lay_mau_bat_dau: datetime | None = None
    thoi_gian_lay_mau_ket_thuc: datetime | None = None
    thoi_gian_du_tru_lay_mau_bat_dau: datetime | None = None
    thoi_gian_du_tru_lay_mau_ket_thuc: datetime | None = None
    thoi_gian_du_tru_kham_bat_dau: datetime | None = None
    thoi_gian_du_tru_kham_ket_thuc: datetime | None = None
    dia_diem: str | None = None

    _empty_str_to_none = field_validator(
        "thoi_gian_bat_dau",
        "thoi_gian_ket_thuc",
        "thoi_gian_lay_mau_bat_dau",
        "thoi_gian_lay_mau_ket_thuc",
        "thoi_gian_du_tru_lay_mau_bat_dau",
        "thoi_gian_du_tru_lay_mau_ket_thuc",
        "thoi_gian_du_tru_kham_bat_dau",
        "thoi_gian_du_tru_kham_ket_thuc",
        mode="before"
    )(_empty_str_to_none)

    @model_validator(mode='after')
    def validate_thoi_gian(self):
        ranges = [
            ("thoi_gian_bat_dau", "thoi_gian_ket_thuc", "Thời gian khám"),
            ("thoi_gian_lay_mau_bat_dau", "thoi_gian_lay_mau_ket_thuc", "Thời gian lấy máu"),
            ("thoi_gian_du_tru_lay_mau_bat_dau", "thoi_gian_du_tru_lay_mau_ket_thuc", "Thời gian dự trù lấy máu"),
            ("thoi_gian_du_tru_kham_bat_dau", "thoi_gian_du_tru_kham_ket_thuc", "Thời gian dự trù khám sức khỏe"),
        ]
        values = self.model_dump()
        for bat_dau_field, ket_thuc_field, label in ranges:
            bd = values.get(bat_dau_field)
            kt = values.get(ket_thuc_field)
            if bd and kt and kt <= bd:
                raise ValueError(f"{label}: thời gian kết thúc phải sau thời gian bắt đầu")
        return self


class AssignmentInput(BaseModel):
    id_nguoi_dung: str
    ma_vai_tro: str


class LichKhamSkNamBase(SchemaBase):
    thoi_gian_bat_dau: datetime | None = None
    thoi_gian_ket_thuc: datetime | None = None
    thoi_gian_lay_mau_bat_dau: datetime | None = None
    thoi_gian_lay_mau_ket_thuc: datetime | None = None
    thoi_gian_du_tru_lay_mau_bat_dau: datetime | None = None
    thoi_gian_du_tru_lay_mau_ket_thuc: datetime | None = None
    thoi_gian_du_tru_kham_bat_dau: datetime | None = None
    thoi_gian_du_tru_kham_ket_thuc: datetime | None = None
    trang_thai: str = "cho_gui"

    _empty_str_to_none = field_validator(
        *THOI_GIAN_FIELDS, mode="before"
    )(_empty_str_to_none)

    @model_validator(mode="after")
    def validate_thoi_gian(self):
        return _validate_range_only(self)


class LichKhamSkNamCreate(SchemaBase):
    thoi_gian_bat_dau: datetime | None = None
    thoi_gian_ket_thuc: datetime | None = None
    thoi_gian_lay_mau_bat_dau: datetime | None = None
    thoi_gian_lay_mau_ket_thuc: datetime | None = None
    thoi_gian_du_tru_lay_mau_bat_dau: datetime | None = None
    thoi_gian_du_tru_lay_mau_ket_thuc: datetime | None = None
    thoi_gian_du_tru_kham_bat_dau: datetime | None = None
    thoi_gian_du_tru_kham_ket_thuc: datetime | None = None
    details: list[ChiTietInput] = []
    assignments: list[AssignmentInput] = []

    _empty_str_to_none = field_validator(
        *THOI_GIAN_FIELDS, mode="before"
    )(_empty_str_to_none)

    @model_validator(mode="after")
    def validate_thoi_gian(self):
        _validate_range_only(self)
        return _validate_write_times(self)


class LichKhamSkNamReplace(SchemaBase):
    thoi_gian_bat_dau: datetime | None = None
    thoi_gian_ket_thuc: datetime | None = None
    thoi_gian_lay_mau_bat_dau: datetime | None = None
    thoi_gian_lay_mau_ket_thuc: datetime | None = None
    thoi_gian_du_tru_lay_mau_bat_dau: datetime | None = None
    thoi_gian_du_tru_lay_mau_ket_thuc: datetime | None = None
    thoi_gian_du_tru_kham_bat_dau: datetime | None = None
    thoi_gian_du_tru_kham_ket_thuc: datetime | None = None
    details: list[ChiTietInput] = []
    assignments: list[AssignmentInput] = []

    _empty_str_to_none = field_validator(
        *THOI_GIAN_FIELDS, mode="before"
    )(_empty_str_to_none)

    @model_validator(mode="after")
    def validate_thoi_gian(self):
        _validate_range_only(self)
        return _validate_write_times(self)


class LichKhamSkNamUpdate(SchemaBase):
    thoi_gian_bat_dau: datetime | None = None
    thoi_gian_ket_thuc: datetime | None = None

    _empty_str_to_none = field_validator(
        "thoi_gian_bat_dau", "thoi_gian_ket_thuc", mode="before"
    )(_empty_str_to_none)

    @model_validator(mode="after")
    def validate_thoi_gian(self):
        if self.thoi_gian_bat_dau and self.thoi_gian_ket_thuc:
            if self.thoi_gian_ket_thuc <= self.thoi_gian_bat_dau:
                raise ValueError("Thời gian kết thúc phải sau thời gian bắt đầu")
        return self


class LichKhamSkNamRead(LichKhamSkNamBase):
    ma_lich_kham: str = Field(max_length=10)

from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import Field
from sqlalchemy import func, Integer, cast
from sqlalchemy.orm import Session

from app.crud.phieu_kham_suc_khoe import phieu_kham_suc_khoe_crud
from app.database.lich_kham_sk_nam import LichKhamSkNam
from app.database.nguoi_dung import NguoiDung
from app.database.phan_cong_nhiem_vu import PhanCongNhiemVu
from app.database.phieu_kham_suc_khoe import PhieuKhamSucKhoe
from app.database.session import get_db
from app.core.dependencies import get_current_user, require_permissions
from app.routes.base import _run_crud, create_crud_router
from app.schemas.base import SchemaBase
from app.schemas.phieu_kham_suc_khoe import (
    PhieuKhamSucKhoeCreate,
    PhieuKhamSucKhoeRead,
    PhieuKhamSucKhoeUpdate,
)

MA_VA_TRO_XET_NGHIEM = "xet_nghiem"


class TaoMaLayMauRequest(SchemaBase):
    ma_quan_nhan: str = Field(max_length=10)
    ma_lich_kham: str = Field(max_length=10)
    nam: int | None = None


class XacNhanLayMauRequest(SchemaBase):
    ma_quan_nhan: str = Field(max_length=10)
    ma_lich_kham: str = Field(max_length=10)


pre_router = APIRouter()


def _require_xet_nghiem(current_user: NguoiDung, db: Session, ma_lich_kham: str) -> None:
    if current_user.id_vai_tro == "ROLE_ADMIN":
        return
    has_assignment = (
        db.query(PhanCongNhiemVu.id)
        .filter(
            PhanCongNhiemVu.ma_lich_kham == ma_lich_kham,
            PhanCongNhiemVu.id_nguoi_dung == current_user.id,
            PhanCongNhiemVu.ma_vai_tro == MA_VA_TRO_XET_NGHIEM,
        )
        .first()
    )
    if not has_assignment:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Chỉ người có vai trò Xét nghiệm trong đợt khám mới thao tác mã lấy máu.",
        )


_WINDOW_LABEL = {
    "lay_mau": ("thời gian lấy máu", "thoi_gian_lay_mau_bat_dau", "thoi_gian_lay_mau_ket_thuc"),
    "kham": ("thời gian khám", "thoi_gian_bat_dau", "thoi_gian_ket_thuc"),
}


def _require_window(db: Session, ma_lich_kham: str, loai: str, current_user: NguoiDung) -> None:
    if current_user.id_vai_tro == "ROLE_ADMIN":
        return
    lich = (
        db.query(LichKhamSkNam)
        .filter(LichKhamSkNam.ma_lich_kham == ma_lich_kham)
        .first()
    )
    if not lich:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy lịch khám.",
        )
    label, bd_attr, kt_attr = _WINDOW_LABEL[loai]
    bat_dau = getattr(lich, bd_attr)
    ket_thuc = getattr(lich, kt_attr)
    if bat_dau is None or ket_thuc is None:
        return
    now = datetime.now()
    if not (bat_dau <= now <= ket_thuc):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Chỉ được thao tác trong {label} {bat_dau:%H:%M ngày %d/%m/%Y} – {ket_thuc:%H:%M ngày %d/%m/%Y}.",
        )


@pre_router.post(
    "/tao-ma-lay-mau",
    dependencies=[Depends(require_permissions("phieu_kham_suc_khoe:create"))],
    status_code=status.HTTP_201_CREATED,
    response_model=PhieuKhamSucKhoeRead,
)
def tao_ma_lay_mau(
    payload: TaoMaLayMauRequest,
    current_user: NguoiDung = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    _require_xet_nghiem(current_user, db, payload.ma_lich_kham)
    _require_window(db, payload.ma_lich_kham, "lay_mau", current_user)

    max_code = db.query(func.max(cast(PhieuKhamSucKhoe.ma_lay_mau, Integer))).filter(
        PhieuKhamSucKhoe.ma_lich_kham == payload.ma_lich_kham
    ).scalar()
    next_val = (max_code or 0) + 1
    ma_lay_mau = f"{next_val:04d}"

    phieu = (
        db.query(PhieuKhamSucKhoe)
        .filter(
            PhieuKhamSucKhoe.ma_quan_nhan == payload.ma_quan_nhan,
            PhieuKhamSucKhoe.ma_lich_kham == payload.ma_lich_kham,
        )
        .first()
    )

    if phieu:
        phieu.ma_lay_mau = ma_lay_mau
    else:
        phieu = PhieuKhamSucKhoe(
            ma_quan_nhan=payload.ma_quan_nhan,
            ma_lich_kham=payload.ma_lich_kham,
            nam=payload.nam,
            trang_thai="chua_lay_mau",
            ma_lay_mau=ma_lay_mau,
        )
        db.add(phieu)

    try:
        db.commit()
        db.refresh(phieu)
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Không thể tạo mã lấy máu. Vui lòng thử lại.")

    return phieu


@pre_router.post(
    "/xac-nhan-lay-mau",
    dependencies=[Depends(require_permissions("phieu_kham_suc_khoe:create"))],
    status_code=status.HTTP_200_OK,
    response_model=PhieuKhamSucKhoeRead,
)
def xac_nhan_lay_mau(
    payload: XacNhanLayMauRequest,
    current_user: NguoiDung = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    _require_xet_nghiem(current_user, db, payload.ma_lich_kham)
    _require_window(db, payload.ma_lich_kham, "lay_mau", current_user)

    phieu = (
        db.query(PhieuKhamSucKhoe)
        .filter(
            PhieuKhamSucKhoe.ma_quan_nhan == payload.ma_quan_nhan,
            PhieuKhamSucKhoe.ma_lich_kham == payload.ma_lich_kham,
        )
        .first()
    )
    if not phieu or not phieu.ma_lay_mau:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Quân nhân chưa có mã lấy máu.",
        )
    if phieu.trang_thai in ("dang_kham", "da_kham"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Quân nhân đã khám, không thể xác nhận lấy máu.",
        )

    phieu.trang_thai = "da_lay_mau"
    try:
        db.commit()
        db.refresh(phieu)
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Không thể xác nhận lấy máu. Vui lòng thử lại.")

    return phieu


@pre_router.get(
    "/quan-nhan/{ma_quan_nhan}",
    dependencies=[Depends(require_permissions("phieu_kham_suc_khoe:read"))],
    response_model=list[PhieuKhamSucKhoeRead],
)
def get_phieu_history(ma_quan_nhan: str, db: Session = Depends(get_db)):
    return (
        db.query(PhieuKhamSucKhoe)
        .filter(PhieuKhamSucKhoe.ma_quan_nhan == ma_quan_nhan)
        .order_by(PhieuKhamSucKhoe.nam.desc().nullslast(),
                  PhieuKhamSucKhoe.ma_phieu_kham.desc())
        .all()
    )


@pre_router.get(
    "/lich-kham/{ma_lich_kham}",
    dependencies=[Depends(require_permissions("phieu_kham_suc_khoe:read"))],
    response_model=list[PhieuKhamSucKhoeRead],
)
def get_phieu_by_lich_kham(ma_lich_kham: str, db: Session = Depends(get_db)):
    return (
        db.query(PhieuKhamSucKhoe)
        .filter(PhieuKhamSucKhoe.ma_lich_kham == ma_lich_kham)
        .all()
    )


@pre_router.post(
    "",
    dependencies=[Depends(require_permissions("phieu_kham_suc_khoe:create"))],
    status_code=status.HTTP_201_CREATED,
    response_model=PhieuKhamSucKhoeRead,
)
def create_phieu_kham_suc_khoe(
    payload: PhieuKhamSucKhoeCreate,
    current_user: NguoiDung = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if payload.ma_lich_kham:
        _require_window(db, payload.ma_lich_kham, "kham", current_user)
    record = _run_crud(
        lambda: phieu_kham_suc_khoe_crud.create(
            db, payload, nguoi_dung_id=current_user.id
        )
    )
    return record


@pre_router.patch(
    "/{ma_phieu_kham}",
    dependencies=[Depends(require_permissions("phieu_kham_suc_khoe:update"))],
    response_model=PhieuKhamSucKhoeRead,
)
def update_phieu_kham_suc_khoe(
    ma_phieu_kham: str,
    payload: PhieuKhamSucKhoeUpdate,
    current_user: NguoiDung = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    existing = _run_crud(
        lambda: phieu_kham_suc_khoe_crud.get(db, ma_phieu_kham)
    )
    if existing and existing.ma_lich_kham:
        _require_window(db, existing.ma_lich_kham, "kham", current_user)
    record = _run_crud(
        lambda: phieu_kham_suc_khoe_crud.update(
            db, ma_phieu_kham, payload, nguoi_dung_id=current_user.id
        )
    )
    return record


router = create_crud_router(
    resource="phieu_kham_suc_khoe",
    crud=phieu_kham_suc_khoe_crud,
    pre_router=pre_router,
    read_permission="phieu_kham_suc_khoe:read",
    create_permission="phieu_kham_suc_khoe:create",
    update_permission="phieu_kham_suc_khoe:update",
    delete_permission="phieu_kham_suc_khoe:delete",
)

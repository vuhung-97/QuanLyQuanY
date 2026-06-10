from datetime import date, datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import inspect
from sqlalchemy.orm import Session

from app.crud.lich_kham_sk_nam import lich_kham_sk_nam_crud
from app.crud.lich_kham_sk_nam_chi_tiet import lich_kham_sk_nam_chi_tiet_crud
from app.database.lich_kham_sk_nam import LichKhamSkNam
from app.database.lich_kham_sk_nam_chi_tiet import LichKhamSkNamChiTiet
from app.database.nhat_ky_thao_tac import NhatKyThaoTac
from app.database.session import get_db
from app.routes.base import create_crud_router, _run_crud, _resolve_schema
from app.core.dependencies import get_current_user, require_permissions


_LOG_SKIP_TABLES = {"nhat_ky_thao_tac", "nhat_ky_dang_nhap", "nhat_ky_backup"}


def _row_to_dict(row) -> dict:
    skip = {"mat_khau_hash"}
    result = {}
    for c in inspect(row.__class__).columns:
        if c.key in skip:
            continue
        value = getattr(row, c.key)
        if isinstance(value, (date, datetime)):
            value = value.isoformat()
        result[c.key] = value
    return result


def _validate_detail_dates(master: LichKhamSkNam, thoi_gian_bat_dau, thoi_gian_ket_thuc) -> None:
    if not master.thoi_gian_bat_dau or not master.thoi_gian_ket_thuc:
        return
    if thoi_gian_bat_dau and thoi_gian_bat_dau < master.thoi_gian_bat_dau:
        raise HTTPException(
            status_code=400,
            detail=f"Thời gian bắt đầu ({thoi_gian_bat_dau}) không được trước thời gian bắt đầu của lịch năm ({master.thoi_gian_bat_dau})."
        )
    if thoi_gian_ket_thuc and thoi_gian_ket_thuc > master.thoi_gian_ket_thuc:
        raise HTTPException(
            status_code=400,
            detail=f"Thời gian kết thúc ({thoi_gian_ket_thuc}) không được sau thời gian kết thúc của lịch năm ({master.thoi_gian_ket_thuc})."
        )


def _log_chi_tiet(db: Session, hanh_dong: str, nguoi_dung_id: str | None,
                  du_lieu_cu: dict | None = None, du_lieu_moi: dict | None = None) -> None:
    if "lich_kham_sk_nam_chi_tiet" in _LOG_SKIP_TABLES:
        return
    log = NhatKyThaoTac(
        id_nguoi_dung=nguoi_dung_id,
        thoi_gian=datetime.now(timezone.utc),
        hanh_dong=hanh_dong,
        ten_bang="lich_kham_sk_nam_chi_tiet",
        du_lieu_cu=du_lieu_cu,
        du_lieu_moi=du_lieu_moi,
    )
    db.add(log)
    db.commit()

router = create_crud_router(
    resource="lich_kham_sk_nam",
    crud=lich_kham_sk_nam_crud,
    read_permission="lich_kham_sk_nam:read",
    create_permission="lich_kham_sk_nam:create",
    update_permission="lich_kham_sk_nam:update",
    delete_permission="lich_kham_sk_nam:delete",
)

chi_tiet_read_schema = _resolve_schema("lich_kham_sk_nam_chi_tiet", "Read")
chi_tiet_create_schema = _resolve_schema("lich_kham_sk_nam_chi_tiet", "Create")
chi_tiet_update_schema = _resolve_schema("lich_kham_sk_nam_chi_tiet", "Update")

read_deps = [Depends(require_permissions("lich_kham_sk_nam:read"))]
create_deps = [Depends(require_permissions("lich_kham_sk_nam:create"))]
update_deps = [Depends(require_permissions("lich_kham_sk_nam:update"))]
delete_deps = [Depends(require_permissions("lich_kham_sk_nam:delete"))]


@router.get("/{ma_lich_kham}/chi-tiet", dependencies=read_deps, response_model=list[chi_tiet_read_schema])
def list_chi_tiet(ma_lich_kham: str, db: Session = Depends(get_db)):
    """Lấy danh sách chi tiết lịch khám của một master plan."""
    from sqlalchemy import select
    stmt = select(LichKhamSkNamChiTiet).where(
        LichKhamSkNamChiTiet.ma_lich_kham == ma_lich_kham
    ).order_by(LichKhamSkNamChiTiet.ma_don_vi)
    return list(db.scalars(stmt).all())


@router.post("/{ma_lich_kham}/chi-tiet", dependencies=create_deps,
             status_code=status.HTTP_201_CREATED, response_model=chi_tiet_read_schema)
def create_chi_tiet(
    ma_lich_kham: str,
    payload: chi_tiet_create_schema,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    """Thêm chi tiết (đơn vị + thời gian + địa điểm) vào master plan."""
    master = db.get(LichKhamSkNam, ma_lich_kham)
    if not master:
        raise HTTPException(status_code=404, detail="Không tìm thấy lịch khám năm.")
    _validate_detail_dates(master, payload.thoi_gian_bat_dau, payload.thoi_gian_ket_thuc)
    data = payload.model_dump()
    data["ma_lich_kham"] = ma_lich_kham
    row = LichKhamSkNamChiTiet(**data)
    db.add(row)
    try:
        db.commit()
        db.refresh(row)
    except Exception:
        db.rollback()
        raise HTTPException(status_code=409, detail="Chi tiết lịch khám đã tồn tại hoặc dữ liệu không hợp lệ.")
    _log_chi_tiet(db, "CREATE", current_user.id, du_lieu_moi=_row_to_dict(row))
    return row


@router.patch("/{ma_lich_kham}/chi-tiet/{ma_don_vi}", dependencies=update_deps,
              response_model=chi_tiet_read_schema)
def update_chi_tiet(
    ma_lich_kham: str,
    ma_don_vi: str,
    payload: chi_tiet_update_schema,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    """Cập nhật chi tiết lịch khám."""
    row = db.get(LichKhamSkNamChiTiet, (ma_lich_kham, ma_don_vi))
    if not row:
        raise HTTPException(status_code=404, detail="Không tìm thấy chi tiết lịch khám.")
    master = db.get(LichKhamSkNam, ma_lich_kham)
    if master:
        payload_data = payload.model_dump(exclude_unset=True)
        _validate_detail_dates(
            master,
            payload_data.get("thoi_gian_bat_dau", row.thoi_gian_bat_dau),
            payload_data.get("thoi_gian_ket_thuc", row.thoi_gian_ket_thuc),
        )
    old = _row_to_dict(row)
    for field, value in payload.model_dump(exclude_unset=True).items():
        if value is not None:
            setattr(row, field, value)
    db.commit()
    db.refresh(row)
    _log_chi_tiet(db, "UPDATE", current_user.id, du_lieu_cu=old, du_lieu_moi=_row_to_dict(row))
    return row


@router.delete("/{ma_lich_kham}/chi-tiet/{ma_don_vi}", dependencies=delete_deps,
               status_code=status.HTTP_204_NO_CONTENT)
def delete_chi_tiet(
    ma_lich_kham: str,
    ma_don_vi: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    """Xóa chi tiết lịch khám."""
    row = db.get(LichKhamSkNamChiTiet, (ma_lich_kham, ma_don_vi))
    if not row:
        raise HTTPException(status_code=404, detail="Không tìm thấy chi tiết lịch khám.")
    old = _row_to_dict(row)
    db.delete(row)
    db.commit()
    _log_chi_tiet(db, "DELETE", current_user.id, du_lieu_cu=old)

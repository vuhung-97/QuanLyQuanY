from datetime import date, datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import inspect, select
from sqlalchemy.orm import Session

from app.database.lich_kham_sk_nam import LichKhamSkNam
from app.database.lich_kham_sk_nam_chi_tiet import LichKhamSkNamChiTiet
from app.database.nhat_ky_thao_tac import NhatKyThaoTac
from app.database.session import get_db
from app.routes.base import _resolve_schema
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


router = APIRouter(
    prefix="/lich_kham_sk_nam/{ma_lich_kham}/chi-tiet",
    tags=["lich_kham_sk_nam_chi_tiet"],
)

chi_tiet_read_schema = _resolve_schema("lich_kham_sk_nam_chi_tiet", "Read")

read_deps = [Depends(require_permissions("lich_kham_sk_nam:read"))]
delete_deps = [Depends(require_permissions("lich_kham_sk_nam:delete"))]


@router.get("", dependencies=read_deps, response_model=list[chi_tiet_read_schema])
def list_chi_tiet(ma_lich_kham: str, db: Session = Depends(get_db)):
    stmt = select(LichKhamSkNamChiTiet).where(
        LichKhamSkNamChiTiet.ma_lich_kham == ma_lich_kham
    ).order_by(LichKhamSkNamChiTiet.ma_don_vi)
    return list(db.scalars(stmt).all())


@router.delete("/{ma_don_vi}", dependencies=delete_deps,
               status_code=status.HTTP_204_NO_CONTENT)
def delete_chi_tiet(
    ma_lich_kham: str,
    ma_don_vi: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    row = db.get(LichKhamSkNamChiTiet, (ma_lich_kham, ma_don_vi))
    if not row:
        raise HTTPException(status_code=404, detail="Không tìm thấy chi tiết lịch khám.")
    master = db.get(LichKhamSkNam, ma_lich_kham)
    if master and master.trang_thai == "da_duyet":
        raise HTTPException(status_code=400, detail="Lịch khám đã duyệt, không thể xóa chi tiết.")
    old = _row_to_dict(row)
    db.delete(row)
    db.commit()
    _log_chi_tiet(db, "DELETE", current_user.id, du_lieu_cu=old)

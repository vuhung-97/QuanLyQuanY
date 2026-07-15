from typing import Any

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.dependencies import require_permissions
from app.crud.nhat_ky_dang_nhap import nhat_ky_dang_nhap_crud
from app.database.session import get_db
from app.routes.base import _run_crud, _serialize_items
from app.schemas.nhat_ky_dang_nhap import NhatKyDangNhapRead
from app.services.nguoi_dung_service import attach_ho_ten


router = APIRouter(prefix="/nhat_ky_dang_nhap", tags=["nhat_ky_dang_nhap"])


@router.get(
    "",
    response_model=None,
    dependencies=[Depends(require_permissions("nhat_ky_dang_nhap:read"))],
)
def list_items(
    db: Session = Depends(get_db),
    limit: int = Query(default=100, ge=1, le=500),
    offset: int = Query(default=0, ge=0),
    sort_by: str | None = Query(default=None),
    sort_desc: bool = Query(default=False),
    include_total: bool = Query(default=False),
) -> Any:
    records = _run_crud(
        lambda: nhat_ky_dang_nhap_crud.get_multi(
            db, limit=limit, offset=offset, sort_by=sort_by, sort_desc=sort_desc
        )
    )
    attach_ho_ten(db, records)
    items = _serialize_items(records, NhatKyDangNhapRead)
    if include_total:
        total = _run_crud(lambda: nhat_ky_dang_nhap_crud.count(db))
        return {"items": items, "total": total, "limit": limit, "offset": offset}
    return items


@router.get(
    "/{item_id}",
    response_model=NhatKyDangNhapRead,
    dependencies=[Depends(require_permissions("nhat_ky_dang_nhap:read"))],
)
def get_item(item_id: str, db: Session = Depends(get_db)) -> Any:
    record = _run_crud(lambda: nhat_ky_dang_nhap_crud.get(db, item_id))
    attach_ho_ten(db, [record])
    return record

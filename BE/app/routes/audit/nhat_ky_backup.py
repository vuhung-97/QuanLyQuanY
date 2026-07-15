from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, require_permissions
from app.crud.nhat_ky_backup import nhat_ky_backup_crud
from app.database.nhat_ky_backup import NhatKyBackup
from app.database.session import get_db
from app.routes.base import _run_crud, _serialize_items
from app.schemas.nhat_ky_backup import NhatKyBackupCreate, NhatKyBackupRead
from app.services.nguoi_dung_service import attach_ho_ten


router = APIRouter(prefix="/nhat_ky_backup", tags=["nhat_ky_backup"])


@router.get(
    "",
    response_model=None,
    dependencies=[Depends(require_permissions("nhat_ky_backup:read"))],
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
        lambda: nhat_ky_backup_crud.get_multi(
            db, limit=limit, offset=offset, sort_by=sort_by, sort_desc=sort_desc
        )
    )
    attach_ho_ten(db, records)
    items = _serialize_items(records, NhatKyBackupRead)
    if include_total:
        total = _run_crud(lambda: nhat_ky_backup_crud.count(db))
        return {"items": items, "total": total, "limit": limit, "offset": offset}
    return items


@router.post(
    "",
    dependencies=[Depends(require_permissions("nhat_ky_backup:create"))],
    status_code=status.HTTP_201_CREATED,
    response_model=NhatKyBackupRead,
)
def create_item(
    payload: NhatKyBackupCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
) -> Any:
    row = NhatKyBackup(
        id=payload.id,
        thoi_gian=payload.thoi_gian or datetime.now(timezone.utc),
        duong_dan=payload.duong_dan,
        id_nguoi_dung=current_user.id,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    attach_ho_ten(db, [row])
    return row

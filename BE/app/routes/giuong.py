from fastapi import APIRouter, Depends, Query
from sqlalchemy import inspect
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, require_permissions
from app.crud.giuong import giuong_crud
from app.database.giuong import Giuong
from app.database.session import get_db
from app.routes.base import _run_crud
from app.schemas.giuong import GiuongUpdate


router = APIRouter(prefix="/giuong", tags=["giuong"])


@router.get(
    "/trong",
    dependencies=[Depends(require_permissions("giuong:read"))],
)
def get_giuong_trong(ma_buong: str = Query(...), db: Session = Depends(get_db)):
    records = (
        db.query(Giuong)
        .filter(Giuong.ma_buong == ma_buong, Giuong.trang_thai == "trống")
        .all()
    )
    result = [{c.key: getattr(g, c.key) for c in inspect(Giuong).columns} for g in records]
    return {"data": result, "total": len(result)}


@router.get(
    "",
    dependencies=[Depends(require_permissions("giuong:read"))],
)
def list_giuong(
    db: Session = Depends(get_db),
    limit: int = Query(default=100, ge=1, le=500),
    offset: int = Query(default=0, ge=0),
    sort_by: str | None = Query(default=None),
    sort_desc: bool = Query(default=False),
    ma_buong: str | None = Query(default=None),
):
    query = db.query(Giuong)
    if ma_buong:
        query = query.filter(Giuong.ma_buong == ma_buong)
    if sort_by:
        col = getattr(Giuong, sort_by, None)
        if col:
            query = query.order_by(col.desc() if sort_desc else col.asc())
    else:
        query = query.order_by(Giuong.ten_giuong)
    total = query.count()
    records = query.offset(offset).limit(limit).all()
    data = [{c.key: getattr(g, c.key) for c in inspect(Giuong).columns} for g in records]
    return {"data": data, "total": total}


@router.get(
    "/{item_id}",
    dependencies=[Depends(require_permissions("giuong:read"))],
)
def get_giuong(item_id: str, db: Session = Depends(get_db)):
    item = _run_crud(lambda: giuong_crud.get(db, item_id))
    return {c.key: getattr(item, c.key) for c in inspect(Giuong).columns}


@router.patch(
    "/{item_id}",
    dependencies=[Depends(require_permissions("giuong:update"))],
)
def update_giuong(
    item_id: str,
    payload: GiuongUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return _run_crud(lambda: giuong_crud.update(db, item_id, payload, nguoi_dung_id=current_user.id))

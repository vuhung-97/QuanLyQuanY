from datetime import date, timedelta

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import distinct, or_
from sqlalchemy.orm import Session

from app.core.dependencies import require_permissions
from app.crud.base import CRUDError
from app.crud.thuoc_vtyt import thuoc_vtyt_crud
from app.database.session import get_db
from app.database.thuoc_vtyt import ThuocVtyt
from app.routes.base import create_crud_router, _run_crud
from app.schemas.thuoc_vtyt import ThuocVtytRead
from app.services.inventory_service import InventoryService


pre_router = APIRouter()


@pre_router.get(
    "/count",
    dependencies=[Depends(require_permissions("thuoc_vtyt:read"))],
)
def count_thuoc(db: Session = Depends(get_db)):
    return thuoc_vtyt_crud.count(db)


@pre_router.get(
    "/phan-loai-list",
    dependencies=[Depends(require_permissions("thuoc_vtyt:read"))],
)
def get_phan_loai_list(db: Session = Depends(get_db)):
    results = (
        db.query(distinct(ThuocVtyt.phan_loai))
        .order_by(ThuocVtyt.phan_loai)
        .all()
    )
    return [r[0] for r in results if r[0] is not None]


@pre_router.get(
    "/search/value",
    dependencies=[Depends(require_permissions("thuoc_vtyt:read"))],
    response_model=list[ThuocVtytRead],
)
def search_thuoc(search: str, limit: int = 20, db: Session = Depends(get_db)):
    return (
        db.query(ThuocVtyt)
        .filter(
            or_(
                ThuocVtyt.ten_thuoc_vtyt.ilike(f"%{search}%"),
                ThuocVtyt.phan_loai.ilike(f"%{search}%"),
            )
        )
        .limit(limit)
        .all()
    )


@pre_router.get(
    "/ton-kho",
    dependencies=[Depends(require_permissions("thuoc_vtyt:read"))],
    response_model=list[ThuocVtytRead],
)
def get_ton_kho(
    search: str = Query(default=None),
    db: Session = Depends(get_db),
):
    query = db.query(ThuocVtyt)
    if search:
        query = query.filter(
            or_(
                ThuocVtyt.ten_thuoc_vtyt.ilike(f"%{search}%"),
                ThuocVtyt.phan_loai.ilike(f"%{search}%"),
            )
        )
    return query.order_by(ThuocVtyt.ten_thuoc_vtyt).all()


@pre_router.get(
    "/sap-het-han",
    dependencies=[Depends(require_permissions("thuoc_vtyt:read"))],
    response_model=list[ThuocVtytRead],
)
def get_thuoc_sap_het_han(
    days: int = Query(default=90, ge=1, le=365),
    db: Session = Depends(get_db),
):
    return InventoryService.check_expiry(db, days)


@pre_router.patch(
    "/{item_id}/dieu-chinh-ton",
    dependencies=[Depends(require_permissions("thuoc_vtyt:update"))],
    response_model=ThuocVtytRead,
)
def dieu_chinh_ton(
    item_id: str,
    so_luong_moi: int = Query(..., ge=0),
    db: Session = Depends(get_db),
):
    try:
        return InventoryService.adjust_stock(db, item_id, so_luong_moi)
    except CRUDError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@pre_router.get(
    "/{item_id}",
    dependencies=[Depends(require_permissions("thuoc_vtyt:read"))],
    response_model=ThuocVtytRead,
)
def get_thuoc(item_id: str, db: Session = Depends(get_db)):
    return _run_crud(lambda: thuoc_vtyt_crud.get(db, item_id))


router = create_crud_router(
    resource="thuoc_vtyt",
    crud=thuoc_vtyt_crud,
    pre_router=pre_router,
    read_permission="thuoc_vtyt:read",
    create_permission="thuoc_vtyt:create",
    update_permission="thuoc_vtyt:update",
    delete_permission="thuoc_vtyt:delete",
    enable_read=False,
)

from fastapi import APIRouter, Depends
from sqlalchemy import inspect
from sqlalchemy.orm import Session

from app.core.dependencies import require_permissions
from app.crud.buong import buong_crud
from app.database.buong import Buong
from app.database.giuong import Giuong
from app.database.session import get_db
from app.routes.base import create_crud_router


router = create_crud_router(
    resource="buong",
    crud=buong_crud,
    read_permission="buong:read",
    create_permission="buong:create",
    update_permission="buong:update",
    delete_permission="buong:delete",
)


@router.get(
    "/list/co-giuong-trong",
    dependencies=[Depends(require_permissions("buong:read"))],
)
def get_buong_co_giuong_trong(db: Session = Depends(get_db)):
    subquery = (
        db.query(Giuong.ma_buong)
        .filter(Giuong.trang_thai == "trống")
        .distinct()
        .subquery()
    )
    records = db.query(Buong).filter(Buong.ma_buong.in_(subquery)).all()
    return [
        {c.key: getattr(b, c.key) for c in inspect(Buong).columns}
        for b in records
    ]

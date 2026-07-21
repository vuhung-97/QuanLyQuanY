from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.crud.dm_benh import dm_benh_crud
from app.database.dm_benh import DmBenh
from app.database.session import get_db
from app.routes.base import create_crud_router


pre_router = APIRouter()


@pre_router.get("/search")
def search_disease(
    q: str = Query(..., min_length=1, description="Tên bệnh cần tìm"),
    db: Session = Depends(get_db),
):
    disease = (
        db.query(DmBenh)
        .filter(DmBenh.ten_benh == q.strip())
        .first()
    )
    if not disease:
        return None
    return {
        "ma_benh": disease.ma_benh,
        "ten_benh": disease.ten_benh,
        "ma_nhom_benh": disease.ma_nhom_benh,
        "mo_ta": disease.mo_ta,
    }


router = create_crud_router(
    resource="dm_benh",
    crud=dm_benh_crud,
    pre_router=pre_router,
    read_permission="dm_benh:read",
    create_permission="dm_benh:create",
    update_permission="dm_benh:update",
    delete_permission="dm_benh:delete",
)

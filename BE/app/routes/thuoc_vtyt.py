from fastapi import Depends
from sqlalchemy.orm import Session

from app.core.dependencies import require_permissions
from app.crud.thuoc_vtyt import thuoc_vtyt_crud
from app.database.session import get_db
from app.database.thuoc_vtyt import ThuocVtyt
from app.routes.base import create_crud_router
from app.schemas.thuoc_vtyt import ThuocVtytRead


router = create_crud_router(
    resource="thuoc_vtyt",
    crud=thuoc_vtyt_crud,
    read_permission="thuoc_vtyt:read",
    create_permission="thuoc_vtyt:create",
    update_permission="thuoc_vtyt:update",
    delete_permission="thuoc_vtyt:delete",
)


@router.get(
    "/search",
    dependencies=[Depends(require_permissions("thuoc_vtyt:read"))],
    response_model=list[ThuocVtytRead],
)
def search_thuoc(search: str, limit: int = 20, db: Session = Depends(get_db)):
    return (
        db.query(ThuocVtyt)
        .filter(ThuocVtyt.ten_thuoc_vtyt.ilike(f"%{search}%"))
        .limit(limit)
        .all()
    )

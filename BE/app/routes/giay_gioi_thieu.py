from fastapi import Depends
from sqlalchemy.orm import Session

from app.core.dependencies import require_permissions
from app.crud.giay_gioi_thieu import giay_gioi_thieu_crud
from app.database.giay_gioi_thieu import GiayGioiThieu
from app.database.session import get_db
from app.routes.base import create_crud_router
from app.schemas.giay_gioi_thieu import GiayGioiThieuRead


router = create_crud_router(
    resource="giay_gioi_thieu",
    crud=giay_gioi_thieu_crud,
    read_permission="giay_gioi_thieu:read",
    create_permission="giay_gioi_thieu:create",
    update_permission="giay_gioi_thieu:update",
    delete_permission="giay_gioi_thieu:delete",
)


@router.get(
    "/by-kham-benh/{ma_kham_benh}",
    dependencies=[Depends(require_permissions("giay_gioi_thieu:read"))],
    response_model=list[GiayGioiThieuRead],
)
def get_ggt_by_kham_benh(ma_kham_benh: str, db: Session = Depends(get_db)):
    return (
        db.query(GiayGioiThieu)
        .filter(GiayGioiThieu.ma_kham_benh == ma_kham_benh)
        .all()
    )

from app.crud.giay_gioi_thieu import giay_gioi_thieu_crud
from app.routes.base import create_crud_router


router = create_crud_router(
    resource="giay_gioi_thieu",
    crud=giay_gioi_thieu_crud,
    read_permission="giay_gioi_thieu:read",
    create_permission="giay_gioi_thieu:create",
    update_permission="giay_gioi_thieu:update",
    delete_permission="giay_gioi_thieu:delete",
)

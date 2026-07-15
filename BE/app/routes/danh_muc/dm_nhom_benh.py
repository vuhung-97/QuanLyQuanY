from app.crud.dm_nhom_benh import dm_nhom_benh_crud
from app.routes.base import create_crud_router


router = create_crud_router(
    resource="dm_nhom_benh",
    crud=dm_nhom_benh_crud,
    read_permission="dm_nhom_benh:read",
    create_permission="dm_nhom_benh:create",
    update_permission="dm_nhom_benh:update",
    delete_permission="dm_nhom_benh:delete",
)

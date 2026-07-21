from app.crud.dm_benh import dm_benh_crud
from app.routes.base import create_crud_router


router = create_crud_router(
    resource="dm_benh",
    crud=dm_benh_crud,
    read_permission="dm_benh:read",
    create_permission="dm_benh:create",
    update_permission="dm_benh:update",
    delete_permission="dm_benh:delete",
)

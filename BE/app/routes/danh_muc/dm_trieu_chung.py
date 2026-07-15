from app.crud.dm_trieu_chung import dm_trieu_chung_crud
from app.routes.base import create_crud_router


router = create_crud_router(
    resource="dm_trieu_chung",
    crud=dm_trieu_chung_crud,
    read_permission="dm_trieu_chung:read",
    create_permission="dm_trieu_chung:create",
    update_permission="dm_trieu_chung:update",
    delete_permission="dm_trieu_chung:delete",
)

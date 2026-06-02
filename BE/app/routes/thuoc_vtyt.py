from app.crud.thuoc_vtyt import thuoc_vtyt_crud
from app.routes.base import create_crud_router


router = create_crud_router(
    resource="thuoc_vtyt",
    crud=thuoc_vtyt_crud,
    read_permission="thuoc_vtyt:read",
    create_permission="thuoc_vtyt:create",
    update_permission="thuoc_vtyt:update",
    delete_permission="thuoc_vtyt:delete",
)

from app.crud.buong import buong_crud
from app.routes.base import create_crud_router


router = create_crud_router(
    resource="buong",
    crud=buong_crud,
    read_permission="buong:read",
    create_permission="buong:create",
    update_permission="buong:update",
    delete_permission="buong:delete",
)

from app.crud.benh_an import benh_an_crud
from app.routes.base import create_crud_router


router = create_crud_router(
    resource="benh_an",
    crud=benh_an_crud,
    read_permission="benh_an:read",
    create_permission="benh_an:create",
    update_permission="benh_an:update",
    delete_permission="benh_an:delete",
)

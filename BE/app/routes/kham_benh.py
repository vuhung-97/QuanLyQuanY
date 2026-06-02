from app.crud.kham_benh import kham_benh_crud
from app.routes.base import create_crud_router


router = create_crud_router(
    resource="kham_benh",
    crud=kham_benh_crud,
    read_permission="kham_benh:read",
    create_permission="kham_benh:create",
    update_permission="kham_benh:update",
    delete_permission="kham_benh:delete",
)

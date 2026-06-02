from app.crud.ra_benh_xa import ra_benh_xa_crud
from app.routes.base import create_crud_router


router = create_crud_router(
    resource="ra_benh_xa",
    crud=ra_benh_xa_crud,
    read_permission="ra_benh_xa:read",
    create_permission="ra_benh_xa:create",
    update_permission="ra_benh_xa:update",
    delete_permission="ra_benh_xa:delete",
)

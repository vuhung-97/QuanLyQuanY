from app.crud.don_vi import don_vi_crud
from app.routes.base import create_crud_router


router = create_crud_router(
    resource="don_vi",
    crud=don_vi_crud,
    read_permission="don_vi:read",
    create_permission="don_vi:create",
    update_permission="don_vi:update",
    delete_permission="don_vi:delete",
)

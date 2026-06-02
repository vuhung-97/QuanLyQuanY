from app.crud.phieu_du_tru import phieu_du_tru_crud
from app.routes.base import create_crud_router


router = create_crud_router(
    resource="phieu_du_tru",
    crud=phieu_du_tru_crud,
    read_permission="phieu_du_tru:read",
    create_permission="phieu_du_tru:create",
    update_permission="phieu_du_tru:update",
    delete_permission="phieu_du_tru:delete",
)

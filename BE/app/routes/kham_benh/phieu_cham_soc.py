from app.crud.phieu_cham_soc import phieu_cham_soc_crud
from app.routes.base import create_crud_router


router = create_crud_router(
    resource="phieu_cham_soc",
    crud=phieu_cham_soc_crud,
    read_permission="phieu_cham_soc:read",
    create_permission="phieu_cham_soc:create",
    update_permission="phieu_cham_soc:update",
    delete_permission="phieu_cham_soc:delete",
)

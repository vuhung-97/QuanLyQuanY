from app.crud.phieu_kham_suc_khoe import phieu_kham_suc_khoe_crud
from app.routes.base import create_crud_router


router = create_crud_router(
    resource="phieu_kham_suc_khoe",
    crud=phieu_kham_suc_khoe_crud,
    read_permission="phieu_kham_suc_khoe:read",
    create_permission="phieu_kham_suc_khoe:create",
    update_permission="phieu_kham_suc_khoe:update",
    delete_permission="phieu_kham_suc_khoe:delete",
)

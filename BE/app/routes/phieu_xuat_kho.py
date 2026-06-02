from app.crud.phieu_xuat_kho import phieu_xuat_kho_crud
from app.routes.base import create_crud_router


router = create_crud_router(
    resource="phieu_xuat_kho",
    crud=phieu_xuat_kho_crud,
    read_permission="phieu_xuat_kho:read",
    create_permission="phieu_xuat_kho:create",
    update_permission="phieu_xuat_kho:update",
    delete_permission="phieu_xuat_kho:delete",
)

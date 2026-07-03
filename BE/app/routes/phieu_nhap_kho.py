from app.crud.phieu_nhap_kho import phieu_nhap_kho_crud
from app.routes.base import create_crud_router


router = create_crud_router(
    resource="phieu_nhap_kho",
    crud=phieu_nhap_kho_crud,
    read_permission="phieu_nhap_kho:read",
    create_permission="phieu_nhap_kho:create",
    update_permission="phieu_nhap_kho:update",
    delete_permission="phieu_nhap_kho:delete",
)

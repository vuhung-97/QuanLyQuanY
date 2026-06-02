from app.crud.so_nhap_xuat import so_nhap_xuat_crud
from app.routes.base import create_crud_router


router = create_crud_router(
    resource="so_nhap_xuat",
    crud=so_nhap_xuat_crud,
    read_permission="so_nhap_xuat:read",
    create_permission="so_nhap_xuat:create",
    update_permission="so_nhap_xuat:update",
    delete_permission="so_nhap_xuat:delete",
)

from app.crud.chi_tiet_xuat_kho import chi_tiet_xuat_kho_crud
from app.routes.base import create_crud_router


router = create_crud_router(
    resource="chi_tiet_xuat_kho",
    crud=chi_tiet_xuat_kho_crud,
    read_permission="chi_tiet_xuat_kho:read",
    create_permission="chi_tiet_xuat_kho:create",
    update_permission="chi_tiet_xuat_kho:update",
    delete_permission="chi_tiet_xuat_kho:delete",
)

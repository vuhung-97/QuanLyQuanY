from app.crud.chi_tiet_don_thuoc import chi_tiet_don_thuoc_crud
from app.routes.base import create_crud_router


router = create_crud_router(
    resource="chi_tiet_don_thuoc",
    crud=chi_tiet_don_thuoc_crud,
    read_permission="chi_tiet_don_thuoc:read",
    create_permission="chi_tiet_don_thuoc:create",
    update_permission="chi_tiet_don_thuoc:update",
    delete_permission="chi_tiet_don_thuoc:delete",
)

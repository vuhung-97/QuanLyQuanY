from app.crud.chi_tiet_du_tru import chi_tiet_du_tru_crud
from app.routes.base import create_crud_router


router = create_crud_router(
    resource="chi_tiet_du_tru",
    crud=chi_tiet_du_tru_crud,
    read_permission="chi_tiet_du_tru:read",
    create_permission="chi_tiet_du_tru:create",
    update_permission="chi_tiet_du_tru:update",
    delete_permission="chi_tiet_du_tru:delete",
)

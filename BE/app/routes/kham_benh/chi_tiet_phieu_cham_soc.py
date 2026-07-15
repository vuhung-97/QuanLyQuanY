from app.crud.chi_tiet_phieu_cham_soc import chi_tiet_phieu_cham_soc_crud
from app.routes.base import create_crud_router


router = create_crud_router(
    resource="chi_tiet_phieu_cham_soc",
    crud=chi_tiet_phieu_cham_soc_crud,
    read_permission="chi_tiet_phieu_cham_soc:read",
    create_permission="chi_tiet_phieu_cham_soc:create",
    update_permission="chi_tiet_phieu_cham_soc:update",
    delete_permission="chi_tiet_phieu_cham_soc:delete",
)

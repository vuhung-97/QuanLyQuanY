from app.crud.benh_nhan_ra_vao import benh_nhan_ra_vao_crud
from app.routes.base import create_crud_router


router = create_crud_router(
    resource="benh_nhan_ra_vao",
    crud=benh_nhan_ra_vao_crud,
    read_permission="benh_nhan_ra_vao:read",
    create_permission="benh_nhan_ra_vao:create",
    update_permission="benh_nhan_ra_vao:update",
    delete_permission="benh_nhan_ra_vao:delete",
)

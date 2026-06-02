from app.crud.quan_nhan import quan_nhan_crud
from app.routes.base import create_crud_router


router = create_crud_router(
    resource="quan_nhan",
    crud=quan_nhan_crud,
    read_permission="quan_nhan:read",
    create_permission="quan_nhan:create",
    update_permission="quan_nhan:update",
    delete_permission="quan_nhan:delete",
)

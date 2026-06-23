from app.crud.vai_tro_tam_thoi import vai_tro_tam_thoi_crud
from app.routes.base import create_crud_router


router = create_crud_router(
    resource="vai_tro_tam_thoi",
    crud=vai_tro_tam_thoi_crud,
    read_permission="vai_tro_tam_thoi:read",
    create_permission="vai_tro_tam_thoi:create",
    update_permission="vai_tro_tam_thoi:update",
    delete_permission="vai_tro_tam_thoi:delete",
)

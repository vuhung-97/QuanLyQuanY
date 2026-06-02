from app.crud.quyen import quyen_crud
from app.routes.base import create_crud_router


router = create_crud_router(
    resource="quyen",
    crud=quyen_crud,
    read_permission="quyen:read",
    create_permission="quyen:create",
    update_permission="quyen:update",
    delete_permission="quyen:delete",
)

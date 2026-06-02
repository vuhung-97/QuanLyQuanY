from app.crud.nhat_ky_backup import nhat_ky_backup_crud
from app.routes.base import create_crud_router


router = create_crud_router(
    resource="nhat_ky_backup",
    crud=nhat_ky_backup_crud,
    read_permission="nhat_ky_backup:read",
    enable_create=False,
    enable_update=False,
    enable_delete=False,
)

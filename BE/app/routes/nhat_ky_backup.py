from app.crud.nhat_ky_backup import nhat_ky_backup_crud
from app.routes.base import create_crud_router


router = create_crud_router(resource="nhat_ky_backup", crud=nhat_ky_backup_crud)

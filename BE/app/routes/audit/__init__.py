from app.routes.audit.nhat_ky_backup import router as nhat_ky_backup_router
from app.routes.audit.nhat_ky_dang_nhap import router as nhat_ky_dang_nhap_router
from app.routes.audit.nhat_ky_thao_tac import router as nhat_ky_thao_tac_router

routers = [
    nhat_ky_backup_router,
    nhat_ky_dang_nhap_router,
    nhat_ky_thao_tac_router,
]

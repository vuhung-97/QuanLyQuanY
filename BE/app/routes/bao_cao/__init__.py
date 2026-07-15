from app.routes.bao_cao.bao_cao import router as bao_cao_router
from app.routes.bao_cao.backup import router as backup_router
from app.routes.bao_cao.thong_ke import router as thong_ke_router

routers = [
    bao_cao_router,
    backup_router,
    thong_ke_router,
]

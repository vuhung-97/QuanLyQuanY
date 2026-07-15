import app.routes.auth as auth
from app.routes.system import router as system_router
from app.routes.kham_benh import routers as kham_benh_routers
from app.routes.kho import routers as kho_routers
from app.routes.he_thong import routers as he_thong_routers
from app.routes.danh_muc import routers as danh_muc_routers
from app.routes.audit import routers as audit_routers
from app.routes.bao_cao import routers as bao_cao_routers

RESOURCE_ROUTERS = [
    *kham_benh_routers,
    *kho_routers,
    *he_thong_routers,
    *danh_muc_routers,
    *audit_routers,
    *bao_cao_routers,
]

__all__ = ["RESOURCE_ROUTERS", "system_router", "auth"]

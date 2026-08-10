from __future__ import annotations

from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from .core.config import setup_cors, settings
from .core.error_handlers import register_error_handlers
from .database.session import create_db
from .routes import RESOURCE_ROUTERS, system_router, auth

# Tạo bảng nếu chưa tồn tại
create_db()

api = FastAPI(
    title="API Quản lý quân y đơn vị",
    description="Một API đơn giản để quản lý thông tin quân y đơn vị với PostgreSQL.",
    version="1.0.0",
)

# Đăng ký global error handlers
register_error_handlers(api)

# Đăng ký cấu hình CORS
setup_cors(api)

# Phục vụ file tĩnh (ảnh/PDF chẩn đoán hình ảnh)
Path(settings.UPLOAD_DIR).mkdir(parents=True, exist_ok=True)
api.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Đăng ký router don_vi
for router in RESOURCE_ROUTERS:
    api.include_router(router)
api.include_router(system_router)
api.include_router(auth.router, prefix="/auth", tags=["auth"])


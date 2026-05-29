import os

from dotenv import load_dotenv
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


def load_env():
    env_path = Path(__file__).resolve().parent.parent.parent / ".env"
    if env_path.exists():
        load_dotenv(env_path)


def setup_cors(app: FastAPI):
    """
    Đăng ký cấu hình CORS cho FastAPI app.
    """
    #origins = os.getenv("FRONTEND_URLS", "").split(",")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  
        # [origin.strip() for origin in origins if origin.strip()]
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.security import RESOURCES
from app.database.session import get_db


router = APIRouter(tags=["system"])


@router.get("/health")
def health_check(db: Session = Depends(get_db)) -> dict[str, str]:
    try:
        db.execute(text("SELECT 1"))
    except SQLAlchemyError as exc:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Hệ thống đang bảo trì, vui lòng thử lại sau") from exc
    return {"status": "ok"}


@router.get("/resources")
def list_resources() -> dict[str, list[str]]:
    return {"resources": sorted(RESOURCES)}

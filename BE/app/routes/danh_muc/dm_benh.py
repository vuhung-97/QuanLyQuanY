import unicodedata

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.crud.dm_benh import dm_benh_crud
from app.database.dm_benh import DmBenh
from app.database.session import get_db
from app.model_ai.classify_diseases import classify
from app.routes.base import create_crud_router


def _normalize(text: str) -> str:
    text = unicodedata.normalize("NFD", text or "")
    text = "".join(c for c in text if unicodedata.category(c) != "Mn")
    return text.lower().strip()


pre_router = APIRouter()


@pre_router.get("/search")
def search_disease(
    q: str = Query(..., min_length=1, description="Tên bệnh cần tìm"),
    db: Session = Depends(get_db),
):
    disease = (
        db.query(DmBenh)
        .filter(DmBenh.ten_benh == q.strip())
        .first()
    )
    if not disease:
        return None
    return {
        "ma_benh": disease.ma_benh,
        "ten_benh": disease.ten_benh,
        "ma_nhom_benh": disease.ma_nhom_benh or classify(disease.ten_benh),
        "mo_ta": disease.mo_ta,
    }


@pre_router.get("/suggest")
def suggest_diseases(
    q: str = Query(..., min_length=1, description="Tên bệnh cần gợi ý"),
    limit: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query_norm = _normalize(q)
    if not query_norm:
        return []

    rows = db.query(DmBenh).all()
    matches = []
    for row in rows:
        name = row.ten_benh or ""
        name_norm = _normalize(name)
        if not name_norm or query_norm not in name_norm:
            continue
        matches.append(
            {
                "ma_benh": row.ma_benh,
                "ten_benh": name,
                "ma_nhom_benh": row.ma_nhom_benh or classify(name),
                "mo_ta": row.mo_ta,
            }
        )

    matches.sort(
        key=lambda d: (
            0 if _normalize(d["ten_benh"]).startswith(query_norm) else 1,
            d["ten_benh"],
        )
    )
    return matches[:limit]


router = create_crud_router(
    resource="dm_benh",
    crud=dm_benh_crud,
    pre_router=pre_router,
    read_permission="dm_benh:read",
    create_permission="dm_benh:create",
    update_permission="dm_benh:update",
    delete_permission="dm_benh:delete",
)

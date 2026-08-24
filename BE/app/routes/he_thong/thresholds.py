import json
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.core.dependencies import require_permissions

router = APIRouter(prefix="/he_thong", tags=["he_thong"])

CONFIG_PATH = Path(__file__).resolve().parent.parent.parent / "config" / "thresholds.json"

DEFAULT_THRESHOLDS = {"thuoc": 100, "vat_tu": 30, "sapHetHanNgay": 90}


class ThresholdsUpdate(BaseModel):
    thuoc: int | None = None
    vat_tu: int | None = None
    sapHetHanNgay: int | None = None


def _read() -> dict:
    if CONFIG_PATH.exists():
        try:
            return json.loads(CONFIG_PATH.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError):
            pass
    return {**DEFAULT_THRESHOLDS}


def _write(data: dict) -> None:
    CONFIG_PATH.parent.mkdir(parents=True, exist_ok=True)
    CONFIG_PATH.write_text(json.dumps(data, indent=4, ensure_ascii=False), encoding="utf-8")


@router.get(
    "/thresholds",
    dependencies=[Depends(require_permissions("thuoc_vtyt:read"))],
)
def get_thresholds():
    return _read()


@router.put(
    "/thresholds",
    dependencies=[Depends(require_permissions("thuoc_vtyt:update"))],
)
def update_thresholds(body: ThresholdsUpdate):
    current = _read()
    updates = body.model_dump(exclude_unset=True)
    if not updates:
        raise HTTPException(status_code=400, detail="Không có dữ liệu cập nhật.")
    current.update({k: max(1, v) for k, v in updates.items()})
    _write(current)
    return current

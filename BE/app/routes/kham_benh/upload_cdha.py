import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status

from app.core.config import settings
from app.core.dependencies import require_permissions

router = APIRouter(prefix="/upload", tags=["upload"])

CHO_PHEP_EXT = {".png", ".jpg", ".jpeg", ".gif", ".webp", ".pdf"}
MAX_DUNG_LUONG = 20 * 1024 * 1024  # 20MB


def _thu_muc_cdha_nam(nam: int) -> Path:
    if not (2000 <= nam <= 2100):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Năm không hợp lệ.",
        )
    thu_muc = Path(settings.UPLOAD_DIR) / "cdha" / str(nam)
    thu_muc.mkdir(parents=True, exist_ok=True)
    return thu_muc


def _url_cua(duong_dan: Path) -> str:
    return "/uploads/" + duong_dan.relative_to(Path(settings.UPLOAD_DIR)).as_posix()


@router.post(
    "/cdha",
    dependencies=[Depends(require_permissions("phieu_kham_suc_khoe:update"))],
    status_code=status.HTTP_201_CREATED,
)
def upload_cdha(
    nam: int = Form(...),
    file: UploadFile = File(...),
):
    duoi = Path(file.filename or "").suffix.lower()
    if duoi not in CHO_PHEP_EXT:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Chỉ chấp nhận file ảnh (png/jpg/jpeg/gif/webp) hoặc PDF.",
        )

    noi_dung = file.file.read()
    if len(noi_dung) > MAX_DUNG_LUONG:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File vượt quá 20MB.",
        )

    thu_muc = _thu_muc_cdha_nam(nam)
    duong_dan = thu_muc / f"{uuid.uuid4().hex}{duoi}"
    duong_dan.write_bytes(noi_dung)

    return {"url": _url_cua(duong_dan)}


@router.delete(
    "/cdha",
    dependencies=[Depends(require_permissions("phieu_kham_suc_khoe:update"))],
    status_code=status.HTTP_200_OK,
)
def xoa_cdha(path: str):
    base = (Path(settings.UPLOAD_DIR) / "cdha").resolve()
    rel = path.lstrip("/")
    if rel.startswith("uploads/"):
        rel = rel[len("uploads/"):]
    target = (base / rel).resolve()
    if not target.is_relative_to(base):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Đường dẫn không hợp lệ.",
        )
    if target.is_file():
        target.unlink()
    return {"ok": True}

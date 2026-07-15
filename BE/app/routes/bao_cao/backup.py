from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse

from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, require_permissions
from app.database.nhat_ky_backup import NhatKyBackup
from app.database.session import get_db
from app.services.backup_service import BackupError, get_backup_path, list_backups, run_pg_dump

router = APIRouter(prefix="/backup", tags=["backup"])


@router.post(
    "",
    dependencies=[Depends(require_permissions("nhat_ky_backup:create"))],
    status_code=status.HTTP_201_CREATED,
)
def create_backup(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    try:
        file_path = run_pg_dump()
    except BackupError as exc:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc)) from exc

    log = NhatKyBackup(
        thoi_gian=datetime.now(timezone.utc),
        duong_dan=str(file_path),
        id_nguoi_dung=current_user.id,
    )
    db.add(log)
    db.commit()
    db.refresh(log)

    try:
        size = file_path.stat().st_size
    except OSError:
        size = 0

    return {
        "id": log.id,
        "thoi_gian": log.thoi_gian,
        "duong_dan": log.duong_dan,
        "filename": file_path.name,
        "size": size,
    }


@router.get(
    "",
    dependencies=[Depends(require_permissions("nhat_ky_backup:read"))],
)
def get_backup_list():
    return list_backups()


@router.get(
    "/download/{filename}",
    dependencies=[Depends(require_permissions("nhat_ky_backup:read"))],
)
def download_backup(filename: str):
    file_path = get_backup_path(filename)
    if file_path is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File backup không tồn tại")
    return FileResponse(path=str(file_path), filename=filename, media_type="application/octet-stream")

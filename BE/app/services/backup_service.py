import os
import shutil
import socket
import subprocess
from datetime import datetime
from pathlib import Path

from app.core.config import settings


class BackupError(Exception):
    pass


_PG_VERSIONS = ["17", "16", "15", "14", "13"]
_PG_BIN = Path(os.environ.get("ProgramFiles", "C:\\Program Files"), "PostgreSQL")

_BACKUP_TIMEOUT = 300


def _find_pg_dump() -> str:
    path = shutil.which("pg_dump")
    if path:
        return path
    for ver in _PG_VERSIONS:
        candidate = _PG_BIN / ver / "bin" / "pg_dump.exe"
        if candidate.exists():
            return str(candidate)
    raise BackupError(
        "Không tìm thấy pg_dump. Cài đặt PostgreSQL client hoặc thêm vào PATH."
    )


def _get_db_host() -> str:
    try:
        return socket.gethostbyname(settings.DB_HOST)
    except socket.gaierror:
        return "127.0.0.1"


def _run_pg_dump(args: list[str]) -> subprocess.CompletedProcess:
    tool_path = _find_pg_dump()
    host = _get_db_host()
    cmd = [
        tool_path,
        "-h", host,
        "-p", str(settings.DB_PORT),
        "-U", settings.DB_USER,
        "--no-password",
        *args,
    ]
    env = os.environ.copy()
    if settings.DB_PASSWORD:
        env["PGPASSWORD"] = settings.DB_PASSWORD

    try:
        return subprocess.run(cmd, env=env, capture_output=True, text=True, timeout=_BACKUP_TIMEOUT)
    except FileNotFoundError:
        raise BackupError("Không tìm thấy pg_dump. Kiểm tra đường dẫn PostgreSQL client.")
    except subprocess.TimeoutExpired:
        raise BackupError(f"pg_dump vượt quá thời gian cho phép ({_BACKUP_TIMEOUT}s).")


def run_pg_dump() -> Path:
    backup_dir = Path(settings.BACKUP_DIR)
    backup_dir.mkdir(parents=True, exist_ok=True)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"backup_{timestamp}.sql"
    file_path = backup_dir / filename

    result = _run_pg_dump([
        "--clean",
        "--if-exists",
        "-d", settings.DB_NAME,
        "-f", str(file_path),
    ])

    if result.returncode != 0:
        raise BackupError(f"pg_dump failed: {result.stderr.strip()}")

    return file_path


def list_backups() -> list[dict]:
    backup_dir = Path(settings.BACKUP_DIR)
    if not backup_dir.exists():
        return []

    try:
        files = sorted(backup_dir.glob("*.sql"), key=lambda f: f.stat().st_mtime, reverse=True)
    except PermissionError:
        return []

    result = []
    for f in files[:50]:
        try:
            stat = f.stat()
            result.append({
                "filename": f.name,
                "size": stat.st_size,
                "modified": datetime.fromtimestamp(stat.st_mtime).isoformat(),
            })
        except OSError:
            continue
    return result


def get_backup_path(filename: str) -> Path | None:
    backup_dir = Path(settings.BACKUP_DIR)
    safe_filename = Path(filename).name
    file_path = backup_dir / safe_filename
    if file_path.exists() and file_path.is_file():
        return file_path
    return None

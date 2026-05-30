# DataMed Backend - Project Review

> Lưu ý: File này được tạo tự động từ code review. Thứ tự ưu tiên: CRITICAL → HIGH → MEDIUM → LOW.

---

## 1. Tổng quan dự án

| Thuộc tính | Giá trị |
|------------|---------|
| **Framework** | FastAPI 0.115.6 |
| **ORM** | SQLAlchemy 2.0.36 (declarative, code-first) |
| **Database** | PostgreSQL |
| **Validation** | Pydantic v2 |
| **Migrations** | Alembic |
| **Tables** | 20 models |
| **Architecture** | Routes → CRUD → Database |

### Cấu trúc thư mục

```
BE/
├── alembic/                  # Migration config + versions
│   ├── env.py               # Alembic env (uses app models)
│   └── versions/            # 2 migration files
├── app/
│   ├── core/
│   │   ├── config.py        # load_env(), setup_cors()
│   │   └── error_handlers.py # Global error handlers
│   ├── crud/
│   │   ├── base.py          # CRUDBase<T> generic class
│   │   └── [20 resource files]  # One-liner CRUD instances
│   ├── database/
│   │   ├── base.py          # DeclarativeBase
│   │   ├── models.py        # MODEL_REGISTRY dict
│   │   ├── session.py       # Engine, SessionLocal, get_db()
│   │   └── [20 model files]
│   ├── routes/
│   │   ├── base.py          # create_crud_router() factory
│   │   ├── system.py        # /health, /resources
│   │   └── [20 resource routers]
│   ├── schemas/
│   │   ├── base.py          # SchemaBase (from_attributes=True)
│   │   ├── __init__.py      # Full exports
│   │   └── [20 schema files]
│   └── main.py              # FastAPI app definition
├── main.py                   # Re-exports api from app.main
├── requirements.txt
└── .env                      # DB credentials
```

---

## 2. Điểm tốt ✅

| # | Tính năng | Ghi chú |
|---|-----------|---------|
| 1 | **Factory pattern cho routes** | `create_crud_router()` tạo 5 CRUD endpoints cho 20 resources mà không lặp code |
| 2 | **Schema design DRY** | `Base` (data) → `Create`/`Read` (Base + PK) → `Update` (SchemaBase, all optional) |
| 3 | **Generic CRUD base class** | `CRUDBase[Model, CreateSchema, UpdateSchema]` |
| 4 | **CRUD error hierarchy** | `CRUDNotFoundError`, `CRUDBadRequestError`, `CRUDConflictError`, `CRUDDatabaseError` |
| 5 | **Composite PK support** | `_split_primary_key()` parse comma-separated values (VD: `DT001,T001`) |
| 6 | **Dynamic schema resolution** | `_resolve_schema(resource, "Create")` dùng `importlib` |
| 7 | **`_make_patch_schema`** | Auto tạo Patch model với tất cả fields optional |
| 8 | **Alembic migration** | Code-first: modify model → `alembic revision --autogenerate` → `alembic upgrade head` |
| 9 | **`max_length` validation** | Tất cả string fields có `Field(max_length=N)` matching DB `String(N)` |
| 10 | **`from_attributes=True`** | FastAPI auto-converts ORM → Pydantic on response |
| 11 | **ORM direct return** | Routes trả ORM object trực tiếp, FastAPI handle serialization |
| 12 | **Health check** | `/health` endpoint với DB connectivity test |
| 13 | **`__all__` defined** | Proper exports ở `routes/__init__.py` và `schemas/__init__.py` |
| 14 | **`.gitignore` đúng** | `.env`, `alembic.ini`, `venv/` được ignore |

---

## 3. Các lỗi cần khắc phục

### 🔴 CRITICAL - Sửa ngay

#### C1: Credentials thật trong `.env`
**File**: `.env`  
**Vấn đề**: File `.env` có credentials thật (`PGhunghp1997`). Dù `.gitignore` có `.env`, file đang tồn tại trong repo.
**Khắc phục**:
```bash
# Tạo .env.example (template không có credentials thật)
cp .env .env_backup  # backup trước
# Xóa credentials thật, chỉ giữ placeholders
```

#### C2: Thứ tự khởi động sai
**File**: `app/main.py:11,23`  
**Vấn đề**: `create_db()` được gọi TRƯỚC `load_env()`. Dù chain import giải quyết được, thứ tự trong code gây nhầm lẫn.
**Khắc phục**:
```python
# Sửa thứ tự trong main.py
load_env()          # 1. Load env trước
create_db()         # 2. Rồi mới tạo bảng
register_error_handlers(api)  # 3. Handlers
setup_cors(api)     # 4. CORS
```

#### C3: KHÔNG CÓ AUTHENTICATION 🔒
**File**: Tất cả endpoints  
**Vấn đề**: Đây là hệ thống y tế xử lý dữ liệu nhạy cảm. Tất cả 20 CRUD endpoints đều mở hoàn toàn. Bất kỳ ai có network access đều có thể đọc/ghi tất cả dữ liệu y tế.
**Khắc phục**: Cần implement authentication (JWT minimum):
```bash
# Thêm vào requirements.txt
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.20
```
Sau đó tạo:
- `app/core/security.py` - JWT utilities, password hashing
- `app/core/dependencies.py` - `get_current_user()`, `verify_token()`
- Auth routes: `/auth/login`, `/auth/register`
- Áp dụng `Depends(get_current_user)` cho tất cả resource routes

#### C4: Alembic config hardcoded credentials
**File**: `alembic.ini:5`  
**Vấn đề**: `sqlalchemy.url = postgresql+psycopg://postgres:postgres@localhost:5432/data_med`  
**Khắc phục**: Dùng environment variable:
```ini
# alembic.ini
sqlalchemy.url = driver://user:pass@localhost/dbname
# Hoặc đọc từ .env trong env.py
```

---

### 🟠 HIGH - Sửa trước production

#### H1: PK skip fragile
**File**: `crud/base.py:79`  
**Vấn đề**: `if field in self._primary_key_columns()` - so sánh string names. Nếu rename PK column ở model nhưng không ở schema, PK update sẽ silent fail.
**Khắc phục**:
```python
# Thay vì so sánh string, so sánh với column object
pk_columns = self._primary_key_columns()
for field, value in self._payload_values(payload, exclude_unset=True).items():
    if field in pk_columns:
        continue
    setattr(row, field, value)
```
Hoặc so sánh `field in {col.key for col in pk_columns}` là đủ, nhưng nên check object equality để tránh rename issues.

#### H2: `_commit` ẩn original error
**File**: `crud/base.py:133-141`  
**Vấn đề**: `raise CRUDDatabaseError("Database error") from exc` - message generic, không có context.
**Khắc phục**:
```python
def _commit(self, db: Session) -> None:
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        # Log actual error
        raise CRUDConflictError(f"Constraint violation: {exc.__cause__}") from exc
    except SQLAlchemyError as exc:
        db.rollback()
        raise CRUDDatabaseError(f"Database error: {exc.__cause__}") from exc
```

#### H3: Không có connection pooling
**File**: `session.py:33-34`  
**Vấn đề**: `create_engine()` không có `pool_size`, `max_overflow`, `pool_recycle`. Under load, connection exhaustion.
**Khắc phục**:
```python
engine = create_engine(
    build_database_url(),
    pool_size=10,
    max_overflow=20,
    pool_recycle=3600,      # Recycle sau 1 giờ
    pool_pre_ping=True,     # Check connection trước khi dùng
)
```

#### H4: Engine tạo lúc import
**File**: `session.py:33`  
**Vấn đề**: `engine = create_engine(build_database_url())` - chạy ngay khi import module. Nếu env sai, app crash ngay lập tức.
**Khắc phục**: Lazy initialization:
```python
_engine = None

def get_engine():
    global _engine
    if _engine is None:
        _engine = create_engine(build_database_url(), ...)
    return _engine

# Hoặc dùng lazyproperty decorator
```

#### H5: `crud/__init__.py` trống
**File**: `crud/__init__.py`  
**Khắc phục**: Export CRUD instances:
```python
from app.crud.benh_an import benh_an_crud
from app.crud.benh_nhan_ra_vao import benh_nhan_ra_vao_crud
# ... all 20

__all__ = [
    "benh_an_crud",
    "benh_nhan_ra_vao_crud",
    # ...
]
```

---

### 🟡 MEDIUM - Nên cải thiện

#### M1: CORS quá rộng
**File**: `core/config.py:22`  
**Vấn đề**: `allow_origins=["*"]` - mọi website đều có thể gọi API.
**Khắc phục**:
```python
# config.py
def setup_cors(app: FastAPI):
    origins = os.getenv("FRONTEND_URLS", "").split(",")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[o.strip() for o in origins if o.strip()],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
```
Và trong `.env`:
```
FRONTEND_URLS=http://localhost:5500,http://127.0.0.1:5500
```

#### M2: Không có pagination metadata
**File**: `routes/base.py`  
**Vấn đề**: List endpoint chỉ trả list, không có `total`, `has_next`, `has_previous`.
**Khắc phục**: Tạo pagination response schema:
```python
class PaginatedResponse(BaseModel):
    total: int
    limit: int
    offset: int
    has_next: bool
    has_prev: bool
    data: list[ReadSchema]

# Hoặc dùng generic:
class PaginatedResponse(BaseModel, Generic[T]):
    total: int
    data: list[T]
```

#### M3: Dùng `print()` thay vì logging
**File**: `app/main.py:11`, `session.py:39`  
**Khắc phục**:
```python
import logging
logger = logging.getLogger(__name__)

logger.info("Tables created.")
logger.warning("Database unavailable: %s", exc)
```

#### M4: Unused import
**File**: `routes/system.py:1,18`  
**Vấn đề**: `status` imported nhưng không dùng.  
**Khắc phục**: Xóa `status` khỏi import.

#### M5: Không có API versioning
**File**: Tất cả routes  
**Khắc phục**: Thêm prefix `/api/v1/`:
```python
api.include_router(router, prefix="/api/v1")
# Hoặc
router = APIRouter(prefix=f"/api/v1/{resource}")
```

#### M6: Không có rate limiting
**File**: Tất cả routes  
**Khắc phục**: Thêm slowapi:
```bash
pip install slowapi
```
```python
from slowapi import Limiter
limiter = Limiter(key_func=get_remote_address)
api = FastAPI()
api.state.limiter = limiter

@router.get("/resource")
@limiter.limit("100/minute")
def list_items(...):
    pass
```

#### M7: Không có request logging middleware
**File**: `app/main.py`  
**Khắc phục**:
```python
from fastapi import Request
import time

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    duration = time.time() - start
    logger.info(f"{request.method} {request.url.path} - {response.status_code} ({duration:.3f}s)")
    return response
```

---

### 🟢 LOW - Cải thiện nếu có thời gian

#### L1: Return type `Any`
**File**: `routes/base.py:83,87,91,95`  
**Vấn đề**: `-> list[Any]`, `-> Any`  
**Khắc phục**:
```python
def list_items(...) -> list[read_schema]:  # read_schema từ closure
def get_item(...) -> read_schema:
def create_item(...) -> read_schema:
def update_item(...) -> read_schema:
```

#### L2: Không có `__repr__` on models
**File**: Các model files  
**Khắc phục**:
```python
def __repr__(self):
    return f"<{self.__class__.__name__}(ma_don_vi={self.ma_don_vi!r})>"
```

#### L3: Không có DB indexes
**File**: Models  
**Vấn đề**: Không có explicit `Index` trên các cột thường query (`ma_quan_nhan`, `ma_benh_an`).
**Khắc phục**:
```python
from sqlalchemy import Index

class BenhAn(Base):
    __tablename__ = "benh_an"
    # ...
    __table_args__ = (
        Index("ix_benh_an_ma_quan_nhan", "ma_quan_nhan"),
        Index("ix_benh_an_ma_benh_an", "ma_benh_an"),
    )
```

#### L4: Không có unique constraint
**File**: `quan_nhan.py`  
**Vấn đề**: `so_the_bhyt` nên là unique nhưng không enforce ở DB.
**Khắc phục**:
```python
so_the_bhyt: Mapped[str | None] = mapped_column(
    String(50), unique=True  # Thêm unique=True
)
```

---

## 4. Security Assessment 🔒

| Area | Status | Notes |
|------|--------|-------|
| **Authentication** | ❌ None | Tất cả endpoints đều mở |
| **Authorization** | ❌ None | Không có row-level hoặc role-based access |
| **CORS** | ⚠️ Too permissive | `allow_origins=["*"]` |
| **SQL Injection** | ✅ Safe | SQLAlchemy ORM, parameterized queries |
| **Pydantic validation** | ✅ Good | Types và `max_length` constraints |
| **Credentials management** | ⚠️ Risk | `.env` tồn tại với credentials thật |

---

## 5. Checklist theo thứ tự ưu tiên

### Phase 1: Critical (Ngay lập tức)
- [ ] **C1**: Xóa credentials thật khỏi `.env`, tạo `.env.example`
- [ ] **C2**: Sửa startup order trong `main.py`
- [ ] **C3**: Implement Authentication (JWT)
- [ ] **C4**: Fix `alembic.ini` hardcoded credentials

### Phase 2: High (Trước production)
- [ ] **H1**: Cải thiện PK skip logic trong CRUD
- [ ] **H2**: Include sanitized error details trong CRUD exceptions
- [ ] **H3**: Thêm connection pooling config
- [ ] **H4**: Lazy engine initialization
- [ ] **H5**: Export CRUD instances từ `__init__.py`

### Phase 3: Medium (Cải thiện)
- [ ] **M1**: Restrict CORS
- [ ] **M2**: Add pagination metadata
- [ ] **M3**: Replace `print()` with logging
- [ ] **M5**: Add API versioning (`/api/v1/`)
- [ ] **M7**: Add request logging middleware

### Phase 4: Low (Khi có thời gian)
- [ ] **L1**: Fix return type annotations
- [ ] **L2**: Add `__repr__` to models
- [ ] **L3**: Add DB indexes
- [ ] **L4**: Add unique constraints

---

## 6. Kiến trúc tổng thể

### Strengths
- Clean separation: Routes → CRUD → Database
- Factory pattern loại bỏ code duplication
- Code-first với Alembic là đúng approach
- Pydantic v2 with `from_attributes=True` được dùng đúng cách
- Error handling hierarchy tốt

### Weaknesses
- **Không có auth** — vấn đề lớn nhất cho hệ thống y tế
- **Không có middleware** — không logging, rate limiting, request ID
- **Không có versioning strategy** — API sẽ khó evolve

---

> Review generated: 2026-05-29
> Project: DataMed Backend - API Quản lý quân y đơn vị
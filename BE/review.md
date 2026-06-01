# DataMed Backend - Project Review

> Lưu ý: File này được tạo tự động từ code review.

---

## 1. Tổng quan dự án

| Thuộc tính       | Giá trị                                     |
| ---------------- | ------------------------------------------- |
| **Framework**    | FastAPI 0.115.6                             |
| **ORM**          | SQLAlchemy 2.0.36 (declarative, code-first) |
| **Database**     | PostgreSQL                                  |
| **Validation**   | Pydantic v2                                 |
| **Migrations**   | Alembic                                     |
| **Tables**       | 20 models                                   |
| **Architecture** | Routes → CRUD → Database                    |

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

## 2. Các lỗi và rủi ro cần sửa

### 2.1. Mức độ cao

| Vấn đề | Vị trí tham chiếu | Rủi ro | Hướng xử lý |
| ------ | ---------------- | ------ | ----------- |
| API CRUD chưa có authentication/authorization | `app/routes/base.py` | Bất kỳ client nào cũng có thể đọc, tạo, sửa hoặc xóa dữ liệu quân y. Đây là rủi ro bảo mật nghiêm trọng. | Thêm cơ chế đăng nhập JWT/OAuth2. Gắn `Depends(get_current_user)` ở cấp router hoặc từng endpoint. Phân quyền role cho các thao tác `POST`, `PATCH`, `DELETE`. |
| CORS đang mở quá rộng | `app/core/config.py` | Cho phép origin không tin cậy gọi API, đặc biệt nguy hiểm nếu dùng credential/token trên trình duyệt. | Không dùng `allow_origins=["*"]` trong production. Đọc danh sách domain frontend từ biến môi trường như `FRONTEND_URLS`. |
| Chưa có rate limiting | `app/routes/base.py` | Dễ bị brute force ID, scraping dữ liệu, spam request hoặc DoS mức ứng dụng. | Thêm `slowapi`, middleware Redis-based hoặc cấu hình Nginx/API Gateway. Giới hạn chặt hơn cho endpoint ghi dữ liệu. |

### 2.2. Mức độ trung bình

| Vấn đề | Vị trí tham chiếu | Rủi ro | Hướng xử lý |
| ------ | ---------------- | ------ | ----------- |
| Schema update thiếu constraint so với schema create | `app/schemas/*.py` | Client có thể gửi chuỗi quá dài, số âm hoặc dữ liệu sai format. Lỗi có thể chỉ phát hiện ở database. | Giữ constraint trong schema update, ví dụ `Field(default=None, max_length=255)`, `Field(default=None, ge=0)`. |
| Thiếu validation nghiệp vụ | `app/schemas/thuoc_vtyt.py`, `app/schemas/so_nhap_xuat.py`, `app/schemas/chi_tiet_don_thuoc.py`, `app/schemas/lich_kham_sk_nam.py`, `app/schemas/ra_benh_xa.py` | Dữ liệu tồn kho, điều trị hoặc lịch khám có thể sai như số lượng âm, ngày kết thúc trước ngày bắt đầu. | Thêm `Field(ge=0)`, giới hạn năm hợp lệ, dùng `@model_validator` để kiểm tra quan hệ ngày giờ. |
| Tạo bảng database khi import app | `app/main.py`, `app/database/session.py` | Không phù hợp production, có thể tạo schema ngoài kiểm soát và che giấu lỗi migration. | Bỏ `create_all()` khỏi startup production. Dùng Alembic migration. Nếu cần cho dev, bọc bằng env flag rõ ràng. |
| Tạo database URL bằng nối chuỗi | `app/database/session.py` | Username/password có ký tự đặc biệt như `@`, `:`, `/`, `%` có thể làm sai chuỗi kết nối. | Dùng `sqlalchemy.engine.URL.create(...)`. Validate các biến môi trường bắt buộc như host, port, user, password, db name. |
| Thiếu logging lỗi server/database | `app/core/error_handlers.py` | Khó debug lỗi production, khó audit sự cố và truy vết incident bảo mật. | Dùng `logging.exception(...)` trong handler lỗi `SQLAlchemyError` và `Exception`. Có thể bổ sung request id/correlation id. |

### 2.3. Mức độ thấp hoặc cải thiện chất lượng

| Vấn đề | Vị trí tham chiếu | Rủi ro | Hướng xử lý |
| ------ | ---------------- | ------ | ----------- |
| Pagination chỉ có `limit`/`offset`, thiếu metadata | `app/routes/base.py` | Frontend không biết tổng số bản ghi, còn trang tiếp theo hay không. | Trả response dạng `{ items, total, limit, offset }`. Với bảng lớn có thể dùng cursor pagination. |
| Endpoint list chưa có filter/search rõ ràng | `app/routes/base.py`, các route resource | Frontend khó tìm kiếm dữ liệu theo nghiệp vụ, phải tải nhiều dữ liệu rồi lọc client-side. | Thêm filter theo các trường quan trọng, ví dụ đơn vị, ngày khám, tên quân nhân, mã thuốc, trạng thái phiếu. |
| Query/database stack đang synchronous | `app/database/session.py` | Vẫn chạy được với FastAPI nhưng khả năng scale thấp hơn khi tải cao. | Giữ sync nếu tải nhỏ. Nếu cần concurrency lớn, cân nhắc `AsyncSession`, `create_async_engine`, driver `asyncpg`. |
| Chưa có caching | Các endpoint danh mục/list | Dashboard hoặc màn hình danh mục có thể gọi DB lặp lại nhiều lần. | Cache Redis cho dữ liệu ít thay đổi như đơn vị, thuốc/vật tư. Invalidate cache khi tạo/sửa/xóa. |
| Error message còn chung chung | `app/crud/base.py`, `app/core/error_handlers.py` | Client khó hiển thị lỗi chính xác cho người dùng. | Map `IntegrityError` theo constraint name sang thông báo thân thiện, không trả raw SQL/database error. |
| Swagger chưa mô tả rõ nghiệp vụ | `app/main.py`, `app/routes/base.py` | API docs đủ endpoint nhưng thiếu mô tả ý nghĩa tham số, response và use case. | Thêm `summary`, `description`, response model chi tiết và ví dụ request/response cho endpoint quan trọng. |

---

## 3. Hướng phát triển đề xuất

### 3.1. Bảo mật và phân quyền

1. Xây dựng module người dùng và đăng nhập.
2. Dùng JWT access token, refresh token nếu frontend cần phiên đăng nhập dài.
3. Phân quyền theo vai trò như `admin`, `quan_ly`, `bac_si`, `duoc_si`, `nhan_vien`.
4. Giới hạn quyền thao tác theo module, ví dụ dược sĩ quản lý thuốc/kho, bác sĩ quản lý khám bệnh/đơn thuốc.
5. Ghi audit log cho thao tác nhạy cảm như xóa bệnh án, sửa tồn kho, xuất kho.

### 3.2. Tính năng API nên bổ sung

1. Filter/search/sort nâng cao cho các danh sách chính.
2. Export Excel/PDF cho báo cáo quân số, khám chữa bệnh, tồn kho, nhập xuất thuốc.
3. Dashboard thống kê theo tháng/quý/năm.
4. API cảnh báo thuốc sắp hết hạn hoặc tồn kho dưới ngưỡng.
5. API lịch sử thay đổi hồ sơ bệnh án và tồn kho.
6. Upload file đính kèm cho giấy giới thiệu, phiếu khám, kết quả xét nghiệm nếu nghiệp vụ cần.

### 3.3. Chất lượng vận hành

1. Chuẩn hóa Alembic migration, không để app tự tạo bảng trong production.
2. Thêm logging có cấu trúc, request id và log lỗi database.
3. Thêm health check chi tiết cho database.
4. Tách cấu hình theo môi trường `development`, `test`, `production`.
5. Thêm test tự động cho CRUD, validation, auth và các luồng nghiệp vụ quan trọng.

### 3.4. API contract và frontend integration

1. Chuẩn hóa format response list: `{ items, total, limit, offset }`.
2. Chuẩn hóa format lỗi: `{ code, message, details }`.
3. Thêm OpenAPI examples cho request/response.
4. Tạo enum/schema rõ ràng cho các trạng thái phiếu, loại khám, loại nhập xuất.
5. Tránh để frontend phụ thuộc vào message lỗi thô từ database.

---

## 4. Thứ tự ưu tiên triển khai

1. Thêm authentication/authorization cho toàn bộ API.
2. Sửa CORS production và bổ sung rate limiting.
3. Bổ sung validation cho schema update và các trường nghiệp vụ quan trọng.
4. Bỏ `create_all()` khỏi flow production, chuẩn hóa Alembic migration.
5. Thêm logging lỗi server/database.
6. Chuẩn hóa pagination response và error response.
7. Phát triển filter/search/export/dashboard theo nhu cầu frontend.

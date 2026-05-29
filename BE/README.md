# DataMed Backend

API Python kết nối PostgreSQL. Schema được quản lý theo hướng code-first bằng SQLAlchemy models và Alembic migrations.

## Cài đặt

```powershell
.\venv\Scripts\activate
pip install -r requirements.txt
```

## Cấu hình database

Tạo file `.env` từ `.env.example` và sửa `DATABASE_URL` theo PostgreSQL của bạn.

Ví dụ:

```env
DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/data_med
```

Tạo database rỗng trong PostgreSQL trước, ví dụ tên `data_med`, rồi chạy migration để tạo bảng từ code:

```powershell
alembic upgrade head
```

Không cần import `database_do_an.sql` khi dùng code-first. File SQL chỉ còn vai trò tài liệu tham khảo ban đầu.

## Quy trình code-first

Khi cần thay đổi database:

1. Sửa hoặc thêm model trong `app/database/<ten_bang>.py`.
2. Tạo migration mới: `alembic revision --autogenerate -m "mo ta thay doi"`.
3. Kiểm tra file migration được tạo trong `alembic/versions`.
4. Áp dụng migration: `alembic upgrade head`.

## Chạy API

```powershell
uvicorn main:app --reload
```

Swagger UI: `http://127.0.0.1:8000/docs`

Health check: `http://127.0.0.1:8000/api/health`

## Quy ước endpoint

Danh sách bảng hỗ trợ:

```http
GET /api/resources
```

CRUD chung:

```http
GET /api/{resource}?limit=100&offset=0
GET /api/{resource}/{item_id}
POST /api/{resource}
PATCH /api/{resource}/{item_id}
DELETE /api/{resource}/{item_id}
```

Với bảng có khóa chính ghép, truyền các giá trị theo thứ tự khóa chính, ngăn cách bằng dấu phẩy.

Ví dụ: `GET /api/chi_tiet_don_thuoc/DT001,T001`.

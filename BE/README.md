# Review API Backend DataMed

Ngày review: 2026-06-02

Phạm vi review: cấu trúc FastAPI, cấu hình chạy, database/session, CRUD router, auth/JWT, RBAC permission guard, security routes và hướng dẫn sử dụng API hiện tại.

## Tóm Tắt

Backend hiện là API FastAPI dùng SQLAlchemy, PostgreSQL, Alembic, JWT Bearer token và RBAC qua các bảng `nguoi_dung`, `vai_tro`, `quyen`, `vai_tro_quyen`.

Ứng dụng expose biến FastAPI là `api` tại `BE/main.py`, không phải `app`. Vì vậy lệnh chạy đúng hiện tại là:

```powershell
uvicorn app.main:api --reload
```

Các endpoint hiện đang được mount trực tiếp ở root, ví dụ `/don_vi`, `/nguoi_dung`, `/auth/login`, `/health`, `/resources`. Hiện không có prefix `/api` trong runtime.

Swagger UI:

```text
http://127.0.0.1:8000/docs
```

OpenAPI JSON:

```text
http://127.0.0.1:8000/openapi.json
```

## Phát Hiện Quan Trọng

7. `create_db()` chạy ngay khi import app.

`app/main.py` gọi `create_db()` ở cấp module. Việc import app sẽ tự tạo bảng và in `Tables created.`. Điều này gây side effect khi test, khi generate OpenAPI và có thể làm lệch quy trình Alembic migration.

8. CORS đang mở toàn bộ origin kèm credentials.

`allow_origins=["*"]` và `allow_credentials=True` không phù hợp nếu frontend dùng cookie/credentials. Nên cấu hình origin cụ thể qua env khi triển khai thật.

## Cài Đặt Và Chạy

Chạy trong thư mục `BE`:

```powershell
.\venv\Scripts\activate
pip install -r requirements.txt
```

File `.env` cần có các biến tối thiểu:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=data_med
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET_KEY=change-this-secret
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

Áp migration:

```powershell
alembic upgrade head
```

Chạy API:

```powershell
uvicorn main:api --reload
```

Kiểm tra health:

```powershell
Invoke-RestMethod -Method GET http://127.0.0.1:8000/health
```

Liệt kê resource:

```powershell
Invoke-RestMethod -Method GET http://127.0.0.1:8000/resources
```

## Xác Thực

Endpoint login:

```http
POST /auth/login
Content-Type: application/x-www-form-urlencoded
```

Body dạng form OAuth2 password:

```text
username=<ten_dang_nhap>&password=<mat_khau>
```

Ví dụ PowerShell:

```powershell
$login = Invoke-RestMethod `
  -Method POST `
  -Uri http://127.0.0.1:8000/auth/login `
  -ContentType "application/x-www-form-urlencoded" `
  -Body "username=admin&password=admin123"

$token = $login.access_token
$headers = @{ Authorization = "Bearer $token" }
```

Response:

```json
{
    "access_token": "<jwt>",
    "token_type": "bearer"
}
```

Gọi API protected:

```powershell
Invoke-RestMethod -Method GET http://127.0.0.1:8000/don_vi -Headers $headers
```

Quy ước lỗi auth:

```text
401: chưa đăng nhập, token thiếu hoặc token sai
403: đã đăng nhập nhưng thiếu quyền hoặc tài khoản bị vô hiệu hóa
```

## RBAC Và Quyền

Mô hình quyền hiện tại:

```text
nguoi_dung.id_vai_tro -> vai_tro.id
vai_tro.id -> vai_tro_quyen.id_vai_tro
vai_tro_quyen.id_quyen -> quyen.id
```

Mã quyền dùng chuẩn:

```text
resource:action
```

Ví dụ:

```text
nguoi_dung:read
nguoi_dung:create
nguoi_dung:update
nguoi_dung:delete
don_vi:read
don_vi:create
```

Role `admin` hiện được hard-code bypass trong `require_permissions`. User có `id_vai_tro = "admin"` được xem như toàn quyền.

Lưu ý vận hành: cần tạo trước role `admin`, user admin có password hash hợp lệ và quyền/role cần thiết bằng migration/script seed hoặc thao tác trực tiếp DB. API hiện chưa có endpoint bootstrap public.

## Quy Ước CRUD Chung

Với đa số resource, API có dạng:

```http
GET /{resource}?limit=100&offset=0&sort_by=<field>&sort_desc=false
GET /{resource}/{item_id}
POST /{resource}
PATCH /{resource}/{item_id}
DELETE /{resource}/{item_id}
```

Quyền tương ứng:

```text
GET list/detail: {resource}:read
POST: {resource}:create
PATCH: {resource}:update
DELETE: {resource}:delete
```

Tham số phân trang:

```text
limit: mặc định 100, min 1, max 500
offset: mặc định 0, min 0
sort_by: tên cột hợp lệ của model
sort_desc: true/false
```

Với bảng khóa chính ghép, `{item_id}` truyền các giá trị theo đúng thứ tự khóa chính, ngăn cách bằng dấu phẩy.

Ví dụ:

```http
GET /chi_tiet_don_thuoc/DT001,T001
GET /vai_tro_quyen/admin,nguoi_dung:read
```

## Danh Sách Endpoint Hiện Tại

System và auth:

```text
GET  /health
GET  /resources
POST /auth/login
```

CRUD business:

```text
/benh_an
/benh_nhan_ra_vao
/chi_tiet_don_thuoc
/chi_tiet_du_tru
/chi_tiet_phieu_cham_soc
/chi_tiet_xuat_kho
/di_tuyen_sau_dieu_tri
/don_thuoc
/don_vi
/giay_gioi_thieu
/kham_benh
/lich_kham_sk_nam
/phieu_cham_soc
/phieu_du_tru
/phieu_kham_suc_khoe
/phieu_xuat_kho
/quan_nhan
/ra_benh_xa
/so_nhap_xuat
/thuoc_vtyt
```

Security/admin:

```text
/nguoi_dung
/quyen
/vai_tro
/vai_tro_quyen
```

Audit log chỉ đọc:

```text
GET /nhat_ky_backup
GET /nhat_ky_backup/{item_id}
GET /nhat_ky_dang_nhap
GET /nhat_ky_dang_nhap/{item_id}
GET /nhat_ky_thao_tac
GET /nhat_ky_thao_tac/{item_id}
```

Các endpoint audit log không expose `POST`, `PATCH`, `DELETE`. Nếu gọi sẽ nhận `405 Method Not Allowed`.

## Ví Dụ Sử Dụng

Tạo đơn vị:

```powershell
Invoke-RestMethod `
  -Method POST `
  -Uri http://127.0.0.1:8000/don_vi `
  -Headers $headers `
  -ContentType "application/json" `
  -Body '{"ma_don_vi":"DV001","ten_don_vi":"Đơn vị 1"}'
```

Lấy danh sách đơn vị:

```powershell
Invoke-RestMethod `
  -Method GET `
  -Uri "http://127.0.0.1:8000/don_vi?limit=20&offset=0&sort_by=ma_don_vi" `
  -Headers $headers
```

Cập nhật đơn vị:

```powershell
Invoke-RestMethod `
  -Method PATCH `
  -Uri http://127.0.0.1:8000/don_vi/DV001 `
  -Headers $headers `
  -ContentType "application/json" `
  -Body '{"ten_don_vi":"Đơn vị 1 cập nhật"}'
```

Xóa đơn vị:

```powershell
Invoke-RestMethod `
  -Method DELETE `
  -Uri http://127.0.0.1:8000/don_vi/DV001 `
  -Headers $headers
```

Tạo user:

```powershell
Invoke-RestMethod `
  -Method POST `
  -Uri http://127.0.0.1:8000/nguoi_dung `
  -Headers $headers `
  -ContentType "application/json" `
  -Body '{"id":"u001","ten_dang_nhap":"bs01","mat_khau":"password123","ho_ten":"Bác sĩ 01","id_vai_tro":"bac_si","trang_thai":true}'
```

Response tạo user không trả `mat_khau` hoặc `mat_khau_hash`.

Tạo quyền:

```powershell
Invoke-RestMethod `
  -Method POST `
  -Uri http://127.0.0.1:8000/quyen `
  -Headers $headers `
  -ContentType "application/json" `
  -Body '{"id":"don_vi:read","ten_quyen":"Xem đơn vị","mo_ta":"Cho phép xem danh sách và chi tiết đơn vị"}'
```

Gán quyền cho vai trò:

```powershell
Invoke-RestMethod `
  -Method POST `
  -Uri http://127.0.0.1:8000/vai_tro_quyen `
  -Headers $headers `
  -ContentType "application/json" `
  -Body '{"id_vai_tro":"bac_si","id_quyen":"don_vi:read"}'
```

## Field Chính Theo Resource

Các field đầy đủ xem trực tiếp tại Swagger `/docs`. Tóm tắt field bắt buộc chính:

```text
benh_an: ma_benh_an
benh_nhan_ra_vao: ma_ra_vao
chi_tiet_don_thuoc: ma_don_thuoc, ma_thuoc_vtyt
chi_tiet_du_tru: ma_phieu_du_tru, ma_thuoc_vtyt
chi_tiet_phieu_cham_soc: ma_phieu_cs, ma_thuoc_vtyt
chi_tiet_xuat_kho: ma_phieu_xuat, ma_thuoc_vtyt, so_luong
di_tuyen_sau_dieu_tri: ma_chuyen_tuyen
don_thuoc: ma_don_thuoc
don_vi: ma_don_vi, ten_don_vi
giay_gioi_thieu: ma_giay_gt
kham_benh: ma_kham_benh
lich_kham_sk_nam: ma_lich_kham
nguoi_dung: id, ten_dang_nhap, mat_khau, ho_ten
phieu_cham_soc: ma_phieu_cs
phieu_du_tru: ma_phieu_du_tru
phieu_kham_suc_khoe: ma_phieu_kham
phieu_xuat_kho: ma_phieu_xuat
quan_nhan: ma_quan_nhan, ho_ten
quyen: id, ten_quyen
ra_benh_xa: ma_ra_benh_xa
so_nhap_xuat: ma_giao_dich
thuoc_vtyt: ma_thuoc_vtyt, ten_thuoc_vtyt
vai_tro: id, ten_vai_tro
vai_tro_quyen: id_vai_tro, id_quyen
```

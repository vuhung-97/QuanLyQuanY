# API Documentation — Quản lý Quân y

**Base URL:** `http://localhost:8000` · **Swagger UI:** `/docs`

---

## Authentication

```
POST /auth/login  →  { "access_token": "...", "token_type": "bearer" }
```
Gửi `form-data`/`x-www-form-urlencoded`: `username`, `password`.
Dùng header `Authorization: Bearer <token>` cho mọi request CRUD.
Token hết hạn sau **60 phút**. Payload JWT: `sub` (username), `role` (id_vai_tro), `exp`.

```
GET  /health     →  { "status": "ok" }
GET  /resources  →  { "resources": ["benh_an", "quan_nhan", ...] }
```

---

## CRUD Pattern (áp dụng cho mọi resource)

| Method | Endpoint | Mô tả | Status |
|--------|----------|-------|--------|
| GET | `/{resource}` | Danh sách (phân trang, sắp xếp) | 200 |
| GET | `/{resource}/{id}` | Chi tiết 1 bản ghi | 200 / 404 |
| POST | `/{resource}` | Tạo mới | 201 |
| PATCH | `/{resource}/{id}` | Cập nhật từng phần | 200 / 404 |
| DELETE | `/{resource}/{id}` | Xoá | 204 / 404 |

### Query params cho GET list

| Param | Kiểu | Default | Mô tả |
|-------|------|---------|-------|
| `limit` | int | 100 | Số bản ghi tối đa (1-500) |
| `offset` | int | 0 | Số bản ghi bỏ qua |
| `sort_by` | string | null | Tên cột để sắp xếp |
| `sort_desc` | bool | false | true = giảm dần |

### Primary Key (ID)

Tất cả resource dùng **string** PK. Hầu hết tự động sinh bằng nanoid (có thể ghi đè).
Không auto-ID (nhập thủ công): `quyen`, `vai_tro`, `quan_nhan`, `don_vi`.
Composite key dùng dấu phẩy: `{id1},{id2}`.

### Error Response

```json
{ "detail": "Mô tả lỗi" }
```
| Status | Ý nghĩa |
|--------|---------|
| 400 | Dữ liệu không hợp lệ |
| 401 | Chưa đăng nhập / token lỗi |
| 403 | Thiếu quyền |
| 404 | Không tìm thấy |
| 409 | Xung đột dữ liệu |
| 500 | Lỗi DB / server |

---

## Phân quyền (RBAC)

**Roles:** `ROLE_ADMIN` (full), `ROLE_CNQY`, `ROLE_BAC_SI`, `ROLE_Y_SI`.

**Permissions:** `{resource}:{action}` với action = `read`, `create`, `update`, `delete`.

### Endpoints RBAC

| Endpoint | Ghi chú |
|----------|---------|
| `POST/PATCH/DELETE /quyen` | CRUD quyền |
| `POST/PATCH/DELETE /vai_tro` | CRUD vai trò |
| `POST/PATCH/DELETE /vai_tro_quyen` | Gán quyền cho vai trò |
| `POST/PATCH/DELETE /nguoi_dung` | CRUD người dùng (hash mật khẩu) |
| `GET /nguoi_dung/me` | Thông tin tài khoản hiện tại |
| `PATCH /nguoi_dung/me` | Cập nhật thông tin cá nhân |
| `POST /nguoi_dung/me/change-password` | Đổi mật khẩu |
| `GET /nhat_ky_dang_nhap` | Audit — chỉ đọc |
| `GET /nhat_ky_thao_tac` | Audit — chỉ đọc |
| `GET /nhat_ky_backup` | Audit — chỉ đọc |

### Endpoints đặc biệt khác

| Endpoint | Ghi chú |
|----------|---------|
| `POST /backup` | Tạo backup database |
| `GET /backup` | Danh sách file backup |
| `GET /backup/download/{filename}` | Tải file backup |
| `GET /thong-ke/don-vi` | Thống kê quân số theo đơn vị |
| `GET /thong-ke/lich-kham/{ma_lich_kham}` | Thống kê tiến độ khám sức khoẻ |

---

## Danh sách Resource CRUD

| Resource | Endpoint prefix | Ghi chú |
|----------|----------------|---------|
| `benh_an` | `/benh_an` | Bệnh án |
| `benh_nhan_ra_vao` | `/benh_nhan_ra_vao` | Bệnh nhân ra vào |
| `chi_tiet_don_thuoc` | `/chi_tiet_don_thuoc` | Chi tiết đơn thuốc (composite key) |
| `chi_tiet_du_tru` | `/chi_tiet_du_tru` | Chi tiết phiếu dự trù (composite key) |
| `chi_tiet_phieu_cham_soc` | `/chi_tiet_phieu_cham_soc` | Chi tiết phiếu chăm sóc (composite key) |
| `chi_tiet_xuat_kho` | `/chi_tiet_xuat_kho` | Chi tiết xuất kho (composite key) |
| `di_tuyen_sau_dieu_tri` | `/di_tuyen_sau_dieu_tri` | Di tuyến sau điều trị |
| `don_thuoc` | `/don_thuoc` | Đơn thuốc |
| `don_vi` | `/don_vi` | Đơn vị (cây phân cấp) |
| `giay_gioi_thieu` | `/giay_gioi_thieu` | Giấy giới thiệu |
| `kham_benh` | `/kham_benh` | Khám bệnh |
| `lich_kham_sk_nam` | `/lich_kham_sk_nam` | Lịch khám sức khoẻ năm (kèm nested `/chi-tiet`) |
| `lich_kham_sk_nam_chi_tiet` | (nested) | Chi tiết lịch khám (qua `/lich_kham_sk_nam/{id}/chi-tiet`) |
| `nguoi_dung` | `/nguoi_dung` | Người dùng (hash mật khẩu, custom route) |
| `nhat_ky_backup` | `/nhat_ky_backup` | Nhật ký backup (chỉ đọc) |
| `nhat_ky_dang_nhap` | `/nhat_ky_dang_nhap` | Nhật ký đăng nhập (chỉ đọc) |
| `nhat_ky_thao_tac` | `/nhat_ky_thao_tac` | Nhật ký thao tác (chỉ đọc) |
| `phieu_cham_soc` | `/phieu_cham_soc` | Phiếu chăm sóc |
| `phieu_du_tru` | `/phieu_du_tru` | Phiếu dự trù |
| `phieu_kham_suc_khoe` | `/phieu_kham_suc_khoe` | Phiếu khám sức khoẻ (kèm custom routes) |
| `phieu_xuat_kho` | `/phieu_xuat_kho` | Phiếu xuất kho |
| `quan_nhan` | `/quan_nhan` | Quân nhân (kèm custom routes) |
| `quyen` | `/quyen` | Quyền (RBAC) |
| `ra_benh_xa` | `/ra_benh_xa` | Ra bệnh xá |
| `so_nhap_xuat` | `/so_nhap_xuat` | Sổ nhập xuất |
| `thuoc_vtyt` | `/thuoc_vtyt` | Thuốc / VTYT |
| `vai_tro` | `/vai_tro` | Vai trò (RBAC) |
| `vai_tro_quyen` | `/vai_tro_quyen` | Gán quyền - vai trò (composite key) |

---

## Custom Routes (ngoài CRUD mặc định)

### QuanNhan

| Method | Path | Description |
|--------|------|-------------|
| GET | `/quan_nhan/by-don-vi/{ma_don_vi}` | Quân nhân theo đơn vị (gồm đơn vị con) |
| GET | `/quan_nhan/by-lich-kham/{ma_lich_kham}` | Quân nhân theo lịch khám (tất cả đơn vị trong lịch) |

### PhieuKhamSucKhoe

| Method | Path | Description |
|--------|------|-------------|
| GET | `/phieu_kham_suc_khoe/latest-by-unit/{ma_don_vi}` | Phiếu khám mới nhất mỗi QN trong đơn vị |
| GET | `/phieu_kham_suc_khoe/latest-by-lich-kham/{ma_lich_kham}` | Phiếu khám mới nhất mỗi QN trong lịch khám |
| GET | `/phieu_kham_suc_khoe/by-ma-quan-nhan/{ma_quan_nhan}` | Lịch sử phiếu khám của một QN |

### LichKhamSkNam (nested `/chi-tiet`)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/{ma_lich_kham}/chi-tiet` | Danh sách đơn vị trong lịch |
| POST | `/{ma_lich_kham}/chi-tiet` | Thêm đơn vị vào lịch |
| PATCH | `/{ma_lich_kham}/chi-tiet/{ma_don_vi}` | Sửa chi tiết |
| DELETE | `/{ma_lich_kham}/chi-tiet/{ma_don_vi}` | Xóa đơn vị khỏi lịch |

---

## Field Schemas

### QuanNhan (`/quan_nhan`)

| Field | Type | Required | Max |
|-------|------|----------|-----|
| `ma_quan_nhan` | string (PK) | ✅ | 10 |
| `ma_don_vi` | string | ❌ | 10 |
| `ho_ten` | string | ✅ | 255 |
| `cap_bac` | string | ❌ | 100 |
| `chuc_vu` | string | ❌ | 100 |
| `ngay_sinh` | date | ❌ | |
| `gioi_tinh` | bool | ❌ | |
| `dan_toc` | string | ❌ | 50 |
| `nghe_nghiep` | string | ❌ (default: "Bộ đội") | 100 |
| `dia_chi` | string | ❌ | |
| `so_dien_thoai` | string | ❌ | 20 |
| `so_the_bhyt` | string | ❌ | 50 |
| `han_bhyt` | date | ❌ | |

### KhamBenh (`/kham_benh`)

| Field | Type | Required | Max |
|-------|------|----------|-----|
| `ma_kham_benh` | string (PK) | ✅ | 10 |
| `ma_quan_nhan` | string | ❌ | 10 |
| `trieu_chung` | string | ❌ | |
| `phuong_phap_dieu_tri` | string | ❌ | |
| `kham_lan` | int | ❌ | |
| `chan_doan` | string | ❌ | |

### BenhAn (`/benh_an`)

| Field | Type | Required | Max |
|-------|------|----------|-----|
| `ma_benh_an` | string (PK) | ✅ | 10 |
| `ma_quan_nhan` | string | ❌ | 10 |
| `ngoai_kieu` | string | ❌ | 100 |
| `doi_tuong` | string | ❌ | 100 |
| `quan_ly_nguoi_benh` | string | ❌ | |
| `chan_doan` | string | ❌ | |
| `tinh_trang_ra_vien` | string | ❌ | |
| `chi_tiet_benh_an` | string | ❌ | |
| `tong_ket_benh_an` | string | ❌ | |

### DonThuoc (`/don_thuoc`)

| Field | Type | Required | Max |
|-------|------|----------|-----|
| `ma_don_thuoc` | string (PK) | ✅ | 10 |
| `ma_quan_nhan` | string | ❌ | 10 |
| `chan_doan` | string | ❌ | |

### ChiTietDonThuoc (`/chi_tiet_don_thuoc`)

| Field | Type | Required | Max |
|-------|------|----------|-----|
| `ma_don_thuoc` | string (PK) | ✅ | 10 |
| `ma_thuoc_vtyt` | string (PK) | ✅ | 10 |
| `so_luong` | int | ✅ (default: 1) | |
| `huong_dieu_tri` | string | ❌ | |

### ThuocVtyt (`/thuoc_vtyt`)

| Field | Type | Required | Max | Notes |
|-------|------|----------|-----|-------|
| `ma_thuoc_vtyt` | string (PK) | ✅ | 10 | |
| `ten_thuoc_vtyt` | string | ✅ | 255 | |
| `don_vi_tinh` | string | ❌ | 50 | |
| `so_luong` | int | ❌ (default: 0) | | |
| `so_lo_han_dung` | string | ❌ | 255 | |
| `nam_san_xuat` | int | ❌ | | |
| `cap_chat_luong` | string | ❌ | 100 | |
| `phan_loai` | string | ❌ | 100 | Phân loại thuốc (kháng sinh, vitamin, ...) |
| `mo_ta` | string | ❌ | | Mô tả chi tiết |

### DonVi (`/don_vi`)

| Field | Type | Required | Max |
|-------|------|----------|-----|
| `ma_don_vi` | string (PK) | ✅ | 10 |
| `ten_don_vi` | string | ✅ | 255 |
| `ma_don_vi_truc_thuoc` | string | ❌ | 10 |

### NguoiDung (`/nguoi_dung`)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string (PK) | ✅ | max 20 |
| `ten_dang_nhap` | string | ✅ | max 50 |
| `mat_khau` | string | ✅ (create) / ❌ (update) | min 8, tự động hash, không trả về |
| `ho_ten` | string | ✅ | max 100 |
| `id_vai_tro` | string | ❌ | max 20 |
| `id_quan_nhan` | string | ❌ | max 10 |
| `trang_thai` | bool | ❌ (default: false) | |

### BenhNhanRaVao (`/benh_nhan_ra_vao`)

| Field | Type | Required | Max |
|-------|------|----------|-----|
| `ma_ra_vao` | string (PK) | ✅ | 10 |
| `ma_benh_an` | string | ❌ | 10 |
| `ngay_thang_nam` | date | ❌ | |
| `ly_do` | string | ❌ | |
| `ngay_vao` | date | ❌ | |
| `ngay_ra` | date | ❌ | |

### DiTuyenSauDieuTri (`/di_tuyen_sau_dieu_tri`)

| Field | Type | Required | Max |
|-------|------|----------|-----|
| `ma_chuyen_tuyen` | string (PK) | ✅ | 10 |
| `ma_quan_nhan` | string | ❌ | 10 |
| `ngay_di` | date | ❌ | |
| `chan_doan_luc_di` | string | ❌ | |
| `ngay_ve` | date | ❌ | |
| `chan_doan_luc_ve` | string | ❌ | |
| `ket_qua_huong_dieu_tri` | string | ❌ | |
| `noi_dieu_tri` | string | ❌ | 255 |

### GiayGioiThieu (`/giay_gioi_thieu`)

| Field | Type | Required | Max |
|-------|------|----------|-----|
| `ma_giay_gt` | string (PK) | ✅ | 10 |
| `ma_quan_nhan` | string | ❌ | 10 |
| `ten_benh_vien` | string | ❌ | 255 |
| `can_benh` | string | ❌ | |
| `y_kien_de_nghi` | string | ❌ | |
| `thoi_gian_den_benh_vien` | datetime | ❌ | |
| `chan_doan` | string | ❌ | |
| `quyet_dinh_y_sinh` | string | ❌ | |

### LichKhamSkNam (`/lich_kham_sk_nam`)

| Field | Type | Required | Max |
|-------|------|----------|-----|
| `ma_lich_kham` | string (PK) | ✅ | 10 |
| `thoi_gian_bat_dau` | datetime | ❌ | |
| `thoi_gian_ket_thuc` | datetime | ❌ | (phải >= thoi_gian_bat_dau) |

### LichKhamSkNamChiTiet (nested: `/lich_kham_sk_nam/{ma_lich_kham}/chi-tiet`)

| Field | Type | Required | Max |
|-------|------|----------|-----|
| `ma_lich_kham` | string (PK) | ✅ | 10 |
| `ma_don_vi` | string (PK) | ✅ | 10 |
| `thoi_gian_bat_dau` | datetime | ❌ | |
| `thoi_gian_ket_thuc` | datetime | ❌ | (phải >= thoi_gian_bat_dau) |
| `dia_diem` | string | ❌ | |

### PhieuKhamSucKhoe (`/phieu_kham_suc_khoe`)

| Field | Type | Required | Max |
|-------|------|----------|-----|
| `ma_phieu_kham` | string (PK) | ✅ | 10 |
| `ma_quan_nhan` | string | ❌ | 10 |
| `nam` | integer | ❌ | |
| `tien_su_benh_tat` | string | ❌ | JSON |
| `kham_lam_sang` | string | ❌ | JSON |
| `kham_can_lam_sang` | string | ❌ | JSON |
| `ket_luan` | string | ❌ | |

### PhieuChamSoc (`/phieu_cham_soc`)

| Field | Type | Required | Max |
|-------|------|----------|-----|
| `ma_phieu_cs` | string (PK) | ✅ | 10 |
| `ma_benh_an` | string | ❌ | 10 |
| `so_giuong` | string | ❌ | 50 |
| `buong` | string | ❌ | 50 |
| `thoi_gian` | datetime | ❌ | |
| `theo_doi_dien_bien` | string | ❌ | |
| `thuc_hien_y_lenh` | string | ❌ | |

### ChiTietPhieuChamSoc (`/chi_tiet_phieu_cham_soc`)

| Field | Type | Required | Max |
|-------|------|----------|-----|
| `ma_phieu_cs` | string (PK) | ✅ | 10 |
| `ma_thuoc_vtyt` | string (PK) | ✅ | 10 |
| `so_luong` | int | ❌ (default: 1) | |

### RaBenhXa (`/ra_benh_xa`)

| Field | Type | Required | Max |
|-------|------|----------|-----|
| `ma_ra_benh_xa` | string (PK) | ✅ | 10 |
| `ma_benh_an` | string | ❌ | 10 |
| `thoi_gian_vao` | datetime | ❌ | |
| `thoi_gian_ra` | datetime | ❌ | (phải >= thoi_gian_vao) |
| `phuong_phap_dieu_tri` | string | ❌ | |
| `ghi_chu` | string | ❌ | |

### PhieuDuTru (`/phieu_du_tru`)

| Field | Type | Required | Max |
|-------|------|----------|-----|
| `ma_phieu_du_tru` | string (PK) | ✅ | 10 |
| `ngay_lap_phieu` | date | ❌ | |
| `ghi_chu` | string | ❌ | |

### ChiTietDuTru (`/chi_tiet_du_tru`)

| Field | Type | Required | Max |
|-------|------|----------|-----|
| `ma_phieu_du_tru` | string (PK) | ✅ | 10 |
| `ma_thuoc_vtyt` | string (PK) | ✅ | 10 |
| `so_luong` | int | ❌ (default: 1) | |

### PhieuXuatKho (`/phieu_xuat_kho`)

| Field | Type | Required | Max |
|-------|------|----------|-----|
| `ma_phieu_xuat` | string (PK) | ✅ | 10 |
| `ma_don_vi_nhan` | string | ❌ | 10 |
| `ngay_thang_nam` | datetime | ❌ | |
| `ho_ten_nguoi_nhan` | string | ❌ | 255 |
| `ly_do_xuat` | string | ❌ | |
| `ghi_chu` | string | ❌ | |

### ChiTietXuatKho (`/chi_tiet_xuat_kho`)

| Field | Type | Required | Max |
|-------|------|----------|-----|
| `ma_phieu_xuat` | string (PK) | ✅ | 10 |
| `ma_thuoc_vtyt` | string (PK) | ✅ | 10 |
| `so_luong` | int | ✅ | |

### SoNhapXuat (`/so_nhap_xuat`)

| Field | Type | Required | Max |
|-------|------|----------|-----|
| `ma_giao_dich` | string (PK) | ✅ | 10 |
| `ma_thuoc_vtyt` | string | ❌ | 10 |
| `quy_cach` | string | ❌ | 255 |
| `don_gia` | Decimal | ❌ | >= 0 |
| `ngay_nhap_xuat` | datetime | ❌ | |
| `ten_don_vi_doi_tac` | string | ❌ | 255 |
| `so_xuat_nhap_lenh` | string | ❌ | 100 |
| `so_luong_nhap` | int | ❌ (default: 0) | >= 0 |
| `so_luong_xuat` | int | ❌ (default: 0) | >= 0 |
| `so_luong_con_lai` | int | ❌ (default: 0) | >= 0 |
| `ghi_chu` | string | ❌ | |

### VaiTro (`/vai_tro`)

| Field | Type | Required | Max |
|-------|------|----------|-----|
| `id` | string (PK) | ✅ | 20 |
| `ten_vai_tro` | string | ✅ | 100 |
| `mo_ta` | string | ❌ | |

### Quyen (`/quyen`)

| Field | Type | Required | Max |
|-------|------|----------|-----|
| `id` | string (PK) | ✅ | 100 |
| `ten_quyen` | string | ✅ | 100 |
| `mo_ta` | string | ❌ | |

### VaiTroQuyen (`/vai_tro_quyen`)

| Field | Type | Required | Max |
|-------|------|----------|-----|
| `id_vai_tro` | string (PK) | ✅ | 20 |
| `id_quyen` | string (PK) | ✅ | 100 |

### NhatKyDangNhap (`/nhat_ky_dang_nhap`) — read-only

| Field | Type |
|-------|------|
| `id` | string (PK) |
| `id_nguoi_dung` | string |
| `thoi_gian` | datetime |
| `trang_thai_thanh_cong` | bool |
| `thiet_bi` | string |

### NhatKyThaoTac (`/nhat_ky_thao_tac`) — read-only

| Field | Type |
|-------|------|
| `id` | string (PK) |
| `id_nguoi_dung` | string |
| `thoi_gian` | datetime |
| `hanh_dong` | string |
| `ten_bang` | string |
| `du_lieu_cu` | dict / list |
| `du_lieu_moi` | dict / list |
| `dia_chi_ip` | string |

### NhatKyBackup (`/nhat_ky_backup`) — read-only

| Field | Type |
|-------|------|
| `id` | string (PK) |
| `thoi_gian` | datetime |
| `duong_dan` | string |
| `id_nguoi_dung` | string |

---

## Tech Stack

- **Backend**: FastAPI (Python), SQLAlchemy ORM, PostgreSQL
- **Auth**: JWT (python-jose) + bcrypt (passlib)
- **ID Generation**: nanoid (Python)
- **API Port**: 8000
- **Swagger UI**: http://localhost:8000/docs

# API Documentation - Quản lý Quân y Đơn vị

## Base URL

```
http://localhost:8000
```

## Authentication

### GET /health
Kiểm tra kết nối database.

**Response** `200 OK`:
```json
{ "status": "ok" }
```

### GET /resources
Danh sách tất cả resource names (dùng để tra cứu quyền).

**Response** `200 OK`:
```json
{ "resources": ["benh_an", "benh_nhan_ra_vao", ...] }
```

### POST /auth/login
Đăng nhập, nhận JWT token.

**Request** (form-data / x-www-form-urlencoded):
```
username: admin
password: admin123
```

**Response** `200 OK`:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer"
}
```

### Sử dụng token

Gửi header `Authorization: Bearer <access_token>` ở tất cả các request CRUD.

Token hết hạn sau **60 phút** (cấu hình trong `.env`). Payload JWT chứa:
- `sub`: tên đăng nhập
- `role`: id_vai_tro (vd: `ROLE_ADMIN`, `ROLE_BAC_SI`, ...)
- `exp`: thời gian hết hạn

---

## CRUD Pattern (áp dụng cho tất cả resources)

Mỗi resource đều có 5 endpoints theo pattern chuẩn:

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

Tất cả resource dùng **single-column primary key** là string (max_length 10-100 tuỳ resource). Một số resource (bảng quan hệ nhiều-nhiều) dùng **composite key** — khi đó {id} là các giá trị phân cách bằng dấu phẩy (vd: `DT001,TV001` cho `chi_tiet_don_thuoc`).

**Auto-generated ID:** Hầu hết resource sử dụng thư viện [nanoid](https://github.com/ai/nanoid) (Python) để tự động sinh ID ngẫu nhiên khi tạo bản ghi. ID được sinh trong SQLAlchemy `default=` nên không cần gửi trong request body POST — nếu không gửi, hệ thống tự tạo. Người dùng vẫn có thể ghi đè bằng cách gửi ID tuỳ chỉnh.

Các bảng không auto-ID (cần nhập thủ công): `quyen`, `vai_tro`, `quan_nhan`, `don_vi` — vì ID mang ý nghĩa nghiệp vụ (vd: `ROLE_ADMIN`, `QN0001`).

Xem danh sách đầy đủ tại `BE/app/database/id_helper.py`.

---

## Phân quyền (RBAC)

### Roles (VaiTro)

| id | Mô tả |
|----|-------|
| `ROLE_ADMIN` | Quản trị viên — có tất cả quyền |
| `ROLE_CNQY` | Chủ nhiệm quân y |
| `ROLE_BAC_SI` | Bác sĩ |
| `ROLE_Y_SI` | Y sĩ |

### Permissions (Quyen)

Mỗi quyền có format: `{resource}:{action}`

Actions: `read`, `create`, `update`, `delete`

Ví dụ: `kham_benh:read`, `don_thuoc:create`, `quan_nhan:delete`

### Resources

```
benh_an, benh_nhan_ra_vao, chi_tiet_don_thuoc, chi_tiet_du_tru,
chi_tiet_phieu_cham_soc, chi_tiet_xuat_kho, di_tuyen_sau_dieu_tri,
don_thuoc, don_vi, giay_gioi_thieu, kham_benh, lich_kham_sk_nam,
phieu_cham_soc, phieu_du_tru, phieu_kham_suc_khoe, phieu_xuat_kho,
quan_nhan, ra_benh_xa, so_nhap_xuat, thuoc_vtyt,
nguoi_dung, vai_tro, quyen, vai_tro_quyen,
nhat_ky_dang_nhap, nhat_ky_thao_tac, nhat_ky_backup
```

### Endpoints quản lý RBAC

| Endpoint | Ghi chú |
|----------|---------|
| `POST/PATCH/DELETE /quyen` | CRUD quyền |
| `POST/PATCH/DELETE /vai_tro` | CRUD vai trò |
| `POST/PATCH/DELETE /vai_tro_quyen` | Gán quyền cho vai trò |
| `POST/PATCH/DELETE /nguoi_dung` | CRUD người dùng (kèm hash mật khẩu) |
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

**Lưu ý**: `lich_kham_sk_nam` có nested endpoints cho chi tiết:
- `GET /lich_kham_sk_nam/{ma_lich_kham}/chi-tiet` — Danh sách chi tiết
- `POST /lich_kham_sk_nam/{ma_lich_kham}/chi-tiet` — Thêm chi tiết
- `PATCH /lich_kham_sk_nam/{ma_lich_kham}/chi-tiet/{ma_don_vi}` — Cập nhật chi tiết
- `DELETE /lich_kham_sk_nam/{ma_lich_kham}/chi-tiet/{ma_don_vi}` — Xoá chi tiết

---

## Danh sách tất cả Resource CRUD

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
| `phieu_kham_suc_khoe` | `/phieu_kham_suc_khoe` | Phiếu khám sức khoẻ |
| `phieu_xuat_kho` | `/phieu_xuat_kho` | Phiếu xuất kho |
| `quan_nhan` | `/quan_nhan` | Quân nhân |
| `quyen` | `/quyen` | Quyền (RBAC) |
| `ra_benh_xa` | `/ra_benh_xa` | Ra bệnh xá |
| `so_nhap_xuat` | `/so_nhap_xuat` | Sổ nhập xuất |
| `thuoc_vtyt` | `/thuoc_vtyt` | Thuốc / VTYT |
| `vai_tro` | `/vai_tro` | Vai trò (RBAC) |
| `vai_tro_quyen` | `/vai_tro_quyen` | Gán quyền - vai trò (composite key) |

---

## Request / Response mẫu

### POST /kham_benh

Không cần gửi `ma_kham_benh` — ID tự động sinh bởi nanoid nếu không cung cấp:

**Request**:
```json
{
  "ma_quan_nhan": "QN0001",
  "trieu_chung_chan_doan": "Đau đầu, sốt nhẹ",
  "phuong_phap_dieu_tri": "Nghỉ ngơi, uống thuốc hạ sốt",
  "kham_lan": 1,
  "ket_qua": "Đã ổn định"
}
```

**Response** `201 Created`:
```json
{
  "ma_kham_benh": "V1StGXR8_Z",
  "ma_quan_nhan": "QN0001",
  "trieu_chung_chan_doan": "Đau đầu, sốt nhẹ",
  "phuong_phap_dieu_tri": "Nghỉ ngơi, uống thuốc hạ sốt",
  "kham_lan": 1,
  "ket_qua": "Đã ổn định"
}
```

Hoặc nếu muốn tự đặt ID:
```json
{
  "ma_kham_benh": "KB0001",
  "ma_quan_nhan": "QN0001",
  ...
}
```

### PATCH /kham_benh/KB0001

**Request** (chỉ gửi field cần cập nhật):
```json
{
  "ket_qua": "Đã hồi phục hoàn toàn"
}
```

**Response** `200 OK`: (trả về object đầy đủ sau khi update)

### GET /kham_benh?limit=10&offset=0&sort_by=ma_kham_benh&sort_desc=false

**Response** `200 OK`:
```json
[
  { "ma_kham_benh": "KB0001", ... },
  { "ma_kham_benh": "KB0002", ... }
]
```

### DELETE /kham_benh/KB0001

**Response** `204 No Content` (không có body)

---

## Error Response Format

```json
{
  "detail": "Mô tả lỗi"
}
```

| Status | Ý nghĩa |
|--------|---------|
| 400 | Dữ liệu không hợp lệ (bad request) |
| 401 | Chưa đăng nhập hoặc token không hợp lệ |
| 403 | Thiếu quyền hoặc tài khoản bị vô hiệu |
| 404 | Không tìm thấy bản ghi |
| 409 | Xung đột dữ liệu (constraint violation) |
| 500 | Lỗi database hoặc server |

---

## Các field Schema theo từng resource

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
| `trieu_chung_chan_doan` | string | ❌ | |
| `phuong_phap_dieu_tri` | string | ❌ | |
| `kham_lan` | int | ❌ | |
| `ket_qua` | string | ❌ | |

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
| Field | Type | Required | Max |
|-------|------|----------|-----|
| `ma_thuoc_vtyt` | string (PK) | ✅ | 10 |
| `ten_thuoc_vtyt` | string | ✅ | 255 |
| `don_vi_tinh` | string | ❌ | 50 |
| `so_luong` | int | ❌ (default: 0) | |
| `so_lo_han_dung` | string | ❌ | 255 |
| `nam_san_xuat` | int | ❌ | |
| `cap_chat_luong` | string | ❌ | 100 |

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
| `mat_khau` | string | ✅ (create) / ❌ (update) | min 8, KHÔNG lưu raw, tự động hash |
| `ho_ten` | string | ✅ | max 100 |
| `id_vai_tro` | string | ❌ | max 20 |
| `id_quan_nhan` | string | ❌ | max 10 |
| `trang_thai` | bool | ❌ (default: false) | |

**Lưu ý**: `nguoi_dung` có custom route (không dùng `create_crud_router`) để xử lý hash mật khẩu. Field `mat_khau` chỉ gửi khi create hoặc update — response trả về `NguoiDungRead` không bao gồm `mat_khau`.

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
| `ngay_nhap_ngu` | date | ❌ | |
| `tien_su_benh_tat` | string | ❌ | |
| `kham_lam_sang` | string | ❌ | |
| `kham_can_lam_sang` | string | ❌ | |
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
- **ID Generation**: nanoid (Python) — `BE/app/database/id_helper.py`
- **API Port**: 8000
- **Swagger UI**: http://localhost:8000/docs
- **OpenAPI JSON**: http://localhost:8000/openapi.json

# FE Architecture Guide

## Stack

React 19 + MUI + Vite 8 + react-router-dom v7 + Axios + dayjs

---

## Folder Structure

```
FE/
├── plan/                   # Tài liệu thiết kế (design_system.md, mockups)
└── src/
    │
    ├── pages/              # 1 page = 1 route, thin orchestrator
    │   ├── Login/              # Đăng nhập
    │   ├── Dashboard/          # Trang chủ
    │   ├── KhamBenhChoQN/      # Khám bệnh cho QN (KhamBenhPage.jsx, CapThuocPage.jsx)
    │   ├── KhamSucKhoe/        # Khám định kỳ (LapLichPage.jsx, KhamSucKhoePage.jsx)
    │   └── Admin/              # Admin (UserManagement, RolePermission, AuditLog)
    │
    ├── components/         # UI building blocks
    │   ├── common/         #   Dùng chung toàn app
    │   │   ├── AdminRoute.jsx
    │   │   ├── ConfirmDialog.jsx
    │   │   ├── DataTable.jsx
    │   │   ├── DatePicker.jsx
    │   │   ├── FeedbackSnackbar.jsx
    │   │   ├── PaginationWidget.jsx
    │   │   ├── PlaceHolderPage.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── SearchBar.jsx
    │   │   └── StatCardGrid.jsx
    │   │
    │   ├── layout/          # Bố cục chính
    │   │   ├── index.js
    │   │   ├── MainLayout.jsx
    │   │   ├── accountSetting/
    │   │   │   ├── AccountSettingsDialog.jsx
    │   │   │   ├── PasswordChangeForm.jsx
    │   │   │   ├── ProfileInfo.jsx
    │   │   │   └── ProfileUpdateForm.jsx
    │   │   ├── common/
    │   │   │   ├── constants.js
    │   │   │   ├── hooks.js
    │   │   │   └── menuConfig.jsx
    │   │   ├── footer/
    │   │   │   └── Footer.jsx
    │   │   ├── header/
    │   │   │   ├── Header.jsx
    │   │   │   └── Header.styles.js
    │   │   └── sidebar/
    │   │       ├── Sidebar.jsx
    │   │       ├── SidebarFooter.jsx
    │   │       ├── SidebarItem.jsx
    │   │       └── SidebarProfile.jsx
    │   │
    │   ├── KhamBenhChoQN/   # Components cho module Khám bệnh cho QN
    │   │   ├── KhamBenh/
    │   │   │   ├── DanhSachKhamBenh.jsx
    │   │   │   ├── DonThuocForm.jsx
    │   │   │   ├── KhamBenhForm.jsx
    │   │   │   ├── KhoThuocDialog.jsx
    │   │   │   └── TiepNhanQnDialog.jsx
    │   │   ├── CapThuoc/
    │   │   │   ├── CapThuocForm.jsx
    │   │   │   └── CapThuocList.jsx
    │   │   └── ChuyenTuyen/
    │   │       ├── ChuyenTuyenDialog.jsx
    │   │       └── NhapVienDialog.jsx
    │   │
    │   ├── KhamSucKhoe/     # Components cho module Khám định kỳ
    │   │   ├── KhamSucKhoeUtils.js
    │   │   ├── KiemTraSucKhoe/
    │   │   │   ├── BangQuanNhan.jsx
    │   │   │   ├── KhamSucKhoeForm.jsx
    │   │   │   ├── KhamSucKhoeFormUtils.js
    │   │   │   ├── DanhSachPhieuKhamFilterBar.jsx
    │   │   │   ├── KhamSucKhoeForm.jsx
    │   │   │   ├── KhamSucKhoeFormUtils.js
    │   │   │   ├── KhamSucKhoeMain.jsx
    │   │   │   ├── LichSuKhamDialog.jsx
    │   │   │   └── tabs/
    │   │   │       ├── ChanDoanHinhAnhTab.jsx
    │   │   │       ├── fieldRanges.js
    │   │   │       ├── KetLuanTab.jsx
    │   │   │       ├── LamSangTab.jsx
    │   │   │       ├── TongQuanTab.jsx
    │   │   │       └── XetNghiemTab.jsx
    │   │   └── LapLich/
    │   │       ├── ChonNgayGio.jsx
    │   │       ├── DanhSachLich.jsx
    │   │       ├── LapLichDialog.jsx
    │   │       └── TongQuanDonVi.jsx
    │   │
    │   └── admin/           # Components cho module Admin
    │       ├── AdminPageHeader.jsx
    │       ├── TableCard.jsx
    │       ├── AuditLog/
    │       │   ├── AuditDetailDialog.jsx
    │       │   ├── BackupTab.jsx
    │       │   ├── DangNhapTab.jsx
    │       │   └── ThaoTacTab.jsx
    │       ├── RolePermission/
    │       │   ├── PermissionCard.jsx
    │       │   └── RoleFormDialog.jsx
    │       └── UserManager/
    │           ├── UserFormDialog.jsx
    │           └── UserTableRow.jsx
    │
    ├── hooks/              # Custom hooks — tách logic khỏi UI
    │   ├── useCapThuoc.jsx
    │   ├── useDanhSachKhamBenh.jsx
    │   ├── useDebounce.jsx
    │   ├── useTongQuanTab.jsx
    │   ├── useKhamBenhForm.jsx
    │   ├── useKhamSucKhoeData.jsx
    │   ├── useKhamSucKhoeForm.jsx
    │   ├── useKhamSucKhoeMain.jsx
    │   ├── useLapLichDialog.jsx
    │   ├── useLichKhamData.jsx
    │   └── usePermissionDiff.js
    │
    ├── services/           # API layer
    │   ├── adminService.js
    │   ├── api.js
    │   ├── khamBenhService.js
    │   └── khamSucKhoeService.js
    │
    ├── data/               # Dữ liệu tĩnh
    │   └── trieu_chung.json
    │
    ├── utils/              # Helper functions thuần
    │   ├── date.js
    │   └── xlsExport.js
    │
    ├── App.jsx             # Root: BrowserRouter + toàn bộ Routes
    ├── theme.js            # MUI theme (màu sắc, typography, component overrides)
    └── main.jsx            # Entry point (ReactDOM.createRoot)
```

---

## Data Flow

```
Page → Component → Hook → Service → api.js (Axios) → Backend
```

- **pages/**: 1 file per route, gọi components, không chứa logic nghiệp vụ
- **components/**: render UI, lấy state/logic từ hooks
- **hooks/**: chứa toàn bộ state + handlers + API calls, return về cho component dùng
- **services/**: mỗi module 1 file, export object các method gọi Axios
- **api.js**: interceptor tự động đính JWT token, 401 → redirect `/login`

---

## Routing Layout

Tất cả route ngoài `/login` đều nằm trong `ProtectedRoute`, được bọc bởi `MainLayout` (sidebar + header).

Thêm route mới:

```jsx
<Route path="module-moi" element={<ModulePage />} />
```

---

## Design System (theme.js)

Không hardcode màu/font-size — dùng theme variant.
Nếu cần có thể thêm thuộc tính mới vào theme.js

---

## Coding Conventions

### Thêm feature mới

1. Route → `App.jsx`
2. Page → `pages/<Module>/`
3. Components → `components/<Module>/`
4. Hook → nếu có form/logic phức tạp
5. Service → nếu cần API mới

### Component pattern

- Sub-components cùng file (const function) cho các section/form group
- Chỉ tách file riêng khi tái sử dụng ở nơi khác

### Form state

- Gom fields vào 1 `formState` object
- Dùng `updateField(name, value)` pattern
- Logic trong custom hook `use<Feature>Form`
- Sử dụng `useState` cho các trường nhập liệu

### Error handling

```jsx
catch (err) {
    setSnackbar({
        open: true,
        message: err.response?.data?.detail || "Fallback message.",
        severity: "error",
    });
}
```

### Service pattern

```js
export const moduleService = {
    list: (params) => api.get("/endpoint", { params }),
    getById: (id) => api.get(`/endpoint/${id}`),
    create: (data) => api.post("/endpoint", data),
    update: (id, data) => api.patch(`/endpoint/${id}`, data),
    delete: (id) => api.delete(`/endpoint/${id}`),
};
```

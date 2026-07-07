# FE Architecture Guide

## Stack

React 19 + MUI + Vite 8 + react-router-dom v7 + Axios + dayjs

---

## Folder Structure

`	ext
FE/
├── plan/                   # Tài liệu thiết kế (design_system.md, mockups)
└── src/
    ├── pages/              # 1 page = 1 route, thin orchestrator
    │   ├── Admin/              # AuditLogPage, RolePermissionPage, UserManagementPage
    │   ├── Dashboard/          # DashboardPage
    │   ├── KhamBenhChoQN/      # CapThuocPage, ChuyenTuyenPage, KhamBenhPage
    │   ├── KhamSucKhoe/        # KhamSucKhoePage, LapLichPage
    │   ├── KhoDuoc/            # DuTruPage, NhapKhoPage, XuatKhoPage
    │   ├── Login/              # LoginForm, LoginHero, LoginPage
    │   └── NoiTru/             # DanhSachNoiTruPage, LapBenhAnPage, QuanLyPhongGiuongPage
    │
    ├── components/         # UI building blocks
    │   ├── admin/          # AdminPageHeader, TableCard, AuditLog, RolePermission, UserManager
    │   ├── common/         # AdminRoute, ProtectedRoute, DataTable, DatePicker, PaginationWidget, PatientInfoCard, print...
    │   ├── layout/         # MainLayout, Header, Sidebar, AccountSettings...
    │   ├── KhamBenhChoQN/  # CapThuoc, ChuyenTuyen, KhamBenh (Forms, Dialogs, Lists, Sections)
    │   ├── KhamSucKhoe/    # KiemTraSucKhoe (BangQuanNhan, tabs...), LapLich (ChonNgayGio, PhanCong...)
    │   ├── KhoDuoc/        # DuTru (ChiTiet, List, Print), NhapKho, XuatKho, ThuocSearchSelect
    │   └── NoiTru/         # DanhSachNoiTru, LapBenhAn, QuanLyPhongGiuong (BuongDialog)
    │
    ├── hooks/              # Custom hooks — tách logic khỏi UI
    ├── services/           # API layer (gọi Axios)
    ├── data/               # Dữ liệu tĩnh
    ├── utils/              # Helper functions thuần
    ├── App.jsx             # Root: BrowserRouter + toàn bộ Routes
    ├── theme.js            # MUI theme
    └── main.jsx            # Entry point
`

------

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

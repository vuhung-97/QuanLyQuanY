# FE Architecture Guide

## Stack

React 19 + MUI + Vite 8 + react-router-dom v7 + Axios + dayjs

---

## Folder Structure

```
FE/
├── plan/                       # Tài liệu thiết kế
└── src/
    ├── pages/                  # 1 page = 1 route, thin orchestrator
    │   ├── Admin/              # AuditLogPage, RolePermissionPage, UserManagementPage
    │   ├── Dashboard/          # DashboardPage
    │   ├── KhamBenhChoQN/      # CapThuocPage, ChuyenTuyenPage, KhamBenhPage
    │   ├── KhamSucKhoe/        # KhamSucKhoePage, LapLichPage
    │   ├── KhoDuoc/            # DuTruPage, KhoPage, NhapKhoPage, XuatKhoPage
    │   ├── Login/              # LoginForm, LoginHero, LoginPage
    │   └── NoiTru/             # DanhSachNoiTruPage, LapBenhAnPage, QuanLyPhongGiuongPage
    │
    ├── components/             # UI building blocks
    │   ├── admin/              # AuditLog/ RolePermission/ UserManager/
    │   ├── common/             # DataTable, DatePicker, DonThuoc, PatientInfoCard,
    │   │                       # PaginationWidget, SearchBarDebounced, StatCardGrid,
    │   │                       # FilterModeToggle, ConfirmDialog, FeedbackSnackbar,
    │   │                       # DialogTitleWrapper, ChonQuanNhanDialog, ProtectedRoute,
    │   │                       # print/...
    │   ├── layout/             # accountSetting/ common/ footer/ header/ sidebar/
    │   ├── KhamBenhChoQN/      # CapThuoc/ ChuyenTuyen/ KhamBenh/ (forms, dialogs, lists)
    │   │                       # └── KhamBenhSections/ (Symptoms, Diagnosis, FormActions)
    │   ├── KhamSucKhoe/        # common/ KiemTraSucKhoe/ LapLich/
    │   │                       # └── KiemTraSucKhoe/ → common/fields/ tabs/
    │   ├── KhoDuoc/            # DuTru/ Kho/ NhapKho/ XuatKho/
    │   └── NoiTru/             # common/ DanhSachNoiTru/→tabs/ LapBenhAn/ QuanLyPhongGiuong/
    │
    ├── hooks/                  # 31 hooks — tách logic khỏi UI
    │                           # useDanhSachKhamBenh, useKhamBenhForm, useCapThuoc,
    │                           # useChuyenTuyen, useFilterModePagination, useDebounce,
    │                           # useThuocList, usePhieuDuTru, usePhieuXuat, useKhoList,
    │                           # useKhoForm, useDanhSachNoiTru, useLapBenhAnForm,
    │                           # useLapBenhAn, useQuanLyPhongGiuong, usePhieuChamSoc,
    │                           # useKhamSucKhoeForm, useKhamSucKhoeData, useKhamSucKhoeMain,
    │                           # useLichKhamData, useLapLichDialog, usePhanCongNhiemVu,
    │                           # useTongQuanTab, useLichSuKham, useFormTab,
    │                           # useLogin, usePermissionDiff,
    │                           # useAdminAuditLogs, useAdminRoles, useAdminUsers, ...
    ├── services/               # adminService, khamBenhService, khamSucKhoeService,
    │                           # khoDuocService, noiTruService, api.js (Axios instance)
    ├── constants/              # khamBenhConstants, khamSucKhoeConstants,
    │                           # khoConstant, noiTruConstants
    ├── utils/                  # date.js, khamBenhUtils.js, treeUtils.js,
    │                           # xlsExport.js, yearOptions.js
    ├── data/                   # trieu_chung.json
    ├── App.jsx                 # Root: BrowserRouter + toàn bộ Routes
    ├── theme.js                # MUI theme
    └── main.jsx                # Entry point
```

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

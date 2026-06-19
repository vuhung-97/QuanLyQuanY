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
    │   ├── KhamBenh/           # Khám bệnh (KhamBenhPage.jsx, CapThuocPage.jsx)
    │   ├── PeriodicCheckup/    # Khám định kỳ (SchedulePage, CheckupPage)
    │   └── Admin/              # Admin (UserManagement, RolePermission, AuditLog)
    │
    ├── components/         # UI building blocks
    │   ├── common/         #   Dùng chung toàn app
    │   │   ├── DataTable.jsx         # Bảng dữ liệu (columns, rows, loading, onRowClick)
    │   │   ├── SearchBar.jsx         # Ô tìm kiếm
    │   │   ├── ConfirmDialog.jsx     # Dialog xác nhận (xóa...)
    │   │   ├── FeedbackSnackbar.jsx  # Toast thông báo (success/error/warning)
    │   │   ├── StatCardGrid.jsx      # Hàng thẻ thống kê
    │   │   ├── PaginationWidget.jsx  # Điều hướng trang
    │   │   ├── PlaceHolderPage.jsx   # Trang tạm cho module chưa phát triển
    │   │   ├── ProtectedRoute.jsx    # Auth guard (JWT)
    │   │   └── AdminRoute.jsx        # Role guard (admin)
    │   │
    │   ├── layout/          # Bố cục chính
    │   │   ├── MainLayout.jsx        # Layout wrapper (sidebar + header + outlet)
    │   │   ├── sidebar/              # Sidebar: Sidebar.jsx, SidebarItem.jsx,
    │   │   │                         #   SidebarProfile.jsx, SidebarFooter.jsx
    │   │   ├── header/               # Header: Header.jsx, Header.styles.js
    │   │   ├── footer/
    │   │   ├── accountSetting/
    │   │   └── common/
    │   │
    │   ├── KhamBenh/        # Components cho module Khám bệnh
    │   │   ├── ExaminationList.jsx   # Danh sách ca khám + DataTable + stat cards
    │   │   ├── ExaminationForm.jsx   # Dialog khám bệnh (form)
    │   │   ├── PrescriptionForm.jsx  # Kê đơn thuốc
    │   │   ├── ReceiveQnDialog.jsx   # Dialog tiếp nhận quân nhân mới
    │   │   ├── PatientHistory.jsx    # Lịch sử khám
    │   │   ├── ReferralDialog.jsx    # Chuyển tuyến
    │   │   ├── AdmissionDialog.jsx   # Nhập viện
    │   │   ├── CapThuocList.jsx      # Danh sách QN chờ cấp thuốc
    │   │   └── CapThuocForm.jsx      # Dialog cấp thuốc + in đơn
    │   │
    │   ├── PeriodicCheckup/ # Components cho module Khám định kỳ
    │   │   ├── HealthCheck/          # Form khám sức khỏe (HealthCheckForm.jsx + tabs)
    │   │   ├── Schedule/             # Lập lịch
    │   │   └── periodicUtils.js
    │   │
    │   └── admin/           # Components cho module Admin
    │       ├── AdminPageHeader.jsx
    │       ├── UserTableRow.jsx
    │       ├── PermissionCard.jsx
    │       ├── AuditDetailDialog.jsx
    │       ├── TableCard.jsx
    │       └── TableEmptyRow.jsx
    │
    ├── hooks/              # Custom hooks — tách logic khỏi UI
    │   ├── useExaminationForm.jsx    # Form khám bệnh
    │   ├── useExaminationList.jsx    # Danh sách khám bệnh (main list + dialogs)
    │   ├── useHealthCheckForm.jsx    # Form khám sức khỏe
    │   ├── useHealthCheckData.jsx    # Data cho khám sức khỏe
    │   ├── useScheduleDialog.jsx     # Dialog lập lịch
    │   ├── useScheduleData.jsx       # Data lập lịch
    │   ├── usePermissionDiff.js      # So sánh phân quyền
    │   └── useCapThuoc.jsx           # Cấp thuốc (danh sách chờ, cấp thuốc)
    │
    ├── services/           # API layer
    │   ├── api.js              # Axios instance (baseURL, JWT interceptor, 401 handler)
    │   └── khamBenhService.js  # Endpoints cho module Khám bệnh
    │
    ├── data/               # Dữ liệu tĩnh
    │   └── trieu_chung.json
    │
    ├── utils/              # Helper functions thuần
    │   ├── date.js             # formatDate, formatDateTime
    │   └── xlsExport.js        # Xây dựng + download Excel file
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

# Kế hoạch: Cho phép thêm vai trò mới mà không cần sửa code menu

## Vấn đề

Hiện tại `FE/src/components/layout/common/menuConfig.jsx` hardcode role name vào `allowedRoles`:

```js
const ALL    = ["ROLE_ADMIN", "ROLE_CNQY", "ROLE_BACSI", "ROLE_YSI"];
const NO_YSI = ["ROLE_ADMIN", "ROLE_CNQY", "ROLE_BACSI"];
const ADMIN  = ["ROLE_ADMIN", "ROLE_CNQY"];
```

Khi thêm vai trò mới (vd `ROLE_DUOCSI`) qua admin, role đó không có trong danh sách → user không thấy menu nào. Phải sửa code thủ công.

Backend đã có RBAC hoàn chỉnh (`VaiTro` → `VaiTroQuyen` → `Quyen` với permission dạng `resource:action`).

---

## Giải pháp: Menu Visibility Config

Tạo bảng riêng trong DB + trang admin checkbox để cấu hình menu cho từng vai trò.

### BE — Model mới

```python
class MenuVisibility(Base):
    __tablename__ = "menu_visibility"
    id_vai_tro: Mapped[str] = mapped_column(String(20), ForeignKey("vai_tro.id"), primary_key=True)
    id_menu: Mapped[str] = mapped_column(String(50), primary_key=True)
```

### BE — Endpoint

```python
@router.get("/users/me/menus")
def get_my_visible_menus(current_user = Depends(get_current_user), db = Depends(get_db)):
    menus = db.query(MenuVisibility.id_menu).filter(
        MenuVisibility.id_vai_tro == current_user.id_vai_tro
    ).all()
    return {"menus": [m.id_menu for m in menus]}
```

### BE — Seed data mặc định

Insert mapping cho 4 role hiện tại (ROLE_ADMIN → all, ROLE_YSI → subset, ...).

### FE — menuConfig.jsx

Thêm `id` duy nhất cho mỗi menu item, filter bằng `allowedMenuIds` từ API:

```js
function filterMenuByVisibility(items, allowedMenuIds) {
    return items
        .filter((item) => allowedMenuIds.includes(item.id))
        .map((item) => {
            if (!item.children) return item
            const visibleChildren = item.children.filter((child) =>
                allowedMenuIds.includes(child.id)
            )
            if (visibleChildren.length === 0) return null
            return { ...item, children: visibleChildren }
        })
        .filter(Boolean)
}
```

### FE — Trang admin mới

Giao diện: chọn vai trò → grid checkbox các menu có sẵn → lưu.

### File cần sửa

| File | Thao tác |
|---|---|
| `BE/app/database/menu_visibility.py` | Model mới |
| `BE/app/database/models.py` | Import model |
| `BE/app/schemas/menu_visibility.py` | Schema mới |
| `BE/app/crud/menu_visibility.py` | CRUD mới |
| `BE/app/routes/menu_visibility.py` | Route CRUD + `/users/me/menus` |
| `FE/src/components/layout/common/menuConfig.jsx` | Thêm `id` cho mỗi item, sửa hàm filter |
| `FE/src/components/layout/main/MainLayout.jsx` | Fetch allowed menu IDs |
| `FE/src/pages/Admin/...` | Trang admin mới + menu item cho nó |
| Seed script | Insert mapping mặc định |

---

## So sánh

| Tiêu chí | Permission-based (1) | Menu Visibility Config (2) |
|---|---|---|
| Dùng lại RBAC có sẵn | ✔ Không cần bảng mới | ✘ Phải tạo bảng + CRUD mới |
| Khối lượng BE | 1 endpoint | Model + Schema + CRUD + Route + endpoint + seed |
| Khối lượng FE | Sửa 3 file | Sửa 3 file + **trang admin mới** |
| Học đường cong | Thấp (hiểu permission là biết ngay) | Cao hơn (khái niệm mới) |
| Admin tự cấu hình | Qua trang phân quyền có sẵn (gán permission `resource:action`) | Trang riêng "Phân quyền menu" |
| Menu mới thêm vào code | Cần chọn permission phù hợp | Cần vào admin tick checkbox |
| Gắn với backend security | Logic chặt chẽ (menu == permission) | Có thể lệch (menu visible nhưng API 403) |

---

## Kết luận

**Giải pháp 1 (Permission-based)** được khuyến nghị vì:
- Tận dụng RBAC đã có, không thêm bảng/CRUD
- Menu tự động đồng bộ với backend security
- Khối lượng code ít hơn

Giải pháp 2 phù hợp nếu muốn tách bạch quyền menu khỏi quyền API, hoặc nếu nghiệp vụ yêu cầu cấu hình menu độc lập.

Chờ quyết định trước khi implement.

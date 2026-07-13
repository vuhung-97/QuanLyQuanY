# Kế hoạch triển khai ROLE_QN

## Tổng quan

| Thành phần | Số file sửa | Loại                                               |
| ---------- | ----------- | -------------------------------------------------- |
| **BE**     | 5 file      | 1 schema, 1 route, 1 migration, 1 auth, 1 security |
| **FE**     | 4 file      | 1 constants, 1 menu, 1 page, 1 component           |

ROLE_QN: quân nhân chỉ xem được Dashboard + Báo cáo (3 tab). Tự động load data của chính họ, ẩn nút chọn quân nhân.

---

## 1. BE — Thêm `id_quan_nhan` vào JWT payload

**File:** `BE/app/routes/auth.py` (line 60)

```python
access_token = create_access_token(
    data={
        "sub": user.ten_dang_nhap,
        "role": user.id_vai_tro,
        "ho_ten": user.ho_ten,
        "id": user.id,
        "id_quan_nhan": user.id_quan_nhan,   # THÊM
    }
)
```

> `NguoiDung.id_quan_nhan` nullable → JWT field là `null` nếu không gán. Không ảnh hưởng role cũ.

---

## 2. BE — Thêm `QN` vào hằng số Role

**File:** `BE/app/core/security.py` (class Role)

```python
class Role:
    ADMIN = "admin"
    CNQY = "chu_nhiem_quan_y"
    BAC_SI = "bac_si"
    Y_SI = "y_si"
    QN = "quan_nhan"                    # THÊM
```

> Class Role chỉ là tài liệu tham khảo (`Role.` không được dùng trong code).

---

## 3. BE — Alembic migration seed ROLE_QN + permissions

**File mới:** `BE/alembic/versions/20260713_000001_seed_role_qn.py`

- `down_revision = "20260709_000003"` (head hiện tại)
- Thêm role `ROLE_QN` vào `vai_tro`
- Thêm 4 permissions vào `vai_tro_quyen`:

| Permission                 | API cần dùng                                              |
| -------------------------- | --------------------------------------------------------- |
| `quan_nhan:read`           | GET `/quan_nhan/{id}`                                     |
| `phieu_kham_suc_khoe:read` | GET `/phieu_kham_suc_khoe/quan-nhan/{maQuanNhan}`         |
| `kham_benh:read`           | GET `/kham_benh/danh-sach`, GET `/kham_benh/chuyen-tuyen` |
| `benh_an:read`             | GET `/benh_an/noi-tru`                                    |

> Migration idempotent: SELECT trước khi INSERT.
> Các permissions đã tồn tại trong `quyen` từ seed ban đầu → không insert trùng.
> Các endpoint `/bao-cao/*` không yêu cầu permission → xem được cả 3 tab.

---

## 4. BE — Thêm `ten_don_vi` vào schema QuanNhanRead

**File:** `BE/app/schemas/quan_nhan.py` (class QuanNhanRead, dòng 43-46)

```python
class QuanNhanRead(QuanNhanBase):
    ma_quan_nhan: str = Field(max_length=10)
    is_dang_dieu_tri: bool = False
    is_da_chuyen_tuyen: bool = False
    ten_don_vi: str | None = None   # THÊM
```

> Optional field → list endpoints trả về `null`. Backward compatible: FE `ChonQuanNhanDialog` tự resolve tên đơn vị từ `ma_don_vi`, không phụ thuộc field này.

---

## 5. BE — Override GET /{ma_quan_nhan} để populate ten_don_vi

**File:** `BE/app/routes/quan_nhan.py` — thêm endpoint vào `pre_router` (trước dòng `router = create_crud_router(...)`)

```python
@pre_router.get(
    "/{ma_quan_nhan}",
    dependencies=[Depends(require_permissions("quan_nhan:read"))],
    response_model=QuanNhanRead,
)
def get_quan_nhan_detail(ma_quan_nhan: str, db: Session = Depends(get_db)):
    qn = db.query(QuanNhan).filter(QuanNhan.ma_quan_nhan == ma_quan_nhan).first()
    if not qn:
        raise HTTPException(status_code=404, detail="Quân nhân không tồn tại")
    don_vi = db.query(DonVi).filter(DonVi.ma_don_vi == qn.ma_don_vi).first()
    data = {c.name: getattr(qn, c.name) for c in qn.__table__.columns}
    data["ten_don_vi"] = don_vi.ten_don_vi if don_vi else None
    data["is_dang_dieu_tri"] = False
    data["is_da_chuyen_tuyen"] = False
    return data
```

> Pre_router routes được insert trước CRUD routes (base.py line 90-93) → match trước → override auto-generated GET `/{item_id}`.
> `DonVi` đã import sẵn (line 9).

---

## 6. FE — Thêm ROLE_QN vào ROLE_NAME_MAP

**File:** `FE/src/components/layout/common/constants.js` (line 24-29)

```js
export const ROLE_NAME_MAP = {
    ROLE_ADMIN: "Quản trị viên",
    ROLE_CNQY: "Chủ nhiệm Quân y",
    ROLE_BACSI: "Bác sĩ",
    ROLE_YSI: "Y sĩ",
    ROLE_QN: "Quân nhân", // THÊM
};
```

---

## 7. FE — Menu config: QN chỉ thấy Dashboard + Báo cáo

**File:** `FE/src/components/layout/common/menuConfig.jsx`

```jsx
const ALL = ["ROLE_ADMIN", "ROLE_CNQY", "ROLE_BACSI", "ROLE_YSI"];
const QN_ACCESSIBLE = [...ALL, "ROLE_QN"]; // THÊM
const NO_YSI = ["ROLE_ADMIN", "ROLE_CNQY", "ROLE_BACSI"];
const ADMIN = ["ROLE_ADMIN", "ROLE_CNQY"];
```

Sửa 2 `allowedRoles`:

- **Dashboard** (line 23): `allowedRoles: QN_ACCESSIBLE`
- **Báo cáo** (line 164): `allowedRoles: QN_ACCESSIBLE`

> QN không thấy KSK, Nội trú, Khám bệnh, Kho dược, Quản trị — tránh 403 khi click.

---

## 8. FE — BaoCaoPage decode JWT + pass maQuanNhan

**File:** `FE/src/pages/BaoCao/BaoCaoPage.jsx`

```jsx
import { useState, useMemo } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import BaoCaoThangMain from "../../components/BaoCao/BaoCaoThang/BaoCaoThangMain.jsx";
import BaoCaoQuanSoKhoeMain from "../../components/BaoCao/BaoCaoQSKhoe/BaoCaoQuanSoKhoeMain.jsx";
import BaoCaoQuanNhanMain from "../../components/BaoCao/BaoCaoQuanNhan/BaoCaoQuanNhanMain.jsx";
import { decodeJWT } from "../../services/api.js";
import { STORAGE_KEYS } from "../../components/layout/common/constants.js";

export default function BaoCaoPage() {
    const [tab, setTab] = useState(0);

    const jwtPayload = useMemo(() => {
        const token = localStorage.getItem(STORAGE_KEYS.token);
        return token ? decodeJWT(token) : null;
    }, []);

    const role = jwtPayload?.role || "";
    const id_quan_nhan = jwtPayload?.id_quan_nhan || "";

    return (
        <Box>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
                <Tab label="Quân y tháng" />
                <Tab label="Quân số khỏe" />
                <Tab label="Quân nhân" />
            </Tabs>
            {tab === 0 && <BaoCaoThangMain />}
            {tab === 1 && <BaoCaoQuanSoKhoeMain />}
            {tab === 2 && (
                <BaoCaoQuanNhanMain
                    maQuanNhan={role === "ROLE_QN" ? id_quan_nhan : undefined}
                />
            )}
        </Box>
    );
}
```

---

## 9. FE — BaoCaoQuanNhanMain: auto-load + ẩn button

**File:** `FE/src/components/BaoCao/BaoCaoQuanNhan/BaoCaoQuanNhanMain.jsx`

### a) Thêm imports

```jsx
import { useState, useMemo, useEffect } from "react"; // thêm useEffect
import { khamBenhService } from "@/services/khamBenhService.js";
```

### b) Sửa signature

```jsx
export default function BaoCaoQuanNhanMain({ maQuanNhan }) {
```

### c) Thêm state + effect

```jsx
const [initLoading, setInitLoading] = useState(false);
const [initError, setInitError] = useState(null);

useEffect(() => {
    if (!maQuanNhan) return;
    if (quanNhan) return;
    let cancelled = false;
    setInitLoading(true);
    setInitError(null);
    khamBenhService
        .getQuanNhan(maQuanNhan)
        .then((res) => {
            if (!cancelled && res.data) {
                setQuanNhan(res.data); // có ten_don_vi nhờ BE
            }
        })
        .catch((err) => {
            if (!cancelled) {
                setInitError(
                    err.response?.data?.detail ||
                        "Không thể tải thông tin quân nhân",
                );
            }
        })
        .finally(() => {
            if (!cancelled) setInitLoading(false);
        });
    return () => {
        cancelled = true;
    };
}, [maQuanNhan]); // eslint-disable-line
```

### d) Ẩn nút "Chọn quân nhân"

```jsx
{
    !maQuanNhan && (
        <Stack direction="row" spacing={2}>
            <Button
                variant="contained"
                startIcon={<PersonSearchIcon />}
                onClick={() => setOpenChonQn(true)}
            >
                Chọn quân nhân
            </Button>
        </Stack>
    );
}
```

### e) Ẩn Dialog

```jsx
{!maQuanNhan && (
    <ChonQuanNhanDialog ... />
)}
```

### f) Cập nhật LoadingAlert

```jsx
<LoadingAlert
    loading={loading || initLoading}
    error={error || initError}
    empty={!quanNhan && !initLoading && !initError}
    emptyMessage={
        maQuanNhan ? "Đang tải..." : "Vui lòng chọn quân nhân để xem thông tin."
    }
/>
```

---

## Flow hoàn chỉnh ROLE_QN

```
Login → JWT { role: "ROLE_QN", id_quan_nhan: "QN001", ... }
  ↓
Menu → Dashboard + Báo cáo (các menu khác ẩn)
  ↓
Vào Báo cáo → 3 tabs, tab "Quân nhân"
  ↓
useEffect phát hiện maQuanNhan="QN001"
  → GET /quan_nhan/QN001 → { ma_quan_nhan, ho_ten, ten_don_vi, ... }
  → setQuanNhan(data) → hook gọi 4 API: KSK, KB, BA, CT
  ↓
PatientInfoCard hiện thông tin (có ten_don_vi)
4 DataTable hiện lịch sử KSK, KB, BA, CT
Không có nút "Chọn quân nhân"
```

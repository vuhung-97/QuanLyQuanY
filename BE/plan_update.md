Kế Hoạch Thực Hiện

1. Xác định mô hình quyền (Đã hoàn thành)
- Dùng vai_tro, quyen, vai_tro_quyen làm RBAC.
- Chuẩn hóa mã quyền dạng: resource:action (vd: nguoi_dung:read).
- Đã định nghĩa hằng số tại BE/app/core/security.py (class Role, Action, RESOURCES, get_all_permissions).
- Vai trò bootstrap: admin (toàn quyền).

2. Thêm auth core (Đã hoàn thành)
- Tạo xử lý hash password (bcrypt) tại BE/app/core/auth.py.
- Thêm endpoint login tại /auth/login (BE/app/routes/auth.py).
- Trả JWT access token có sub, role, exp.
- Cấu hình JWT (JWT_SECRET_KEY, JWT_ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES) trong BE/app/core/config.py, đọc từ .env.

3. Thêm dependency guard (Đã hoàn thành)

- get_current_user: đọc Bearer token, decode JWT, load user từ DB, kiểm tra trang_thai.
- require_permissions(...): kiểm tra quyền của user qua id_vai_tro -> vai_tro_quyen -> quyen.
- Trả 401 khi chưa login/token sai, 403 khi thiếu quyền.

4. Điều chỉnh router base (Đã hoàn thành)

- Mở rộng create_crud_router() để nhận permission theo action (read_permission, create_permission, update_permission, delete_permission).
- Áp quyền riêng cho từng method:
    - GET list/detail: resource:read
    - POST: resource:create
    - PATCH: resource:update
    - DELETE: resource:delete
- Không public router security bằng CRUD trần.

5. Tách router đặc biệt cho user/security (Đã hoàn thành)

- nguoi_dung: không expose mat_khau_hash; dùng password khi tạo/reset mật khẩu rồi hash server-side.
- vai_tro, quyen, vai_tro_quyen: chỉ admin hoặc role có quyền quản trị.
- Log audit: nên chỉ cho read với admin/auditor; không cho update/delete qua API thường.

6. Public lại router security (Đã hoàn thành)

- Import các router security vào BE/app/routes/**init**.py.
- Thêm vào RESOURCE_ROUTERS sau khi guard đã gắn đầy đủ.
- Xóa hoặc thay comment tạm bằng comment rõ ràng hơn nếu cần.

7. Kiểm thử (Đã hoàn thành mức kiểm tra nhanh)

- Chưa login gọi router security phải nhận 401.
- Login user không đủ quyền gọi route admin phải nhận 403.
- Admin có quyền gọi CRUD hợp lệ nhận 200/201/204.
- Tạo user không trả về hash password.
- Không thể tự gán role/quyền nếu thiếu quyền.
- Log audit không bị sửa/xóa qua endpoint thường.
  Câu Hỏi Cần Chốt
  Bạn muốn dùng JWT Bearer token đơn giản cho giai đoạn này, hay cần session/refresh token ngay từ đầu? Với trạng thái code hiện tại, JWT Bearer đơn giản là hướng phù hợp nhất để public lại các router security an toàn.

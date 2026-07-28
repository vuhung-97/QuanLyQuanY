import { Stack, Typography } from "@mui/material";

export default function ProfileInfo({ profile }) {
    return (
        <Stack spacing={0.5}>
            <Typography>
                <strong>- Họ tên:</strong> {profile?.ho_ten}
            </Typography>
            <Typography>
                <strong>- Tên đăng nhập:</strong> {profile?.ten_dang_nhap}
            </Typography>
            <Typography>
                <strong>- Vai trò:</strong> {profile?.ten_vai_tro || "Chưa gán"}
            </Typography>
            <Typography>
                <strong>- Trạng thái:</strong>{" "}
                {profile?.trang_thai ? "Hoạt động" : "Vô hiệu hóa"}
            </Typography>
        </Stack>
    );
}

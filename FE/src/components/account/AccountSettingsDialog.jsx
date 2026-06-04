import { useEffect, useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import api from "../../services/api.js";
import FeedbackSnackbar from "../common/FeedbackSnackbar.jsx";

export default function AccountSettingsDialog({ open, onClose }) {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [hoTen, setHoTen] = useState("");
    const [savingProfile, setSavingProfile] = useState(false);

    const [matKhauCu, setMatKhauCu] = useState("");
    const [matKhauMoi, setMatKhauMoi] = useState("");
    const [xacNhan, setXacNhan] = useState("");
    const [changingPassword, setChangingPassword] = useState(false);

    useEffect(() => {
        if (!open) return;
        let ignore = false;

        async function loadProfile() {
            setLoading(true);
            setError("");
            try {
                const res = await api.get("/nguoi_dung/me");
                if (!ignore) {
                    setProfile(res.data);
                    setHoTen(res.data.ho_ten || "");
                }
            } catch (err) {
                if (!ignore)
                    setError(
                        err.response?.data?.detail ||
                            "Không thể tải thông tin tài khoản.",
                    );
            } finally {
                if (!ignore) setLoading(false);
            }
        }

        loadProfile();
        return () => {
            ignore = true;
        };
    }, [open]);

    const handleUpdateProfile = async (event) => {
        event.preventDefault();
        setSavingProfile(true);
        setError("");
        try {
            await api.patch("/nguoi_dung/me", { ho_ten: hoTen });
            setSuccess("Cập nhật thông tin thành công");
            setProfile((prev) => ({ ...prev, ho_ten: hoTen }));
        } catch (err) {
            setError(
                err.response?.data?.detail || "Không thể cập nhật thông tin.",
            );
        } finally {
            setSavingProfile(false);
        }
    };

    const handleChangePassword = async (event) => {
        event.preventDefault();
        setError("");

        if (matKhauMoi !== xacNhan) {
            setError("Mật khẩu mới và xác nhận không khớp.");
            return;
        }

        setChangingPassword(true);
        try {
            await api.post("/nguoi_dung/me/change-password", {
                mat_khau_cu: matKhauCu,
                mat_khau_moi: matKhauMoi,
            });
            setSuccess("Đổi mật khẩu thành công");
            setMatKhauCu("");
            setMatKhauMoi("");
            setXacNhan("");
        } catch (err) {
            setError(err.response?.data?.detail || "Không thể đổi mật khẩu.");
        } finally {
            setChangingPassword(false);
        }
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
                <DialogTitle>Cài đặt tài khoản</DialogTitle>
                <DialogContent>
                    {loading ? null : (
                        <Stack spacing={2} sx={{ pt: 1 }}>
                            <Typography variant="h2">
                                Thông tin tài khoản
                            </Typography>
                            <Stack spacing={0.5}>
                                <Typography>
                                    <strong>Họ tên:</strong> {profile?.ho_ten}
                                </Typography>
                                <Typography>
                                    <strong>Tên đăng nhập:</strong>{" "}
                                    {profile?.ten_dang_nhap}
                                </Typography>
                                <Typography>
                                    <strong>Vai trò:</strong>{" "}
                                    {profile?.ten_vai_tro || "Chưa gán"}
                                </Typography>
                                <Typography>
                                    <strong>Trạng thái:</strong>{" "}
                                    {profile?.trang_thai
                                        ? "Hoạt động"
                                        : "Vô hiệu hóa"}
                                </Typography>
                            </Stack>

                            <Typography variant="h3" sx={{ mt: 1 }}>
                                Cập nhật họ tên
                            </Typography>
                            <Stack
                                component="form"
                                onSubmit={handleUpdateProfile}
                                direction="row"
                                spacing={1.5}
                            >
                                <TextField
                                    value={hoTen}
                                    onChange={(e) => setHoTen(e.target.value)}
                                    size="small"
                                    required
                                    sx={{ flexGrow: 1 }}
                                    slotProps={{
                                        htmlInput: { maxLength: 100 },
                                    }}
                                />
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={savingProfile}
                                >
                                    {savingProfile ? "Đang lưu..." : "Lưu"}
                                </Button>
                            </Stack>

                            <Divider sx={{ my: 1 }} />

                            <Typography variant="h2">Đổi mật khẩu</Typography>
                            <Stack
                                component="form"
                                onSubmit={handleChangePassword}
                                spacing={2}
                            >
                                <TextField
                                    label="Mật khẩu cũ"
                                    type="password"
                                    value={matKhauCu}
                                    onChange={(e) =>
                                        setMatKhauCu(e.target.value)
                                    }
                                    required
                                    size="small"
                                />
                                <TextField
                                    label="Mật khẩu mới"
                                    type="password"
                                    value={matKhauMoi}
                                    onChange={(e) =>
                                        setMatKhauMoi(e.target.value)
                                    }
                                    required
                                    size="small"
                                    helperText="Tối thiểu 8 ký tự"
                                    slotProps={{
                                        htmlInput: { minLength: 8 },
                                    }}
                                />
                                <TextField
                                    label="Xác nhận mật khẩu mới"
                                    type="password"
                                    value={xacNhan}
                                    onChange={(e) => setXacNhan(e.target.value)}
                                    required
                                    size="small"
                                    error={!!xacNhan && matKhauMoi !== xacNhan}
                                    helperText={
                                        !!xacNhan && matKhauMoi !== xacNhan
                                            ? "Mật khẩu không khớp"
                                            : " "
                                    }
                                />
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={changingPassword}
                                >
                                    {changingPassword
                                        ? "Đang đổi..."
                                        : "Đổi mật khẩu"}
                                </Button>
                            </Stack>
                        </Stack>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5 }}>
                    <Button onClick={onClose}>Đóng</Button>
                </DialogActions>
            </Dialog>

            <FeedbackSnackbar
                open={!!success}
                message={success}
                severity="success"
                onClose={() => setSuccess("")}
            />
            <FeedbackSnackbar
                open={!!error}
                message={error}
                severity="error"
                onClose={() => setError("")}
            />
        </>
    );
}

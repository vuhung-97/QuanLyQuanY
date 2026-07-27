import { useState } from "react";
import { Button, Divider, Stack, TextField, Typography } from "@mui/material";
import api from "@/services/api.js";

export default function PasswordChangeForm({ onSuccess, onError }) {
    const [matKhauCu, setMatKhauCu] = useState("");
    const [matKhauMoi, setMatKhauMoi] = useState("");
    const [xacNhan, setXacNhan] = useState("");
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (matKhauMoi !== xacNhan) {
            onError?.("Mật khẩu mới và xác nhận không khớp.");
            return;
        }
        setSaving(true);
        try {
            await api.post("/nguoi_dung/me/change-password", {
                mat_khau_cu: matKhauCu,
                mat_khau_moi: matKhauMoi,
            });
            onSuccess?.("Đổi mật khẩu thành công");
            setMatKhauCu("");
            setMatKhauMoi("");
            setXacNhan("");
        } catch (err) {
            onError?.(err.response?.data?.detail || "Không thể đổi mật khẩu.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <Divider sx={{ my: 1 }} />
            <Typography variant="h4">- Đổi mật khẩu</Typography>
            <Typography variant="body2" color="text.secondary">
                <i>(Tối thiểu 8 ký tự)</i>
            </Typography>
            <Stack component="form" onSubmit={handleSubmit} spacing={2}>
                <TextField
                    label="Mật khẩu cũ"
                    type="password"
                    value={matKhauCu}
                    onChange={(e) => setMatKhauCu(e.target.value)}
                    required
                    size="small"
                />
                <TextField
                    label="Mật khẩu mới"
                    type="password"
                    value={matKhauMoi}
                    onChange={(e) => setMatKhauMoi(e.target.value)}
                    required
                    size="small"
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
                <Button type="submit" variant="contained" disabled={saving}>
                    {saving ? "Đang đổi..." : "Đổi mật khẩu"}
                </Button>
            </Stack>
        </>
    );
}

import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    MenuItem,
    Stack,
    Switch,
    TextField,
} from "@mui/material";
import api from "../../services/api.js";

const emptyForm = {
    ten_dang_nhap: "",
    mat_khau: "",
    ho_ten: "",
    id_vai_tro: "",
    id_quan_nhan: "",
    trang_thai: true,
};

export default function UserFormDialog({ open, onClose, editingUser, roles, onSaved }) {
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (open) {
            setForm(editingUser ? { ...emptyForm, ...editingUser, mat_khau: "" } : emptyForm);
            setError("");
            setSaving(false);
        }
    }, [open, editingUser]);

    const handleChange = (event) => {
        const { name, value, checked, type } = event.target;
        setForm((current) => ({
            ...current,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError("");
        try {
            const payload = { ...form };
            if (!editingUser) delete payload.id;
            if (editingUser && !payload.mat_khau) delete payload.mat_khau;

            let res;
            if (editingUser) {
                res = await api.patch(`/nguoi_dung/${editingUser.id}`, payload);
            } else {
                res = await api.post("/nguoi_dung", payload);
            }
            onSaved(res.data, !!editingUser);
            onClose();
        } catch (err) {
            setError(err.response?.data?.detail || "Không thể lưu tài khoản người dùng.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <Box component="form" onSubmit={handleSubmit}>
                <DialogTitle>
                    {editingUser ? "Cập nhật tài khoản" : "Thêm tài khoản người dùng"}
                </DialogTitle>
                <DialogContent>
                    {error && (
                        <TextField
                            error
                            fullWidth
                            value={error}
                            slotProps={{ input: { readOnly: true } }}
                            sx={{ mb: 2 }}
                            helperText="Vui lòng thử lại."
                        />
                    )}
                    <Stack spacing={2} sx={{ pt: 1 }}>
                        <TextField
                            name="ten_dang_nhap"
                            label="Tên đăng nhập"
                            value={form.ten_dang_nhap}
                            onChange={handleChange}
                            required
                            slotProps={{ htmlInput: { maxLength: 50 } }}
                        />
                        <TextField
                            name="mat_khau"
                            label={editingUser ? "Mật khẩu mới (nếu đổi)" : "Mật khẩu"}
                            type="password"
                            value={form.mat_khau}
                            onChange={handleChange}
                            required={!editingUser}
                            helperText="Tối thiểu 8 ký tự"
                            slotProps={{ htmlInput: { minLength: 8 } }}
                        />
                        <TextField
                            name="ho_ten"
                            label="Họ tên"
                            value={form.ho_ten}
                            onChange={handleChange}
                            required
                            slotProps={{ htmlInput: { maxLength: 100 } }}
                        />
                        <TextField
                            select
                            name="id_vai_tro"
                            label="Vai trò"
                            value={form.id_vai_tro || ""}
                            onChange={handleChange}
                        >
                            <MenuItem value="">Chưa gán</MenuItem>
                            {roles.map((role) => (
                                <MenuItem key={role.id} value={role.id}>
                                    {role.ten_vai_tro || role.id}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            name="id_quan_nhan"
                            label="Mã quân nhân"
                            value={form.id_quan_nhan || ""}
                            onChange={handleChange}
                            slotProps={{ htmlInput: { maxLength: 20 } }}
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    name="trang_thai"
                                    checked={Boolean(form.trang_thai)}
                                    onChange={handleChange}
                                />
                            }
                            label="Tài khoản đang hoạt động"
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5 }}>
                    <Button onClick={onClose}>Hủy</Button>
                    <Button type="submit" variant="contained" disabled={saving}>
                        {saving ? "Đang lưu..." : "Lưu"}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}

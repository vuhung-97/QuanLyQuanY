import { useState } from "react";
import { Button, Divider, Stack, TextField, Typography } from "@mui/material";
import api from "@/services/api.js";

export default function ProfileUpdateForm({ initialName, onSuccess, onError }) {
    const [hoTen, setHoTen] = useState(initialName ?? "");
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await api.patch("/nguoi_dung/me", { ho_ten: hoTen });
            onSuccess?.(res.data);
        } catch (err) {
            onError?.(
                err.response?.data?.detail || "Không thể cập nhật thông tin.",
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <Divider sx={{ my: 1 }} />
            <Typography variant="h4" sx={{ mt: 1 }}>
                - Cập nhật họ tên
            </Typography>
            <Stack
                component="form"
                onSubmit={handleSubmit}
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
                <Button type="submit" variant="contained" disabled={saving}>
                    {saving ? "Đang lưu..." : "Lưu"}
                </Button>
            </Stack>
        </>
    );
}

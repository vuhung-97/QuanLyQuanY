import { useEffect, useState } from "react";
import {
    Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
    Stack, TextField, Typography,
} from "@mui/material";
import api from "../../services/api.js";

export default function HealthCheckForm({ open, onClose, onSaved, quanNhan, existingPhieu }) {
    const [form, setForm] = useState({
        ma_quan_nhan: "",
        ngay_nhap_ngu: "",
        tien_su_benh_tat: "",
        kham_lam_sang: "",
        kham_can_lam_sang: "",
        ket_luan: "",
        chi_dan_can_thiet: "",
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const isEdit = Boolean(existingPhieu);

    useEffect(() => {
        if (open && quanNhan) {
            if (existingPhieu) {
                setForm({
                    ma_quan_nhan: existingPhieu.ma_quan_nhan || quanNhan.ma_quan_nhan,
                    ngay_nhap_ngu: existingPhieu.ngay_nhap_ngu || "",
                    tien_su_benh_tat: existingPhieu.tien_su_benh_tat || "",
                    kham_lam_sang: existingPhieu.kham_lam_sang || "",
                    kham_can_lam_sang: existingPhieu.kham_can_lam_sang || "",
                    ket_luan: existingPhieu.ket_luan || "",
                    chi_dan_can_thiet: existingPhieu.chi_dan_can_thiet || "",
                });
            } else {
                setForm({
                    ma_quan_nhan: quanNhan.ma_quan_nhan,
                    ngay_nhap_ngu: "",
                    tien_su_benh_tat: "",
                    kham_lam_sang: "",
                    kham_can_lam_sang: "",
                    ket_luan: "",
                    chi_dan_can_thiet: "",
                });
            }
            setError("");
        }
    }, [open, quanNhan, existingPhieu]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        try {
            if (isEdit) {
                await api.patch(`/phieu_kham_suc_khoe/${existingPhieu.ma_phieu_kham}`, form);
            } else {
                await api.post("/phieu_kham_suc_khoe", form);
            }
            onSaved();
            onClose();
        } catch (err) {
            setError(err.response?.data?.detail || "Không thể lưu phiếu khám.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <Box component="form" onSubmit={handleSubmit}>
                <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>Phiếu khám sức khỏe</span>
                    <Typography variant="body2" color="text.secondary">
                        {quanNhan?.ho_ten} ({quanNhan?.ma_quan_nhan})
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    {error && (
                        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                            {error}
                        </Typography>
                    )}
                    <Stack spacing={2} sx={{ pt: 1 }}>
                        <TextField name="ngay_nhap_ngu" label="Ngày nhập ngũ" type="date"
                            value={form.ngay_nhap_ngu} onChange={handleChange}
                            fullWidth slotProps={{ inputLabel: { shrink: true } }} />
                        <TextField name="tien_su_benh_tat" label="Tiền sử bệnh tật"
                            value={form.tien_su_benh_tat} onChange={handleChange}
                            multiline minRows={2} fullWidth />
                        <TextField name="kham_lam_sang" label="Khám lâm sàng"
                            value={form.kham_lam_sang} onChange={handleChange}
                            multiline minRows={3} fullWidth />
                        <TextField name="kham_can_lam_sang" label="Khám cận lâm sàng"
                            value={form.kham_can_lam_sang} onChange={handleChange}
                            multiline minRows={3} fullWidth />
                        <TextField name="ket_luan" label="Kết luận"
                            value={form.ket_luan} onChange={handleChange}
                            multiline minRows={2} fullWidth />
                        <TextField name="chi_dan_can_thiet" label="Chỉ dẫn cần thiết"
                            value={form.chi_dan_can_thiet} onChange={handleChange}
                            multiline minRows={2} fullWidth />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5 }}>
                    <Button onClick={onClose}>Hủy</Button>
                    <Button type="submit" variant="contained" disabled={saving}>
                        {saving ? "Đang lưu..." : "Lưu phiếu"}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}

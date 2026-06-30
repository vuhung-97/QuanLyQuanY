import { useCallback, useEffect, useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    MenuItem,
    TextField,
    Typography,
} from "@mui/material";
import NormalToggleField from "@/components/common/NormalToggleField";

const KET_QUA_OPTIONS = [
    { value: "khỏi", label: "Khỏi" },
    { value: "đỡ", label: "Đỡ" },
    { value: "không_thay_đổi", label: "Không thay đổi" },
    { value: "nặng_hơn", label: "Nặng hơn" },
    { value: "tử_vong", label: "Tử vong" },
];

export default function RaVienDialog({
    open,
    benhAn,
    saving,
    onConfirm,
    onClose,
}) {
    const [formState, setFormState] = useState({
        ket_qua_dieu_tri: "",
        chan_doan_ra_vien: "",
        tinh_trang_nb: "",
        huong_dieu_tri: "",
        ngay_ra: new Date().toISOString().slice(0, 10),
    });

    useEffect(() => {
        if (open) {
            setFormState({
                ket_qua_dieu_tri: "",
                chan_doan_ra_vien: "",
                tinh_trang_nb: "",
                huong_dieu_tri: "",
                ngay_ra: new Date().toISOString().slice(0, 10),
            });
        }
    }, [open]);

    const updateField = useCallback((e) => {
        const { name, value } = e.target;
        setFormState((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handleConfirm = useCallback(() => {
        const payload = {
            tong_ket_benh_an: JSON.stringify({
                ket_qua_dieu_tri: formState.ket_qua_dieu_tri,
                chan_doan_ra_vien: formState.chan_doan_ra_vien,
                tinh_trang_nb: formState.tinh_trang_nb,
                huong_dieu_tri: formState.huong_dieu_tri,
                ngay_ra: formState.ngay_ra,
            }),
        };
        onConfirm(payload);
    }, [formState, onConfirm]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Typography
                    sx={{ fontSize: 20, fontWeight: 700, textAlign: "center" }}
                >
                    Ra viện cho: {benhAn?.ho_ten || benhAn?.ma_benh_an || ""}
                </Typography>
            </DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            label="Kết quả điều trị"
                            select
                            fullWidth
                            size="medium"
                            value={formState.ket_qua_dieu_tri}
                            onChange={updateField}
                            name="ket_qua_dieu_tri"
                            slotProps={{ input: { sx: { fontSize: "1rem" } } }}
                        >
                            {KET_QUA_OPTIONS.map((opt) => (
                                <MenuItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <NormalToggleField
                            label="Chẩn đoán lúc ra viện"
                            name="chan_doan_ra_vien"
                            value={formState.chan_doan_ra_vien}
                            onChange={updateField}
                            multiline
                            minRows={4}
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <NormalToggleField
                            label="Tình trạng người bệnh khi ra viện"
                            name="tinh_trang_nb"
                            value={formState.tinh_trang_nb}
                            onChange={updateField}
                            multiline
                            minRows={4}
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <NormalToggleField
                            label="Hướng điều trị và các chế độ tiếp theo"
                            name="huong_dieu_tri"
                            value={formState.huong_dieu_tri}
                            onChange={updateField}
                            multiline
                            normalText="Không có"
                            minRows={4}
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            label="Ngày ra"
                            type="date"
                            fullWidth
                            size="medium"
                            value={formState.ngay_ra}
                            onChange={updateField}
                            name="ngay_ra"
                            slotProps={{
                                inputLabel: { shrink: true },
                                input: { sx: { fontSize: "1rem" } },
                            }}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={onClose} sx={{ textTransform: "none" }}>
                    Hủy
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    onClick={handleConfirm}
                    disabled={saving}
                    sx={{ textTransform: "none" }}
                >
                    {saving ? "Đang xử lý..." : "Xác nhận ra viện"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

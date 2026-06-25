import { useCallback, useState } from "react";
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

const TINH_TRANG_OPTIONS = [
    { value: "khỏi", label: "Khỏi" },
    { value: "đỡ", label: "Đỡ" },
    { value: "giảm", label: "Giảm" },
    { value: "nặng_hơn", label: "Nặng hơn" },
];

export default function RaVienDialog({
    open,
    benhAn,
    saving,
    onConfirm,
    onClose,
}) {
    const [formState, setFormState] = useState({
        tinh_trang_ra_vien: "",
        chi_tiet_benh_an: "",
        tong_ket_benh_an: "",
        ngay_ra: new Date().toISOString().slice(0, 10),
    });

    const updateField = useCallback((name, value) => {
        setFormState((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handleConfirm = useCallback(() => {
        onConfirm(formState);
    }, [formState, onConfirm]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
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
                            label="Tình trạng ra viện"
                            select
                            fullWidth
                            value={formState.tinh_trang_ra_vien}
                            onChange={(e) =>
                                updateField(
                                    "tinh_trang_ra_vien",
                                    e.target.value,
                                )
                            }
                        >
                            {TINH_TRANG_OPTIONS.map((opt) => (
                                <MenuItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            label="Chi tiết bệnh án"
                            multiline
                            minRows={3}
                            fullWidth
                            value={formState.chi_tiet_benh_an}
                            onChange={(e) =>
                                updateField("chi_tiet_benh_an", e.target.value)
                            }
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            label="Tổng kết"
                            multiline
                            minRows={3}
                            fullWidth
                            value={formState.tong_ket_benh_an}
                            onChange={(e) =>
                                updateField("tong_ket_benh_an", e.target.value)
                            }
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            label="Ngày ra"
                            type="date"
                            fullWidth
                            value={formState.ngay_ra}
                            onChange={(e) =>
                                updateField("ngay_ra", e.target.value)
                            }
                            slotProps={{ inputLabel: { shrink: true } }}
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

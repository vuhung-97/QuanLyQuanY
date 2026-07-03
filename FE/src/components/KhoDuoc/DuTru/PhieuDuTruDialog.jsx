import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    IconButton,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import DialogTitleWrapper from "@/components/common/DialogTitleWrapper.jsx";
import FeedbackSnackbar from "@/components/common/FeedbackSnackbar.jsx";
import { khoDuocService } from "@/services/khoDuocService.js";
import { decodeJWT } from "@/services/api.js";
import ThuocSearchSelect from "../ThuocSearchSelect.jsx";

export default function PhieuDuTruDialog({ open, onClose, onSaved }) {
    const [ghiChu, setGhiChu] = useState("");
    const [items, setItems] = useState([{ thuoc: null, soLuong: 1 }]);
    const [saving, setSaving] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

    useEffect(() => {
        if (open) {
            setGhiChu("");
            setItems([{ thuoc: null, soLuong: 1 }]);
        }
    }, [open]);

    const addItem = () => setItems((prev) => [...prev, { thuoc: null, soLuong: 1 }]);
    const removeItem = (idx) => setItems((prev) => prev.filter((_, i) => i !== idx));
    const updateItem = (idx, field, val) =>
        setItems((prev) => prev.map((item, i) => (i === idx ? { ...item, [field]: val } : item)));

    const isValid = () => {
        if (items.length === 0) return false;
        return items.every((item) => item.thuoc && item.soLuong > 0);
    };

    const handleSave = async () => {
        if (!isValid()) return;
        setSaving(true);
        try {
            const token = localStorage.getItem("datamed_access_token");
            const payload = token ? decodeJWT(token) : null;
            const nguoiLap = payload?.id || null;

            const phieuRes = await khoDuocService.createPhieuDuTru({
                ghi_chu: ghiChu || null,
                trang_thai: "chua_duyet",
                nguoi_lap: nguoiLap,
            });
            const maPhieu = phieuRes.data.ma_phieu_du_tru;

            for (const item of items) {
                await khoDuocService.createChiTietDuTru({
                    ma_phieu_du_tru: maPhieu,
                    ma_thuoc_vtyt: item.thuoc.ma_thuoc_vtyt,
                    so_luong: item.soLuong,
                });
            }

            setSnackbar({ open: true, message: "Tạo phiếu dự trù thành công.", severity: "success" });
            onSaved?.(maPhieu);
            onClose();
        } catch (err) {
            setSnackbar({
                open: true,
                message: err.response?.data?.detail || "Không thể tạo phiếu dự trù.",
                severity: "error",
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <Dialog open={open} onClose={saving ? undefined : onClose} fullWidth maxWidth="md">
                <DialogTitleWrapper>Tạo phiếu dự trù</DialogTitleWrapper>
                <DialogContent>
                    <Stack spacing={2.5} sx={{ pt: 1 }}>
                        <TextField
                            label="Ghi chú"
                            value={ghiChu}
                            onChange={(e) => setGhiChu(e.target.value)}
                            multiline
                            rows={2}
                            fullWidth
                        />

                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            Danh sách thuốc / VTYT
                        </Typography>

                        {items.map((item, idx) => (
                            <Stack key={idx} direction="row" spacing={1.5} alignItems="center">
                                <ThuocSearchSelect
                                    value={item.thuoc}
                                    onChange={(thuoc) => updateItem(idx, "thuoc", thuoc)}
                                    sx={{ flex: 1 }}
                                />
                                <TextField
                                    label="Số lượng"
                                    type="number"
                                    size="small"
                                    value={item.soLuong}
                                    onChange={(e) =>
                                        updateItem(idx, "soLuong", Math.max(1, parseInt(e.target.value) || 1))
                                    }
                                    slotProps={{ htmlInput: { min: 1 } }}
                                    sx={{ width: 120 }}
                                />
                                <IconButton
                                    color="error"
                                    onClick={() => removeItem(idx)}
                                    disabled={items.length === 1}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Stack>
                        ))}

                        <Button startIcon={<AddIcon />} onClick={addItem} variant="outlined" sx={{ alignSelf: "flex-start" }}>
                            Thêm thuốc / VTYT
                        </Button>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5 }}>
                    <Button onClick={onClose} disabled={saving}>
                        Hủy
                    </Button>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        disabled={saving || !isValid()}
                    >
                        {saving ? "Đang tạo..." : "Tạo phiếu"}
                    </Button>
                </DialogActions>
            </Dialog>

            <FeedbackSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
            />
        </>
    );
}

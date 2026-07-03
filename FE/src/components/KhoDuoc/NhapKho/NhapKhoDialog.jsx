import { useEffect, useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import DialogTitleWrapper from "@/components/common/DialogTitleWrapper.jsx";
import FeedbackSnackbar from "@/components/common/FeedbackSnackbar.jsx";
import { khoDuocService } from "@/services/khoDuocService.js";

export default function NhapKhoDialog({ open, onClose, phieuId, onSaved }) {
    const [phieu, setPhieu] = useState(null);
    const [chiTiets, setChiTiets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

    useEffect(() => {
        if (!open || !phieuId) return;
        setLoading(true);
        setSaving(false);
        Promise.all([
            khoDuocService.getPhieuDuTru(phieuId),
            khoDuocService.listChiTietDuTru({ limit: 200 }),
        ])
            .then(([phieuRes, ctRes]) => {
                const phieuData = phieuRes.data;
                const allCts = Array.isArray(ctRes.data) ? ctRes.data : ctRes.data?.items || ctRes.data?.data || [];
                const filteredCts = allCts.filter((ct) => ct.ma_phieu_du_tru === phieuId);
                setPhieu(phieuData);
                setChiTiets(filteredCts);
            })
            .catch(() => {
                setSnackbar({ open: true, message: "Không thể tải thông tin phiếu.", severity: "error" });
            })
            .finally(() => setLoading(false));
    }, [open, phieuId]);

    const handleConfirm = async () => {
        setSaving(true);
        try {
            await khoDuocService.nhapKhoTuPhieuDuTru(phieuId);
            setSnackbar({ open: true, message: "Nhập kho thành công.", severity: "success" });
            onSaved?.();
            onClose();
        } catch (err) {
            setSnackbar({
                open: true,
                message: err.response?.data?.detail || "Nhập kho thất bại.",
                severity: "error",
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <Dialog open={open} onClose={saving ? undefined : onClose} fullWidth maxWidth="md">
                <DialogTitleWrapper>Xác nhận nhập kho</DialogTitleWrapper>
                <DialogContent>
                    {loading ? (
                        <Typography color="text.secondary" sx={{ py: 2, textAlign: "center" }}>
                            Đang tải...
                        </Typography>
                    ) : (
                        <Stack spacing={2} sx={{ pt: 1 }}>
                            {phieu && (
                                <Stack direction="row" spacing={4} flexWrap="wrap">
                                    <Typography variant="body2">
                                        <strong>Mã phiếu:</strong> {phieu.ma_phieu_du_tru}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Ngày lập:</strong> {phieu.ngay_lap_phieu || "—"}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Ghi chú:</strong> {phieu.ghi_chu || "—"}
                                    </Typography>
                                </Stack>
                            )}

                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 1 }}>
                                Danh sách thuốc / VTYT
                            </Typography>

                            <TableContainer>
                                <Table size="small" sx={{ minWidth: 500 }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 600 }}>Mã thuốc</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Tên thuốc</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }} align="right">Số lượng</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {chiTiets.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={3} align="center" sx={{ py: 3, color: "text.secondary" }}>
                                                    Không có chi tiết thuốc.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            chiTiets.map((ct, idx) => (
                                                <TableRow key={`${ct.ma_thuoc_vtyt}-${idx}`}>
                                                    <TableCell>{ct.ma_thuoc_vtyt}</TableCell>
                                                    <TableCell>—</TableCell>
                                                    <TableCell align="right">{ct.so_luong}</TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Stack>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5 }}>
                    <Button onClick={onClose} disabled={saving}>
                        Hủy
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        variant="contained"
                        disabled={saving || loading || chiTiets.length === 0}
                    >
                        {saving ? "Đang xử lý..." : "Xác nhận nhập kho"}
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

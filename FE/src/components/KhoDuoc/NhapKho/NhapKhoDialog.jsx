import { useEffect, useMemo, useState } from "react";
import {
    Box,
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
import { Person as PersonIcon, Print as PrintIcon } from "@mui/icons-material";
import dayjs from "dayjs";
import DialogTitleWrapper from "@/components/common/DialogTitleWrapper.jsx";
import FeedbackSnackbar from "@/components/common/FeedbackSnackbar.jsx";
import DatePicker from "@/components/common/DatePicker.jsx";
import NhapKhoPrint from "./NhapKhoPrint.jsx";
import { decodeJWT } from "@/services/api.js";
import { khoDuocService } from "@/services/khoDuocService.js";

export default function NhapKhoDialog({ open, onClose, phieuId, mode = "create", onSaved }) {
    const isView = mode === "view";
    const [chiTiets, setChiTiets] = useState([]);
    const [ngayNhap, setNgayNhap] = useState(dayjs());
    const [nguoiNhap, setNguoiNhap] = useState("");
    const [maPhieuNhap, setMaPhieuNhap] = useState("");
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

    const currentUser = useMemo(() => {
        const token = localStorage.getItem("datamed_access_token");
        return token ? decodeJWT(token) : null;
    }, []);

    useEffect(() => {
        if (!open || !phieuId) return;
        setLoading(true);
        setSaving(false);

        if (isView) {
            khoDuocService.getPhieuNhapByPhieuDuTru(phieuId)
                .then((res) => {
                    const data = res.data;
                    setMaPhieuNhap(data.ma_phieu_nhap || "");
                    setNguoiNhap(data.nguoi_nhap_ho_ten || "");
                    setNgayNhap(data.ngay_nhap ? dayjs(data.ngay_nhap) : dayjs());
                    const items = (data.chi_tiets || []).map((ct) => ({
                        ma_thuoc_vtyt: ct.ma_thuoc_vtyt,
                        ten_thuoc_vtyt: ct.ten_thuoc_vtyt || "",
                        don_vi_tinh: ct.don_vi_tinh || "",
                        soLuongNhap: ct.so_luong,
                    }));
                    setChiTiets(items);
                })
                .catch(() => {
                    setSnackbar({ open: true, message: "Không thể tải thông tin nhập kho.", severity: "error" });
                })
                .finally(() => setLoading(false));
        } else {
            setNgayNhap(dayjs());
            setNguoiNhap("");
            khoDuocService.getChiTietByPhieuDuTru(phieuId)
                .then((ctRes) => {
                    const ctData = Array.isArray(ctRes.data) ? ctRes.data : ctRes.data?.items || ctRes.data?.data || [];
                    setChiTiets(
                        ctData.map((ct) => ({
                            ma_thuoc_vtyt: ct.ma_thuoc_vtyt,
                            ten_thuoc_vtyt: ct.ten_thuoc_vtyt || "",
                            don_vi_tinh: ct.don_vi_tinh || "",
                            soLuongDuTru: ct.so_luong,
                            soLuongNhap: ct.so_luong,
                        }))
                    );
                })
                .catch(() => {
                    setSnackbar({ open: true, message: "Không thể tải thông tin phiếu.", severity: "error" });
                })
                .finally(() => setLoading(false));
        }
    }, [open, phieuId, isView]);

    const updateSoLuongNhap = (idx, val) => {
        const soLuong = Math.max(0, parseInt(val, 10) || 0);
        setChiTiets((prev) =>
            prev.map((item, i) => (i === idx ? { ...item, soLuongNhap: soLuong } : item))
        );
    };

    const handleConfirm = async () => {
        setSaving(true);
        try {
            const items = chiTiets
                .filter((item) => item.soLuongNhap > 0)
                .map((item) => ({
                    ma_thuoc_vtyt: item.ma_thuoc_vtyt,
                    so_luong: item.soLuongNhap,
                }));
            if (items.length === 0) {
                setSnackbar({ open: true, message: "Phải nhập ít nhất một thuốc.", severity: "warning" });
                setSaving(false);
                return;
            }
            await khoDuocService.nhapKhoTuPhieuDuTru(phieuId, {
                items,
                ngay_nhap: ngayNhap.format("YYYY-MM-DD"),
            });
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

    const printData = useMemo(() => {
        if (!isView) return null;
        return {
            maPhieuNhap,
            maPhieuDuTru: phieuId,
            ngayNhap,
            nguoiNhap,
            items: chiTiets.map((ct) => ({
                ten_thuoc_vtyt: ct.ten_thuoc_vtyt,
                don_vi_tinh: ct.don_vi_tinh,
                so_luong: ct.soLuongNhap,
            })),
        };
    }, [isView, maPhieuNhap, phieuId, ngayNhap, nguoiNhap, chiTiets]);

    const actionButtons = isView ? (
        <>
            <Button onClick={onClose}>Đóng</Button>
            <Button
                variant="contained"
                startIcon={<PrintIcon />}
                onClick={() => window.print()}
            >
                In phiếu
            </Button>
        </>
    ) : (
        <>
            <Button onClick={onClose} disabled={saving}>Hủy</Button>
            <Button
                onClick={handleConfirm}
                variant="contained"
                disabled={saving || loading || chiTiets.length === 0}
            >
                {saving ? "Đang xử lý..." : "Xác nhận nhập kho"}
            </Button>
        </>
    );

    return (
        <>
            <Dialog open={open} onClose={saving ? undefined : onClose} fullWidth maxWidth="md">
                <DialogTitleWrapper>{isView ? "Chi tiết nhập kho" : "Xác nhận nhập kho"}</DialogTitleWrapper>
                <DialogContent dividers sx={{ height: 500, overflow: "auto" }}>
                    {loading ? (
                        <Typography color="text.secondary" sx={{ py: 2, textAlign: "center" }}>
                            Đang tải...
                        </Typography>
                    ) : (
                        <Stack spacing={2} sx={{ pt: 1 }}>
                            <Stack direction="row" spacing={4} flexWrap="wrap" alignItems="center">
                                <Stack spacing={0.5}>
                                    <Typography variant="caption" color="text.secondary">
                                        Người nhập
                                    </Typography>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <PersonIcon fontSize="small" />
                                        <Typography variant="body2">
                                            {isView
                                                ? (nguoiNhap || "—")
                                                : (currentUser
                                                    ? `${currentUser.ho_ten} (${currentUser.role})`
                                                    : "—")}
                                        </Typography>
                                    </Stack>
                                </Stack>
                                <Stack spacing={0.5}>
                                    <Typography variant="caption" color="text.secondary">
                                        Ngày nhập
                                    </Typography>
                                    {isView ? (
                                        <Typography variant="body2">
                                            {ngayNhap.format("DD/MM/YYYY")}
                                        </Typography>
                                    ) : (
                                        <DatePicker value={ngayNhap} onChange={setNgayNhap} size="small" />
                                    )}
                                </Stack>
                            </Stack>

                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 1 }}>
                                Danh sách thuốc / VTYT
                            </Typography>

                            <TableContainer>
                                <Table size="small" sx={{ minWidth: 600 }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 600 }}>Mã thuốc</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Tên thuốc</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>ĐVT</TableCell>
                                            {!isView && <TableCell sx={{ fontWeight: 600 }} align="right">SL dự trù</TableCell>}
                                            <TableCell sx={{ fontWeight: 600 }} align="right">SL nhập</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {chiTiets.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={isView ? 4 : 5} align="center" sx={{ py: 3, color: "text.secondary" }}>
                                                    Không có chi tiết thuốc.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            chiTiets.map((ct, idx) => (
                                                <TableRow key={`${ct.ma_thuoc_vtyt}-${idx}`}>
                                                    <TableCell>{ct.ma_thuoc_vtyt}</TableCell>
                                                    <TableCell>{ct.ten_thuoc_vtyt}</TableCell>
                                                    <TableCell>{ct.don_vi_tinh}</TableCell>
                                                    {!isView && <TableCell align="right">{ct.soLuongDuTru}</TableCell>}
                                                    <TableCell align="right">
                                                        {isView ? (
                                                            <Typography variant="body2">{ct.soLuongNhap}</Typography>
                                                        ) : (
                                                            <TextField
                                                                type="number"
                                                                size="small"
                                                                value={ct.soLuongNhap}
                                                                onChange={(e) => updateSoLuongNhap(idx, e.target.value)}
                                                                slotProps={{
                                                                    htmlInput: {
                                                                        min: 0,
                                                                        sx: { textAlign: "right", width: 80 },
                                                                    },
                                                                }}
                                                            />
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            {isView && printData && (
                                <Box sx={{ mt: 3 }}>
                                    <NhapKhoPrint data={printData} />
                                </Box>
                            )}
                        </Stack>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2, pb: 2.5 }}>
                    {actionButtons}
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

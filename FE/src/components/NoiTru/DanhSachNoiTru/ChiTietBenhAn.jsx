import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Stack,
    Tab,
    Tabs,
    Typography,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { noiTruService } from "@/services/noiTruService.js";
import usePhieuChamSoc from "@/hooks/usePhieuChamSoc.jsx";
import PhieuChamSocList from "./PhieuChamSocList.jsx";
import PhieuChamSocForm from "./PhieuChamSocForm.jsx";
import FeedbackSnackbar from "@/components/common/FeedbackSnackbar.jsx";

function InfoItem({ label, value }) {
    return (
        <Box>
            <Box
                variant="caption"
                sx={{ fontSize: 12, color: "text.secondary" }}
            >
                {label}
            </Box>
            <Box variant="body1" sx={{ fontWeight: 500 }}>
                {value ?? "--"}
            </Box>
        </Box>
    );
}

function TinhTrangChip({ trangThai }) {
    const color = trangThai === "đang_điều_trị" ? "info" : "success";
    return (
        <Box
            sx={{
                display: "inline-block",
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                bgcolor: color === "info" ? "#DBEAFE" : "#D1FAE5",
                color: color === "info" ? "#0B3B60" : "#065F46",
                fontWeight: 600,
                fontSize: "0.8125rem",
            }}
        >
            {trangThai === "đang_điều_trị" ? "Đang điều trị" : "Đã ra viện"}
        </Box>
    );
}

export default function ChiTietBenhAn({ open, benhAnId, onClose }) {
    const [benhAn, setBenhAn] = useState(null);
    const [loading, setLoading] = useState(false);
    const [tabIndex, setTabIndex] = useState(0);

    const {
        records,
        snackbar,
        setSnackbar,
        openForm,
        editingRecord,
        handleOpenForm,
        handleCloseForm,
        handleSave,
    } = usePhieuChamSoc(open ? benhAnId : null);

    useEffect(() => {
        if (!open || !benhAnId) return;
        setLoading(true);
        noiTruService
            .getBenhAnChiTiet(benhAnId)
            .then((res) => setBenhAn(res.data || res))
            .catch(() => setBenhAn(null))
            .finally(() => setLoading(false));
    }, [open, benhAnId]);

    const aggregatedThuoc = useMemo(() => {
        const map = {};
        records.forEach((pcs) => {
            (pcs.chi_tiet || []).forEach((ct) => {
                const key = ct.ma_thuoc_vtyt;
                if (!map[key]) {
                    map[key] = {
                        ten_thuoc_vtyt: ct.ten_thuoc_vtyt || ct.ma_thuoc_vtyt,
                        don_vi_tinh: ct.don_vi_tinh || "",
                        so_luong: 0,
                    };
                }
                map[key].so_luong += ct.so_luong || 0;
            });
        });
        return Object.values(map);
    }, [records]);

    const headerFields = [
        { label: "Mã BA", value: benhAn?.ma_benh_an },
        { label: "Mã QN", value: benhAn?.ma_quan_nhan },
        {
            label: "Ngày nhập viện",
            value: benhAn?.ngay_nhap_vien
                ? new Date(benhAn.ngay_nhap_vien).toLocaleDateString("vi-VN")
                : "--",
        },
        {
            label: "Trạng thái",
            value: benhAn && <TinhTrangChip trangThai={benhAn.trang_thai} />,
        },
        { label: "Buồng", value: benhAn?.ten_buong },
        { label: "Giường", value: benhAn?.ten_giuong },
        { label: "Họ tên", value: benhAn?.ho_ten },
        { label: "Cấp bậc", value: benhAn?.cap_bac },
        { label: "Chức vụ", value: benhAn?.chuc_vu },
        { label: "Đơn vị", value: benhAn?.ten_don_vi },
        { label: "Số ĐT", value: benhAn?.so_dien_thoai },
        { label: "Mã BHYT", value: benhAn?.so_the_bhyt },
    ];

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="lg"
                fullWidth
                sx={{ "& .MuiDialog-paper": { height: "90vh" } }}
            >
                <DialogTitle>
                    <Typography
                        sx={{
                            fontSize: 20,
                            fontWeight: 700,
                            textAlign: "center",
                        }}
                    >
                        Chi tiết bệnh án
                    </Typography>
                </DialogTitle>
                <DialogContent dividers>
                    {loading ? (
                        <Typography
                            color="text.secondary"
                            sx={{ py: 4, textAlign: "center" }}
                        >
                            Đang tải...
                        </Typography>
                    ) : !benhAn ? (
                        <Typography
                            color="text.secondary"
                            sx={{ py: 4, textAlign: "center" }}
                        >
                            Không tìm thấy bệnh án.
                        </Typography>
                    ) : (
                        <Stack spacing={3}>
                            <Card
                                variant="outlined"
                                sx={{ borderRadius: 2, bgcolor: "#F8FAFC" }}
                            >
                                <CardContent>
                                    <Grid container spacing={2}>
                                        {headerFields.map((f, i) => (
                                            <Grid size={{ xs: 2 }} key={i}>
                                                <InfoItem
                                                    label={f.label}
                                                    value={f.value}
                                                />
                                            </Grid>
                                        ))}
                                    </Grid>
                                </CardContent>
                            </Card>

                            <Tabs
                                value={tabIndex}
                                onChange={(_, v) => setTabIndex(v)}
                            >
                                <Tab label="Tổng quan" />
                                <Tab label="Diễn biến" />
                                <Tab label="Thuốc" />
                            </Tabs>

                            {tabIndex === 0 && (
                                <Stack spacing={2}>
                                    <Card
                                        variant="outlined"
                                        sx={{ borderRadius: 2 }}
                                    >
                                        <CardContent>
                                            <Stack
                                                direction="row"
                                                spacing={2}
                                                sx={{
                                                    "& > *": {
                                                        flex: 1,
                                                        minWidth: 0,
                                                    },
                                                }}
                                            >
                                                <InfoItem
                                                    label="Ngoại kiều:"
                                                    value={benhAn.ngoai_kieu}
                                                />
                                                <InfoItem
                                                    label="Đối tượng:"
                                                    value={benhAn.doi_tuong}
                                                />
                                                <InfoItem
                                                    label="Ngày nhập viện:"
                                                    value={
                                                        benhAn.ngay_nhap_vien
                                                            ? new Date(
                                                                  benhAn.ngay_nhap_vien,
                                                              ).toLocaleDateString(
                                                                  "vi-VN",
                                                              )
                                                            : "--"
                                                    }
                                                />
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                    <Card
                                        variant="outlined"
                                        sx={{ borderRadius: 2 }}
                                    >
                                        <CardContent>
                                            <Stack spacing={1.5}>
                                                <InfoItem
                                                    label="Chẩn đoán:"
                                                    value={benhAn.chan_doan}
                                                />
                                                <InfoItem
                                                    label="Quản lý NB:"
                                                    value={
                                                        benhAn.quan_ly_nguoi_benh
                                                    }
                                                />
                                                <InfoItem
                                                    label="Chi tiết BA:"
                                                    value={
                                                        benhAn.chi_tiet_benh_an
                                                    }
                                                />
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Stack>
                            )}

                            {tabIndex === 1 && (
                                <Stack spacing={2}>
                                    <Button
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        onClick={() => handleOpenForm(null)}
                                        sx={{
                                            textTransform: "none",
                                            alignSelf: "flex-start",
                                        }}
                                    >
                                        Thêm phiếu chăm sóc
                                    </Button>
                                    <PhieuChamSocList
                                        records={records}
                                        onEdit={handleOpenForm}
                                    />
                                </Stack>
                            )}

                            {tabIndex === 2 && (
                                <Stack spacing={1}>
                                    {aggregatedThuoc.length === 0 ? (
                                        <Typography color="text.secondary">
                                            Chưa có thuốc nào.
                                        </Typography>
                                    ) : (
                                        <table
                                            style={{
                                                width: "100%",
                                                borderCollapse: "collapse",
                                            }}
                                        >
                                            <thead>
                                                <tr
                                                    style={{
                                                        background: "#F4F7F9",
                                                    }}
                                                >
                                                    <th
                                                        style={{
                                                            padding: 8,
                                                            textAlign: "left",
                                                        }}
                                                    >
                                                        STT
                                                    </th>
                                                    <th
                                                        style={{
                                                            padding: 8,
                                                            textAlign: "left",
                                                        }}
                                                    >
                                                        Tên thuốc
                                                    </th>
                                                    <th
                                                        style={{
                                                            padding: 8,
                                                            textAlign: "left",
                                                        }}
                                                    >
                                                        SL
                                                    </th>
                                                    <th
                                                        style={{
                                                            padding: 8,
                                                            textAlign: "left",
                                                        }}
                                                    >
                                                        ĐVT
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {aggregatedThuoc.map(
                                                    (item, idx) => (
                                                        <tr key={idx}>
                                                            <td
                                                                style={{
                                                                    padding: 8,
                                                                }}
                                                            >
                                                                {idx + 1}
                                                            </td>
                                                            <td
                                                                style={{
                                                                    padding: 8,
                                                                }}
                                                            >
                                                                {
                                                                    item.ten_thuoc_vtyt
                                                                }
                                                            </td>
                                                            <td
                                                                style={{
                                                                    padding: 8,
                                                                }}
                                                            >
                                                                {item.so_luong}
                                                            </td>
                                                            <td
                                                                style={{
                                                                    padding: 8,
                                                                }}
                                                            >
                                                                {item.don_vi_tinh ||
                                                                    "--"}
                                                            </td>
                                                        </tr>
                                                    ),
                                                )}
                                            </tbody>
                                        </table>
                                    )}
                                </Stack>
                            )}
                        </Stack>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button onClick={onClose} sx={{ textTransform: "none" }}>
                        Đóng
                    </Button>
                </DialogActions>
            </Dialog>

            <PhieuChamSocForm
                open={openForm}
                initialData={editingRecord}
                onSave={handleSave}
                onClose={handleCloseForm}
                defaultGiuong={benhAn?.ten_giuong}
                defaultBuong={benhAn?.ten_buong}
            />

            <FeedbackSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
            />
        </>
    );
}

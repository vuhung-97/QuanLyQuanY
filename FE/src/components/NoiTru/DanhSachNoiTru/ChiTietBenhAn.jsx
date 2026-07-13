import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    Grid,
    Stack,
    Tab,
    Tabs,
    Typography,
} from "@mui/material";
import DialogTitleWrapper from "@/components/common/DialogTitleWrapper";
import { noiTruService } from "@/services/noiTruService.js";
import usePhieuChamSoc from "@/hooks/usePhieuChamSoc.jsx";
import PhieuChamSocForm from "./PhieuChamSocForm.jsx";
import FeedbackSnackbar from "@/components/common/FeedbackSnackbar.jsx";
import LapBenhAnForm from "@/components/NoiTru/LapBenhAn/LapBenhAnForm.jsx";
import TongQuanTab from "./tabs/TongQuanTab.jsx";
import DienBienTab from "./tabs/DienBienTab.jsx";
import ThuocTab from "./tabs/ThuocTab.jsx";
import InfoItem from "@/components/NoiTru/common/InfoItem.jsx";
import TinhTrangChip from "@/components/NoiTru/common/TinhTrangChip.jsx";
import { formatDate } from "@/utils/date.js";

export default function ChiTietBenhAn({ open, benhAnId, onClose, onSaved, readOnly: forceReadOnly = false }) {
    const [benhAn, setBenhAn] = useState(null);
    const [loading, setLoading] = useState(false);
    const [tabIndex, setTabIndex] = useState(0);
    const [openEditForm, setOpenEditForm] = useState(false);
    const [savingEdit, setSavingEdit] = useState(false);
    const readOnly = forceReadOnly || benhAn?.trang_thai === "đã_ra_viện";

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

    const handleOpenEdit = useCallback(() => {
        setOpenEditForm(true);
    }, []);

    const handleCloseEdit = useCallback(() => {
        setOpenEditForm(false);
    }, []);

    const handleSaveEdit = useCallback(
        async (data) => {
            if (!benhAn?.ma_benh_an) return;
            setSavingEdit(true);
            try {
                await noiTruService.updateBenhAn(benhAn.ma_benh_an, data);
                const res = await noiTruService.getBenhAnChiTiet(benhAnId);
                setBenhAn(res.data || res);
                setOpenEditForm(false);
                setSnackbar({
                    open: true,
                    message: "Cập nhật bệnh án thành công",
                    severity: "success",
                });
                onSaved?.();
            } catch {
                setSnackbar({
                    open: true,
                    message: "Cập nhật bệnh án thất bại",
                    severity: "error",
                });
            } finally {
                setSavingEdit(false);
            }
        },
        [benhAn, benhAnId, onSaved],
    );

    const headerFields = [
        { label: "Mã BA", value: benhAn?.ma_benh_an },
        { label: "Mã QN", value: benhAn?.ma_quan_nhan },
        { label: "Ngày nhập viện", value: formatDate(benhAn?.ngay_nhap_vien) },
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
                <DialogTitleWrapper>Chi tiết bệnh án</DialogTitleWrapper>
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
                                <TongQuanTab
                                    benhAn={benhAn}
                                    onEdit={readOnly ? null : handleOpenEdit}
                                />
                            )}
                            {tabIndex === 1 && (
                                <DienBienTab
                                    records={records}
                                    readOnly={readOnly}
                                    onAddNew={() => handleOpenForm(null)}
                                    onEdit={handleOpenForm}
                                />
                            )}
                            {tabIndex === 2 && (
                                <ThuocTab aggregatedThuoc={aggregatedThuoc} />
                            )}
                        </Stack>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 1 }}>
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
                readOnly={readOnly}
            />

            {benhAn && (
                <LapBenhAnForm
                    open={openEditForm}
                    benhAn={benhAn}
                    saving={savingEdit}
                    onSave={handleSaveEdit}
                    onClose={handleCloseEdit}
                />
            )}

            <FeedbackSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
            />
        </>
    );
}

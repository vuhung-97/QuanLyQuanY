import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { Person as PersonIcon, Print as PrintIcon } from "@mui/icons-material";
import DialogTitleWrapper from "@/components/common/DialogTitleWrapper.jsx";
import FeedbackSnackbar from "@/components/common/FeedbackSnackbar.jsx";
import PhieuDuTruPrint from "./PhieuDuTruPrint.jsx";
import ChiTietDuTruTable from "./ChiTietDuTruTable.jsx";
import DatePicker from "@/components/common/DatePicker.jsx";
import usePhieuDuTru from "@/hooks/usePhieuDuTru.js";

export default function PhieuDuTruDialog({
    open,
    onClose,
    onSaved,
    phieuId = null,
    mode = "create",
}) {
    const {
        ghiChu,
        setGhiChu,
        keys,
        getItem,
        saving,
        loadingData,
        snackbar,
        setSnackbar,
        openKhoThuoc,
        savedPhieu,
        currentUser,
        isView,
        ngayLap,
        setNgayLap,
        creatorName,
        setOpenKhoThuoc,
        addItem,
        removeItem,
        updateItem,
        handleAddFromKhoThuoc,
        handleSave,
        handleClose,
    } = usePhieuDuTru({ open, phieuId, mode, onClose, onSaved });

    const titleMap = {
        create: "Tạo phiếu dự trù",
        edit: "Sửa phiếu dự trù",
        view: "Chi tiết phiếu dự trù",
    };

    const formContent = (
        <>
            <Box
                sx={{
                    mb: 2,
                    p: 2,
                    bgcolor: "grey.50",
                    borderRadius: 1,
                    "@media print": { display: "none" },
                }}
            >
                <Stack
                    direction="row"
                    spacing={4}
                    sx={{ flexWrap: "wrap", alignItems: "center" }}
                >
                    <Stack spacing={0.5}>
                        <Typography variant="caption" color="text.secondary">
                            Người lập
                        </Typography>
                        <Stack
                            direction="row"
                            spacing={1}
                            sx={{ alignItems: "center" }}
                        >
                            <PersonIcon fontSize="small" />
                            <Typography variant="body2">
                                {isView
                                    ? creatorName || "—"
                                    : currentUser
                                      ? `${currentUser.ho_ten} (${currentUser.role})`
                                      : "—"}
                            </Typography>
                        </Stack>
                    </Stack>
                    <Stack spacing={0.5}>
                        <Typography variant="caption" color="text.secondary">
                            Ngày lập
                        </Typography>
                        <DatePicker
                            value={ngayLap}
                            onChange={setNgayLap}
                            size="small"
                        />
                    </Stack>
                </Stack>
            </Box>

            <TextField
                label="Ghi chú"
                value={ghiChu}
                onChange={(e) => setGhiChu(e.target.value)}
                multiline
                rows={2}
                fullWidth
                disabled={isView}
                sx={{ "@media print": { display: "none" } }}
            />

            <ChiTietDuTruTable
                keys={keys}
                getItem={getItem}
                onUpdateItem={updateItem}
                onRemoveItem={removeItem}
                onAddItem={addItem}
                onAddFromKhoThuoc={handleAddFromKhoThuoc}
                openKhoThuoc={openKhoThuoc}
                onOpenKhoThuoc={() => setOpenKhoThuoc(true)}
                onCloseKhoThuoc={() => setOpenKhoThuoc(false)}
                isView={isView}
            />
        </>
    );

    return (
        <>
            <style>{`
                @media print {
                    #root { display: none !important; }
                    .MuiBackdrop-root { display: none !important; }
                    .MuiModal-root { display: contents !important; }
                    .MuiDialog-container { display: contents !important; }
                    .MuiDialog-paper { display: contents !important; }
                    .MuiDialogContent-root { display: contents !important; }
                }
            `}</style>
            <Dialog
                open={open}
                onClose={saving ? undefined : handleClose}
                fullWidth
                maxWidth="md"
            >
                <DialogTitleWrapper
                    sx={{ "@media print": { display: "none" } }}
                >
                    {titleMap[mode] || "Phiếu dự trù"}
                </DialogTitleWrapper>

                <DialogContent
                    dividers
                    sx={{
                        height: 500,
                        overflow: "auto",
                        "@media print": {
                            border: "none !important",
                            p: "0 !important",
                            height: "auto !important",
                            overflow: "visible !important",
                        },
                    }}
                >
                    {loadingData ? (
                        <Typography sx={{ textAlign: "center", py: 4 }}>
                            Đang tải...
                        </Typography>
                    ) : (
                        <>
                            <Box sx={{ "@media print": { display: "none !important" } }}>
                                {formContent}
                            </Box>
                            {isView && savedPhieu && (
                                <Box sx={{ mt: 3, "@media print": { display: "contents !important" } }}>
                                    <PhieuDuTruPrint data={savedPhieu} />
                                </Box>
                            )}
                        </>
                    )}
                </DialogContent>

                {!loadingData && (
                    <Box sx={{ "@media print": { display: "none" } }}>
                        <DialogActions sx={{ p: 2 }}>
                            {isView ? (
                                <>
                                    <Button onClick={handleClose}>Đóng</Button>
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
                                    <Button
                                        onClick={handleClose}
                                        disabled={saving}
                                    >
                                        Hủy
                                    </Button>
                                    <Button
                                        onClick={handleSave}
                                        variant="contained"
                                        disabled={saving}
                                    >
                                        {saving
                                            ? "Đang xử lý..."
                                            : mode === "edit"
                                              ? "Cập nhật"
                                              : "Tạo phiếu"}
                                    </Button>
                                </>
                            )}
                        </DialogActions>
                    </Box>
                )}
            </Dialog>

            <FeedbackSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={() =>
                    setSnackbar((prev) => ({ ...prev, open: false }))
                }
            />
        </>
    );
}

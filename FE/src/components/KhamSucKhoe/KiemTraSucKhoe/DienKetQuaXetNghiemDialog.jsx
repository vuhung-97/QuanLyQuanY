import { useRef, useState } from "react";
import {
    Alert,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import {
    UploadFile as UploadFileIcon,
    CloudUpload as CloudUploadIcon,
    CheckCircle as CheckCircleIcon,
    FindReplace as FindReplaceIcon,
    PendingActions as PendingIcon,
} from "@mui/icons-material";
import DialogTitleWrapper from "@/components/common/DialogTitleWrapper";
import FeedbackSnackbar from "@/components/common/FeedbackSnackbar";

export default function DienKetQuaXetNghiemDialog({
    open,
    onClose,
    maLichKham,
    onTrichXuat,
    onEditXetNghiem,
}) {
    const fileInputRef = useRef(null);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const showSnackbar = (message, severity = "success") =>
        setSnackbar({ open: true, message, severity });

    const handleCloseSnackbar = () =>
        setSnackbar((s) => ({ ...s, open: false }));

    const reset = () => {
        setFile(null);
        setUploading(false);
        setResult(null);
        handleCloseSnackbar();
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleChooseFile = (e) => {
        const f = e.target.files?.[0];
        setFile(f || null);
        setResult(null);
        handleCloseSnackbar();
    };

    const handleTrichXuat = async () => {
        if (!file) return;
        setUploading(true);
        try {
            const res = await onTrichXuat(file);
            setResult(res.data);
            const { so_phieu_da_cap_nhat, so_mau_trich_xuat } = res.data;
            showSnackbar(
                `Đã điền kết quả cho ${so_phieu_da_cap_nhat} / ${so_mau_trich_xuat} mẫu.`,
                "success",
            );
        } catch (err) {
            showSnackbar(
                err?.response?.data?.detail ||
                    err?.message ||
                    "Không thể trích xuất kết quả xét nghiệm.",
                "error",
            );
        } finally {
            setUploading(false);
        }
    };

    const {
        da_cap_nhat = [],
        khong_khop = [],
        chua_lay_mau = [],
    } = result || {};

    return (
        <>
            <Dialog
                open={open}
                onClose={uploading ? undefined : handleClose}
                fullWidth
                maxWidth="md"
            >
                <DialogTitleWrapper wrap={false}>
                    Điền kết quả xét nghiệm nhanh — {maLichKham}
                </DialogTitleWrapper>
                <DialogContent
                    dividers
                    sx={{ height: "60vh", overflowY: "auto" }}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="application/pdf,.pdf"
                        style={{ display: "none" }}
                        onChange={handleChooseFile}
                    />
                    <Stack spacing={2.5}>
                        <Paper
                            variant="outlined"
                            onClick={() => fileInputRef.current?.click()}
                            sx={{
                                border: "2px dashed",
                                borderColor: "primary.light",
                                borderRadius: 3,
                                p: 3,
                                textAlign: "center",
                                cursor: "pointer",
                                bgcolor: "background.default",
                                transition:
                                    "border-color .2s ease, background-color .2s ease",
                                "&:hover": {
                                    borderColor: "primary.main",
                                    bgcolor: "action.hover",
                                },
                            }}
                        >
                            {file ? (
                                <>
                                    <CheckCircleIcon
                                        color="success"
                                        sx={{ fontSize: 42, mb: 1 }}
                                    />
                                    <Typography
                                        variant="subtitle1"
                                        fontWeight={600}
                                        noWrap
                                    >
                                        {file.name}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Đã chọn file. Nhấn để chọn file khác.
                                    </Typography>
                                </>
                            ) : (
                                <>
                                    <CloudUploadIcon
                                        color="primary"
                                        sx={{ fontSize: 46, mb: 1 }}
                                    />
                                    <Typography
                                        variant="subtitle1"
                                        fontWeight={600}
                                    >
                                        Chọn file PDF kết quả xét nghiệm
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Hỗ trợ file máu / nước tiểu từ máy xét
                                        nghiệm.
                                    </Typography>
                                </>
                            )}
                        </Paper>

                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={1}
                            justifyContent="flex-end"
                        >
                            <Button
                                variant="outlined"
                                startIcon={<UploadFileIcon />}
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                sx={{ whiteSpace: "nowrap" }}
                            >
                                Chọn lại
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={
                                    uploading ? (
                                        <CircularProgress
                                            size={18}
                                            color="inherit"
                                        />
                                    ) : (
                                        <CloudUploadIcon />
                                    )
                                }
                                onClick={handleTrichXuat}
                                disabled={!file || uploading}
                                sx={{ whiteSpace: "nowrap" }}
                            >
                                {uploading
                                    ? "Đang trích xuất..."
                                    : "Trích xuất"}
                            </Button>
                        </Stack>

                        {result && (
                            <Stack spacing={2}>
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    flexWrap="wrap"
                                    useFlexGap
                                >
                                    <Chip
                                        icon={<CheckCircleIcon />}
                                        label={`${da_cap_nhat.length} mẫu đã cập nhật`}
                                        color="success"
                                        variant="outlined"
                                        size="medium"
                                    />
                                    {khong_khop.length > 0 && (
                                        <Chip
                                            icon={<FindReplaceIcon />}
                                            label={`${khong_khop.length} mã không khớp`}
                                            color="warning"
                                            variant="outlined"
                                            size="medium"
                                        />
                                    )}
                                    {chua_lay_mau.length > 0 && (
                                        <Chip
                                            icon={<PendingIcon />}
                                            label={`${chua_lay_mau.length} mẫu chưa lấy máu`}
                                            color="info"
                                            variant="outlined"
                                            size="medium"
                                        />
                                    )}
                                </Stack>

                                {da_cap_nhat.length > 0 && (
                                    <TableContainer
                                        component={Paper}
                                        variant="outlined"
                                        sx={{ borderRadius: 2 }}
                                    >
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Mã QN</TableCell>
                                                    <TableCell>
                                                        Mã lấy máu
                                                    </TableCell>
                                                    <TableCell>
                                                        Họ tên
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        Số chỉ số
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {da_cap_nhat.map((item) => (
                                                    <TableRow
                                                        key={item.ma_lay_mau}
                                                        hover
                                                        onClick={() =>
                                                            onEditXetNghiem?.(
                                                                item,
                                                            )
                                                        }
                                                        sx={{
                                                            cursor: "pointer",
                                                        }}
                                                    >
                                                        <TableCell>
                                                            {item.ma_quan_nhan}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Chip
                                                                label={
                                                                    item.ma_lay_mau
                                                                }
                                                                color="primary"
                                                                size="small"
                                                                sx={{
                                                                    fontWeight: 700,
                                                                }}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            {item.ho_ten ||
                                                                "--"}
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            {item.so_chi_so}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}

                                {khong_khop.length > 0 && (
                                    <Alert severity="warning">
                                        Mã mẫu không khớp với phiếu:{" "}
                                        {khong_khop.join(", ")}
                                    </Alert>
                                )}

                                {chua_lay_mau.length > 0 && (
                                    <Alert severity="info">
                                        Mẫu chưa đủ điều kiện (chưa lấy máu):{" "}
                                        {chua_lay_mau.join(", ")}
                                    </Alert>
                                )}
                            </Stack>
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleClose} disabled={uploading}>
                        Đóng
                    </Button>
                </DialogActions>
            </Dialog>

            <FeedbackSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={handleCloseSnackbar}
            />
        </>
    );
}

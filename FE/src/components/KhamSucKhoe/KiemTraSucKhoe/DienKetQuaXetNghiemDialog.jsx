import { useRef, useState } from "react";
import {
    Alert,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import {
    UploadFile as UploadFileIcon,
    CloudUpload as CloudUploadIcon,
    CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import DialogTitleWrapper from "@/components/common/DialogTitleWrapper";

export default function DienKetQuaXetNghiemDialog({
    open,
    onClose,
    maLichKham,
    onTrichXuat,
}) {
    const fileInputRef = useRef(null);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const reset = () => {
        setFile(null);
        setUploading(false);
        setResult(null);
        setError("");
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
        setError("");
    };

    const handleTrichXuat = async () => {
        if (!file) return;
        setUploading(true);
        setError("");
        try {
            const res = await onTrichXuat(file);
            setResult(res.data);
        } catch (err) {
            setError(
                err?.response?.data?.detail ||
                    err?.message ||
                    "Không thể trích xuất kết quả xét nghiệm.",
            );
        } finally {
            setUploading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={uploading ? undefined : handleClose}
            fullWidth
            maxWidth="md"
        >
            <DialogTitleWrapper wrap={false}>
                Điền kết quả xét nghiệm nhanh — {maLichKham}
            </DialogTitleWrapper>
            <DialogContent dividers>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf,.pdf"
                    style={{ display: "none" }}
                    onChange={handleChooseFile}
                />
                <Stack spacing={2}>
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1}
                        alignItems={{ sm: "center" }}
                    >
                        <Button
                            variant="outlined"
                            startIcon={<UploadFileIcon />}
                            onClick={() => fileInputRef.current?.click()}
                            sx={{ whiteSpace: "nowrap" }}
                        >
                            Chọn file PDF
                        </Button>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            noWrap
                            sx={{ flex: 1, minWidth: 0 }}
                        >
                            {file ? file.name : "Chưa chọn file."}
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={
                                uploading ? (
                                    <CircularProgress size={18} color="inherit" />
                                ) : (
                                    <CloudUploadIcon />
                                )
                            }
                            onClick={handleTrichXuat}
                            disabled={!file || uploading}
                            sx={{ whiteSpace: "nowrap" }}
                        >
                            Trích xuất
                        </Button>
                    </Stack>

                    {error && <Alert severity="error">{error}</Alert>}

                    {result && (
                        <>
                            <Alert
                                severity="success"
                                icon={<CheckCircleIcon />}
                            >
                                Đã điền kết quả cho{" "}
                                {result.so_phieu_da_cap_nhat} /{" "}
                                {result.so_mau_trich_xuat} mẫu.
                            </Alert>

                            {result.da_cap_nhat.length > 0 && (
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Mã QN</TableCell>
                                            <TableCell>Mã lấy máu</TableCell>
                                            <TableCell>Họ tên</TableCell>
                                            <TableCell align="right">
                                                Số chỉ số
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {result.da_cap_nhat.map((item) => (
                                            <TableRow key={item.ma_lay_mau}>
                                                <TableCell>
                                                    {item.ma_quan_nhan}
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={item.ma_lay_mau}
                                                        color="primary"
                                                        size="small"
                                                        sx={{
                                                            fontWeight: 700,
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {item.ho_ten || "--"}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {item.so_chi_so}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}

                            {result.khong_khop.length > 0 && (
                                <Alert severity="warning">
                                    Mã mẫu không khớp với phiếu:{" "}
                                    {result.khong_khop.join(", ")}
                                </Alert>
                            )}

                            {result.chua_lay_mau.length > 0 && (
                                <Alert severity="info">
                                    Mẫu chưa đủ điều kiện (chưa lấy máu):{" "}
                                    {result.chua_lay_mau.join(", ")}
                                </Alert>
                            )}
                        </>
                    )}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={uploading}>
                    Đóng
                </Button>
            </DialogActions>
        </Dialog>
    );
}

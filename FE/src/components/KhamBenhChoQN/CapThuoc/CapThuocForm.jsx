import { useMemo } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";

const THOI_DIEM_LABEL = {
    sau_an: "Sau ăn",
    truoc_an: "Trước ăn",
    truoc_khi_ngu: "Trước khi ngủ",
    sau_khi_thuc_day: "Sau khi thức dậy",
    khong: "Không",
};

const CACH_DUNG_LABEL = {
    uong: "Uống",
    boi: "Bôi",
    tiem: "Tiêm",
    xong: "Xông",
    ngam: "Ngậm",
    nhot: "Nhỏ mắt",
    khac: "Khác",
};

export default function CapThuocForm({
    open,
    selectedExam,
    examDetail,
    loading,
    onClose,
    onDispense,
    dispensing,
}) {
    const prescriptionRows = useMemo(() => {
        if (!examDetail?.don_thuoc) return [];
        const rows = [];
        for (const dt of examDetail.don_thuoc) {
            for (const ct of dt.chi_tiet_don_thuoc || []) {
                const hdt = ct.huong_dieu_tri || "";
                const parts = hdt.split(" | ");
                const lieu = parts[0] || "";
                const thoiDiem = parts[1] || "";
                const cachDung = parts[2] || "";
                const ghiChu = parts.slice(3).join(" | ");
                rows.push({
                    ten_thuoc: ct.ten_thuoc_vtyt || ct.ma_thuoc_vtyt,
                    so_luong: ct.so_luong,
                    don_vi_tinh: ct.don_vi_tinh || "",
                    lieu,
                    thoi_diem: thoiDiem,
                    cach_dung: cachDung,
                    ghi_chu: ghiChu,
                });
            }
        }
        return rows;
    }, [examDetail]);

    const isDaNhanThuoc = selectedExam?.trang_thai === "đã_nhận_thuốc";

    const handlePrint = () => {
        window.print();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            slotProps={{
                paper: { sx: { "@media print": { boxShadow: "none" } } },
            }}
        >
            <Box sx={{ "@media print": { display: "none" } }}>
                <DialogTitle>
                    <Typography variant="h2">
                        {isDaNhanThuoc ? "Đơn thuốc đã cấp" : "Cấp thuốc"}
                    </Typography>
                </DialogTitle>
            </Box>

            <DialogContent>
                {loading ? (
                    <Typography
                        color="text.secondary"
                        sx={{ py: 4, textAlign: "center" }}
                    >
                        Đang tải...
                    </Typography>
                ) : !selectedExam ? (
                    <Typography
                        color="text.secondary"
                        sx={{ py: 4, textAlign: "center" }}
                    >
                        Không tìm thấy thông tin.
                    </Typography>
                ) : (
                    <Stack spacing={2.5} sx={{ py: 1 }}>
                        <Box
                            sx={{
                                "@media print": {
                                    "& > *": { fontSize: "14pt !important" },
                                },
                            }}
                        >
                            <Typography
                                variant="h3"
                                sx={{
                                    mb: 1.5,
                                    fontWeight: 700,
                                    color: "primary.main",
                                }}
                            >
                                Thông tin quân nhân
                            </Typography>
                            <Stack spacing={0.5}>
                                <Typography variant="body1">
                                    <strong>Họ tên:</strong>{" "}
                                    {selectedExam.ho_ten || "--"}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Đơn vị:</strong>{" "}
                                    {selectedExam.ten_don_vi || "--"}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Mã KB:</strong>{" "}
                                    {selectedExam.ma_kham_benh || "--"}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Ngày khám:</strong>{" "}
                                    {selectedExam.ngay_kham
                                        ? new Date(
                                              selectedExam.ngay_kham,
                                          ).toLocaleDateString("vi-VN")
                                        : "--"}
                                </Typography>
                            </Stack>
                        </Box>

                        {examDetail?.chan_doan && (
                            <Box>
                                <Typography
                                    variant="h3"
                                    sx={{
                                        mb: 0.5,
                                        fontWeight: 700,
                                        color: "primary.main",
                                    }}
                                >
                                    Chẩn đoán
                                </Typography>
                                <Typography variant="body1">
                                    {examDetail.chan_doan}
                                </Typography>
                            </Box>
                        )}

                        <Box>
                            <Typography
                                variant="h3"
                                sx={{
                                    mb: 1,
                                    fontWeight: 700,
                                    color: "primary.main",
                                }}
                            >
                                Đơn thuốc
                            </Typography>
                            {prescriptionRows.length === 0 ? (
                                <Typography color="text.secondary">
                                    Không có thuốc trong đơn.
                                </Typography>
                            ) : (
                                <Table
                                    size="small"
                                    sx={{
                                        border: "1px solid",
                                        borderColor: "divider",
                                    }}
                                >
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: "#F4F7F9" }}>
                                            <TableCell sx={{ width: 40 }}>
                                                STT
                                            </TableCell>
                                            <TableCell>
                                                Tên thuốc
                                            </TableCell>
                                            <TableCell sx={{ width: 80 }}>
                                                Số lượng
                                            </TableCell>
                                            <TableCell sx={{ width: 80 }}>
                                                ĐVT
                                            </TableCell>
                                            <TableCell>
                                                Hướng dẫn sử dụng
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {prescriptionRows.map((row, i) => (
                                            <TableRow key={i}>
                                                <TableCell>{i + 1}</TableCell>
                                                <TableCell
                                                    sx={{ fontWeight: 600 }}
                                                >
                                                    {row.ten_thuoc}
                                                </TableCell>
                                                <TableCell>
                                                    {row.so_luong}
                                                </TableCell>
                                                <TableCell>
                                                    {row.don_vi_tinh}
                                                </TableCell>
                                                <TableCell>
                                                    <Stack spacing={0.5}>
                                                        {row.lieu && (
                                                            <Typography variant="body2">
                                                                <strong>Liều:</strong> {row.lieu}
                                                            </Typography>
                                                        )}
                                                        <Typography variant="body2">
                                                            <strong>Cách dùng:</strong> {row.cach_dung || "Uống"}
                                                            {" | "}
                                                            <strong>Thời điểm:</strong> {row.thoi_diem || "Sau ăn"}
                                                        </Typography>
                                                        {row.ghi_chu && (
                                                            <Typography variant="body2">
                                                                <strong>Ghi chú:</strong> {row.ghi_chu}
                                                            </Typography>
                                                        )}
                                                    </Stack>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </Box>
                    </Stack>
                )}
            </DialogContent>

            <Box sx={{ "@media print": { display: "none" } }}>
                <DialogActions>
                    <Button onClick={onClose}>Hủy</Button>
                    <Button
                        variant="outlined"
                        onClick={handlePrint}
                        disabled={!selectedExam}
                    >
                        In đơn thuốc
                    </Button>
                    {!isDaNhanThuoc && (
                        <Button
                            variant="contained"
                            color="success"
                            onClick={onDispense}
                            disabled={dispensing || !selectedExam}
                            sx={{ textTransform: "none" }}
                        >
                            {dispensing
                                ? "Đang xử lý..."
                                : "Xác nhận cấp thuốc"}
                        </Button>
                    )}
                </DialogActions>
            </Box>
        </Dialog>
    );
}

import { useMemo } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    Typography,
} from "@mui/material";
import DonThuocTable from "@/components/common/DonThuoc.jsx";

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
                <DialogTitle sx={{ pb: 0 }}>
                    <Typography
                        sx={{
                            fontSize: 22,
                            fontWeight: 600,
                            textAlign: "center",
                        }}
                    >
                        {isDaNhanThuoc ? "Đơn thuốc đã cấp" : "Cấp thuốc"}
                    </Typography>
                </DialogTitle>
            </Box>

            <DialogContent sx={{ pt: 0 }}>
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
                                    color: "text.primary",
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
                                        color: "text.primary",
                                    }}
                                >
                                    Chẩn đoán
                                </Typography>
                                <Typography variant="body1">
                                    {examDetail.chan_doan}
                                </Typography>
                            </Box>
                        )}

                        {examDetail?.phuong_phap_dieu_tri && (
                            <Box>
                                <Typography
                                    variant="h3"
                                    sx={{
                                        mb: 0.5,
                                        fontWeight: 700,
                                        color: "text.primary",
                                    }}
                                >
                                    Phương pháp điều trị
                                </Typography>
                                <Typography variant="body1">
                                    {examDetail.phuong_phap_dieu_tri}
                                </Typography>
                            </Box>
                        )}

                        <DonThuocTable
                            rows={prescriptionRows}
                            heading="Đơn thuốc"
                            emptyMessage="Không có thuốc trong đơn."
                        />
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

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
import { STATUS_MAP } from "@/constants/khamBenhConstants.js";
import { parseDonThuocToRows } from "@/utils/khamBenhUtils.js";
import { formatDate } from "@/utils/date.js";

export default function CapThuocForm({
    open,
    selectedExam,
    examDetail,
    loading,
    onClose,
    onDispense,
    dispensing,
}) {
    const prescriptionRows = parseDonThuocToRows(examDetail);

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
                                    {formatDate(selectedExam.ngay_kham) || "--"}
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

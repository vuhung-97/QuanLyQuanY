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
            <DialogTitle
                sx={{ pb: 0, mb: 2, "@media print": { display: "none" } }}
            >
                <Typography
                    sx={{
                        fontSize: 20,
                        fontWeight: 600,
                        textAlign: "center",
                    }}
                >
                    {isDaNhanThuoc ? "Đơn thuốc đã cấp" : "Cấp thuốc"}
                </Typography>
            </DialogTitle>

            <DialogContent dividers sx={{ pt: 0 }}>
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
                        {/* === THÊM: Print header === */}
                        <Box
                            sx={{
                                display: "none",
                                "@media print": {
                                    "& > *": { fontSize: "14pt" },
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    mb: 2,
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 0.5,
                                    alignItems: "center",
                                }}
                            >
                                <Typography
                                    sx={{
                                        textTransform: "uppercase",
                                    }}
                                >
                                    LỮ ĐOÀN 170
                                </Typography>
                                <Typography
                                    sx={{
                                        textTransform: "uppercase",
                                        fontWeight: 600,
                                    }}
                                >
                                    PHÒNG HC-KT
                                </Typography>
                            </Box>
                        </Box>
                        <Typography
                            sx={{
                                display: "none",
                                "@media print": {
                                    display: "block",
                                    textAlign: "center",
                                    textTransform: "uppercase",
                                    fontSize: "16pt !important",
                                    fontWeight: 600,
                                    mb: 1.5,
                                },
                            }}
                        >
                            ĐƠN THUỐC
                        </Typography>
                        <Box sx={{ height: 14 }} />
                        <Box
                            sx={{
                                "@media print": {
                                    "& > *": { fontSize: "14pt !important" },
                                },
                            }}
                        >
                            <Typography
                                variant="h4"
                                sx={{
                                    mb: 1.5,
                                    fontWeight: 600,
                                    color: "text.primary",
                                }}
                            >
                                Thông tin quân nhân
                            </Typography>
                            <Stack spacing={0.5}>
                                <Typography variant="body1">
                                    <strong>- Họ tên:</strong>{" "}
                                    {selectedExam.ho_ten || "--"}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>- Đơn vị:</strong>{" "}
                                    {selectedExam.ten_don_vi || "--"}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>- Mã KB:</strong>{" "}
                                    {selectedExam.ma_kham_benh || "--"}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>- Ngày khám:</strong>{" "}
                                    {formatDate(selectedExam.ngay_kham) || "--"}
                                </Typography>
                            </Stack>
                        </Box>

                        {examDetail?.chan_doan && (
                            <Box>
                                <Typography
                                    variant="h4"
                                    sx={{
                                        mb: 0.5,
                                        fontWeight: 600,
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
                                    variant="h4"
                                    sx={{
                                        mb: 0.5,
                                        fontWeight: 600,
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

                        {isDaNhanThuoc &&
                            examDetail?.don_thuoc?.[0]?.ten_nguoi_cap_thuoc && (
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "flex-end",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 0.5,
                                            alignItems: "center",
                                        }}
                                    >
                                        <Typography
                                            variant="h4"
                                            sx={{
                                                mb: 0.5,
                                                fontWeight: 600,
                                                color: "text.primary",
                                            }}
                                        >
                                            Người cấp thuốc
                                        </Typography>
                                        <Typography variant="body1">
                                            {
                                                examDetail.don_thuoc[0]
                                                    .ten_nguoi_cap_thuoc
                                            }{" "}
                                            (
                                            {examDetail.don_thuoc[0]
                                                .vai_tro_nguoi_cap_thuoc || "?"}
                                            )
                                        </Typography>
                                    </Box>
                                </Box>
                            )}
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

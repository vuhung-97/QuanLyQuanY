import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Stack,
    Typography,
} from "@mui/material";
import DialogTitleWrapper from "@/components/common/DialogTitleWrapper";
import PatientInfoCard from "@/components/common/PatientInfoCard.jsx";
import DonThuocTable from "@/components/common/DonThuoc.jsx";
import { parseDonThuocToRows } from "@/utils/khamBenhUtils.js";
import DonThuocPrint from "./DonThuocPrint.jsx";
import { PRINT_STYLES, PRINT_DIALOG_CONTENT_SX, triggerPrint } from "@/utils/printUtils.js";
import { PATIENT_FIELDS_CAP_THUOC } from "@/components/KhamBenhChoQN/constants.js";

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

    return (
        <>
            <style>{PRINT_STYLES}</style>
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitleWrapper sx={{ "@media print": { display: "none" } }}>
                {isDaNhanThuoc ? "Đơn thuốc đã cấp" : "Cấp thuốc"}
            </DialogTitleWrapper>

            <DialogContent
                dividers
                sx={{
                    pt: 0,
                    ...PRINT_DIALOG_CONTENT_SX,
                }}
            >
                {selectedExam && (
                    <DonThuocPrint
                        data={{
                            hoTenQN: selectedExam.ho_ten,
                            capBac: selectedExam.cap_bac,
                            chucVu: selectedExam.chuc_vu,
                            tenDonVi: selectedExam.ten_don_vi,
                            maKB: selectedExam.ma_kham_benh,
                            ngayKham: selectedExam.ngay_kham,
                            chanDoan: examDetail?.chan_doan,
                            phuongPhapDieuTri: examDetail?.phuong_phap_dieu_tri,
                            prescriptionRows,
                            nguoiCapThuoc:
                                examDetail?.don_thuoc?.[0]?.ten_nguoi_cap_thuoc,
                        }}
                    />
                )}
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
                    <Stack
                        spacing={2.5}
                        sx={{ "@media print": { display: "none" }, py: 1 }}
                    >
                        <PatientInfoCard
                            data={selectedExam}
                            fields={PATIENT_FIELDS_CAP_THUOC}
                        />

                        {[
                            ["chan_doan", "Chẩn đoán"],
                            ["phuong_phap_dieu_tri", "Phương pháp điều trị"],
                        ]
                            .filter(([key]) => examDetail?.[key])
                            .map(([key, label]) => (
                                <Box key={key}>
                                    <Typography
                                        variant="h4"
                                        sx={{
                                            mb: 0.5,
                                            fontWeight: 600,
                                            color: "text.primary",
                                        }}
                                    >
                                        {label}
                                    </Typography>
                                    <Typography variant="body1">
                                        {examDetail[key]}
                                    </Typography>
                                </Box>
                            ))}

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

            <Box sx={{ "@media print": { display: "none" }, p: 2 }}>
                <DialogActions sx={{ p: 0 }}>
                    <Button onClick={onClose}>Hủy</Button>
                    <Button
                        variant="outlined"
                        onClick={triggerPrint}
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
        </>
    );
}

import { useMemo } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import useExaminationForm from "../../hooks/useExaminationForm.jsx";
import FeedbackSnackbar from "../common/FeedbackSnackbar.jsx";
import PrescriptionForm from "./PrescriptionForm.jsx";
import ReferralDialog from "./ReferralDialog.jsx";
import AdmissionDialog from "./AdmissionDialog.jsx";
import symptoms from "../../data/trieu_chung.json";

function InfoRow({ label, value }) {
    return (
        <Box>
            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: 800 }}
            >
                {label}
            </Typography>
            <Typography variant="body1" sx={{ textAlign: "center" }}>
                {value}
            </Typography>
        </Box>
    );
}

function PatientInfoCard({ qn, exam }) {
    const examDate = exam?.ngay_kham
        ? new Date(exam.ngay_kham).toLocaleDateString("vi-VN")
        : "--";

    return (
        <Card variant="outlined" sx={{ borderRadius: 2, bgcolor: "#F8FAFC" }}>
            <CardContent>
                <Stack
                    direction="row"
                    spacing={2}
                    sx={{ "& > *": { flex: 1, minWidth: 0 } }}
                >
                    <InfoRow
                        label="Họ và tên:"
                        value={qn?.ho_ten || exam?.ma_quan_nhan || "--"}
                    />
                    <InfoRow
                        label="Đơn vị:"
                        value={qn?.ten_don_vi || qn?.ma_don_vi || "--"}
                    />
                    <InfoRow label="Cấp bậc:" value={qn?.cap_bac || "--"} />
                    <InfoRow label="Chức vụ:" value={qn?.chuc_vu || "--"} />
                    <InfoRow label="Ngày khám:" value={examDate} />
                </Stack>
            </CardContent>
        </Card>
    );
}

function SymptomsSection({
    trieuChung,
    onTrieuChungChange,
    trieuChungWords,
    onChipClick,
}) {
    const filteredSymptoms = useMemo(() => {
        const segments = trieuChung.split(/[,;]\s*/);
        const last = segments[segments.length - 1] || "";
        if (!last.trim()) return symptoms;
        const q = last.toLowerCase();
        return symptoms.filter((s) => s.toLowerCase().includes(q));
    }, [trieuChung]);

    return (
        <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h3" sx={{ mb: 1.5, color: "text.primary" }}>
                Triệu chứng
            </Typography>
            <TextField
                multiline
                minRows={4}
                fullWidth
                value={trieuChung}
                onChange={(e) => onTrieuChungChange(e.target.value)}
                placeholder="Nhập triệu chứng..."
            />
            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 2, mb: 1 }}
            >
                Triệu chứng có sẵn:
            </Typography>
            <Box
                sx={{
                    maxHeight: 160,
                    overflowY: "auto",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 0.5,
                }}
            >
                {filteredSymptoms.map((s) => {
                    const selected = trieuChungWords.includes(s);
                    return (
                        <Chip
                            key={s}
                            label={s}
                            size="small"
                            variant={selected ? "filled" : "outlined"}
                            color={selected ? "primary" : "default"}
                            onClick={() => onChipClick(s)}
                            sx={{ cursor: "pointer" }}
                        />
                    );
                })}
            </Box>
        </Grid>
    );
}

function DiagnosisSection({
    chanDoan,
    onChanDoanChange,
    phuongPhap,
    onPhuongPhapChange,
}) {
    return (
        <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h3" sx={{ mb: 1.5, color: "text.primary" }}>
                Chẩn đoán & Phương hướng điều trị
            </Typography>
            <Stack spacing={2}>
                <TextField
                    label="Kết quả chẩn đoán AI"
                    fullWidth
                    disabled
                    placeholder="Kết quả chẩn đoán AI (đang phát triển)"
                />
                <TextField
                    label="Chẩn đoán bệnh"
                    multiline
                    minRows={2}
                    fullWidth
                    value={chanDoan}
                    onChange={(e) => onChanDoanChange(e.target.value)}
                />
                <TextField
                    label="Phương pháp điều trị"
                    multiline
                    minRows={3}
                    fullWidth
                    value={phuongPhap}
                    onChange={(e) => onPhuongPhapChange(e.target.value)}
                />
            </Stack>
        </Grid>
    );
}

function PrescriptionDisplay({ items }) {
    if (!items || items.length === 0) return null;
    return (
        <Box>
            <Typography variant="h3" sx={{ mb: 1.5, color: "text.primary" }}>
                Đơn thuốc đã kê
            </Typography>
            <Stack spacing={1}>
                {items.map((it, i) => (
                    <Box
                        key={i}
                        sx={{
                            display: "flex",
                            gap: 2,
                            p: 1.5,
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 1,
                        }}
                    >
                        <Typography
                            variant="body2"
                            fontWeight={600}
                            sx={{ minWidth: 200 }}
                        >
                            {it.ten_thuoc_vtyt}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            SL: {it.so_luong}
                            {it.don_vi_tinh ? ` (${it.don_vi_tinh})` : ""}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {it.huong_dieu_tri}
                        </Typography>
                    </Box>
                ))}
            </Stack>
        </Box>
    );
}

function FormActions({
    saving,
    hasPrescription,
    onSave,
    onPrescription,
    onReferral,
    onAdmission,
}) {
    return (
        <DialogActions sx={{ px: 3, py: 2, justifyContent: "space-between" }}>
            <Stack direction="row" spacing={1}>
                <Button
                    variant="contained"
                    color="success"
                    onClick={onSave}
                    disabled={saving}
                    sx={{ textTransform: "none" }}
                >
                    Hoàn tất
                </Button>
                <Button
                    variant="contained"
                    onClick={onPrescription}
                    disabled={saving}
                    sx={{ textTransform: "none" }}
                >
                    {hasPrescription ? "Sửa đơn thuốc" : "Kê đơn thuốc"}
                </Button>
            </Stack>
            <Stack direction="row" spacing={1}>
                <Button
                    variant="outlined"
                    color="warning"
                    onClick={onReferral}
                    sx={{ textTransform: "none" }}
                >
                    Chuyển tuyến
                </Button>
                <Button
                    variant="outlined"
                    color="info"
                    onClick={onAdmission}
                    sx={{ textTransform: "none" }}
                >
                    Nhập viện
                </Button>
            </Stack>
        </DialogActions>
    );
}

export default function ExaminationForm({
    open,
    examinationId,
    rowData,
    onClose,
    onSaved,
}) {
    const {
        exam,
        qn,
        loading,
        saving,
        formState,
        updateField,
        handleSave,
        handlePrescriptionSave,
        handleChipClick,
        openPrescription,
        setOpenPrescription,
        openReferral,
        setOpenReferral,
        openAdmission,
        setOpenAdmission,
        handleReferSaved,
        handleAdmissionSaved,
        snackbar,
        setSnackbar,
    } = useExaminationForm({ open, examinationId, rowData, onClose, onSaved });

    const trieuChungWords = formState.trieuChung
        .split(/[,;]\s*/)
        .filter(Boolean);

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
                <DialogTitle>
                    <Stack
                        direction="row"
                        sx={{
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Typography variant="h2">Khám bệnh</Typography>
                        {loading && (
                            <Typography variant="body2" color="text.secondary">
                                Đang tải...
                            </Typography>
                        )}
                    </Stack>
                </DialogTitle>
                <DialogContent dividers>
                    {!exam ? (
                        <Typography
                            color="text.secondary"
                            sx={{ py: 4, textAlign: "center" }}
                        >
                            {loading
                                ? "Đang tải dữ liệu..."
                                : "Không tìm thấy ca khám."}
                        </Typography>
                    ) : (
                        <Stack spacing={3}>
                            <PatientInfoCard qn={qn} exam={exam} />

                            <Grid container spacing={3}>
                                <SymptomsSection
                                    trieuChung={formState.trieuChung}
                                    onTrieuChungChange={(v) =>
                                        updateField("trieuChung", v)
                                    }
                                    trieuChungWords={trieuChungWords}
                                    onChipClick={handleChipClick}
                                />
                                <DiagnosisSection
                                    chanDoan={formState.chanDoan}
                                    onChanDoanChange={(v) =>
                                        updateField("chanDoan", v)
                                    }
                                    phuongPhap={formState.phuongPhap}
                                    onPhuongPhapChange={(v) =>
                                        updateField("phuongPhap", v)
                                    }
                                />
                            </Grid>

                            <PrescriptionDisplay
                                items={formState.prescriptionItems}
                            />
                        </Stack>
                    )}
                </DialogContent>
                {exam && (
                    <FormActions
                        saving={saving}
                        hasPrescription={formState.prescriptionItems.length > 0}
                        onSave={handleSave}
                        onPrescription={() => setOpenPrescription(true)}
                        onReferral={() => setOpenReferral(true)}
                        onAdmission={() => setOpenAdmission(true)}
                    />
                )}
            </Dialog>

            {exam && (
                <ReferralDialog
                    open={openReferral}
                    examinationId={exam.ma_kham_benh}
                    qnId={qn?.ma_quan_nhan}
                    onClose={() => setOpenReferral(false)}
                    onSaved={handleReferSaved}
                />
            )}

            {exam && (
                <AdmissionDialog
                    open={openAdmission}
                    examinationId={exam.ma_kham_benh}
                    qnId={qn?.ma_quan_nhan}
                    onClose={() => setOpenAdmission(false)}
                    onSaved={handleAdmissionSaved}
                />
            )}

            <PrescriptionForm
                open={openPrescription}
                onClose={() => setOpenPrescription(false)}
                onSave={handlePrescriptionSave}
                initialItems={formState.prescriptionItems}
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

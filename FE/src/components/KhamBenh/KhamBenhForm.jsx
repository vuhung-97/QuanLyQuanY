import { memo, useCallback, useMemo } from "react";
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
import useKhamBenhForm from "../../hooks/useKhamBenhForm.jsx";
import FeedbackSnackbar from "../common/FeedbackSnackbar.jsx";
import DonThuocForm from "./DonThuocForm.jsx";
import ChuyenTuyenDialog from "./ChuyenTuyenDialog.jsx";
import NhapVienDialog from "./NhapVienDialog.jsx";
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

const PatientInfoCard = memo(function PatientInfoCard({ qn, exam }) {
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
});

const CHIP_LIMIT = 30;

const ChipList = memo(function ChipList({
    filteredSymptoms,
    trieuChungWords,
    onChipClick,
}) {
    const handleChipClick = useCallback(
        (e) => onChipClick(e.currentTarget.dataset.symptom),
        [onChipClick],
    );
    const hasMore = filteredSymptoms.length > CHIP_LIMIT;
    const visible = hasMore
        ? filteredSymptoms.slice(0, CHIP_LIMIT)
        : filteredSymptoms;
    return (
        <>
            {visible.map((s) => {
                const selected = trieuChungWords.includes(s);
                return (
                    <Chip
                        key={s}
                        data-symptom={s}
                        label={s}
                        size="small"
                        variant={selected ? "filled" : "outlined"}
                        color={selected ? "primary" : "default"}
                        onClick={handleChipClick}
                        sx={{ cursor: "pointer" }}
                    />
                );
            })}
            {hasMore && (
                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ alignSelf: "center" }}
                >
                    +{filteredSymptoms.length - CHIP_LIMIT} khác...
                </Typography>
            )}
        </>
    );
});

const SymptomsSection = memo(function SymptomsSection({
    trieuChung,
    onTrieuChungChange,
    onChipClick,
    readOnly,
}) {
    const trieuChungWords = useMemo(
        () => trieuChung.split(/[,;]\s*/).filter(Boolean),
        [trieuChung],
    );

    const filteredSymptoms = useMemo(() => {
        const segments = trieuChung.split(/[,;]\s*/);
        const last = segments[segments.length - 1] || "";
        if (!last.trim()) return symptoms;
        const q = last.toLowerCase();
        return symptoms.filter((s) => s.toLowerCase().includes(q));
    }, [trieuChung]);

    const handleTextFieldChange = useCallback(
        (e) => onTrieuChungChange(e.target.value),
        [onTrieuChungChange],
    );

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
                onChange={handleTextFieldChange}
                placeholder="Nhập triệu chứng..."
                disabled={readOnly}
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
                <ChipList
                    filteredSymptoms={filteredSymptoms}
                    trieuChungWords={trieuChungWords}
                    onChipClick={onChipClick}
                />
            </Box>
        </Grid>
    );
});

const DiagnosisSection = memo(function DiagnosisSection({
    chanDoan,
    onChanDoanChange,
    phuongPhap,
    onPhuongPhapChange,
    readOnly,
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
                    disabled={readOnly}
                />
                <TextField
                    label="Phương pháp điều trị"
                    multiline
                    minRows={3}
                    fullWidth
                    value={phuongPhap}
                    onChange={(e) => onPhuongPhapChange(e.target.value)}
                    disabled={readOnly}
                />
            </Stack>
        </Grid>
    );
});

const PrescriptionDisplay = memo(function PrescriptionDisplay({ items }) {
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
});

const FormActions = memo(function FormActions({
    saving,
    hasPrescription,
    onSave,
    onPrescription,
    onReferral,
    onAdmission,
    isReadOnly,
    onClose,
}) {
    if (isReadOnly) {
        return (
            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={onClose} sx={{ textTransform: "none" }}>
                    Đóng
                </Button>
            </DialogActions>
        );
    }
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
});

export default function KhamBenhForm({
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
        isReadOnly,
        trieuChung,
        setTrieuChung,
        chanDoan,
        setChanDoan,
        phuongPhap,
        setPhuongPhap,
        prescriptionItems,
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
    } = useKhamBenhForm({ open, examinationId, rowData, onClose, onSaved });

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="lg"
                fullWidth
                slotProps={{ paper: { sx: { height: "80vh" } } }}
            >
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
                                    trieuChung={trieuChung}
                                    onTrieuChungChange={setTrieuChung}
                                    onChipClick={handleChipClick}
                                    readOnly={isReadOnly}
                                />
                                <DiagnosisSection
                                    chanDoan={chanDoan}
                                    onChanDoanChange={setChanDoan}
                                    phuongPhap={phuongPhap}
                                    onPhuongPhapChange={setPhuongPhap}
                                    readOnly={isReadOnly}
                                />
                            </Grid>

                            <PrescriptionDisplay items={prescriptionItems} />
                        </Stack>
                    )}
                </DialogContent>
                {exam && (
                    <FormActions
                        saving={saving}
                        hasPrescription={prescriptionItems.length > 0}
                        onSave={handleSave}
                        onPrescription={() => setOpenPrescription(true)}
                        onReferral={() => setOpenReferral(true)}
                        onAdmission={() => setOpenAdmission(true)}
                        isReadOnly={isReadOnly}
                        onClose={onClose}
                    />
                )}
            </Dialog>

            {exam && (
                <ChuyenTuyenDialog
                    open={openReferral}
                    examinationId={exam.ma_kham_benh}
                    qnId={qn?.ma_quan_nhan}
                    onClose={() => setOpenReferral(false)}
                    onSaved={handleReferSaved}
                />
            )}

            {exam && (
                <NhapVienDialog
                    open={openAdmission}
                    examinationId={exam.ma_kham_benh}
                    qnId={qn?.ma_quan_nhan}
                    onClose={() => setOpenAdmission(false)}
                    onSaved={handleAdmissionSaved}
                />
            )}

            {exam && (
                <DonThuocForm
                    open={openPrescription}
                    onClose={() => setOpenPrescription(false)}
                    onSave={handlePrescriptionSave}
                    initialItems={prescriptionItems}
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

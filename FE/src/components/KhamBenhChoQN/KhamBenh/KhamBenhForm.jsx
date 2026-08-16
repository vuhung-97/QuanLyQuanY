import { useCallback, useMemo } from "react";
import { Dialog, DialogContent, Grid, Stack, Typography } from "@mui/material";
import useKhamBenhForm from "@/hooks/useKhamBenhForm.jsx";
import PatientInfoCard from "@/components/common/PatientInfoCard.jsx";
import FeedbackSnackbar from "@/components/common/FeedbackSnackbar.jsx";
import DonThuocForm from "./DonThuocForm.jsx";
import ConfirmDialog from "@/components/common/ConfirmDialog.jsx";
import DialogTitleWrapper from "@/components/common/DialogTitleWrapper";
import DonThuocTable from "@/components/common/DonThuoc.jsx";
import SymptomsSection from "./KhamBenhSections/SymptomsSection.jsx";
import PredictionPanel from "./KhamBenhSections/PredictionPanel.jsx";
import DiagnosisSection from "./KhamBenhSections/DiagnosisSection.jsx";
import FormActions from "./KhamBenhSections/FormActions.jsx";
import { PATIENT_FIELDS_KHAM_BENH } from "@/components/KhamBenhChoQN/constants.js";

const PATIENT_FIELDS = PATIENT_FIELDS_KHAM_BENH;

export default function KhamBenhForm({
    open,
    examinationId,
    rowData,
    onClose,
    onSaved,
    readOnly = false,
}) {
    const {
        exam,
        qn,
        loading,
        saving,
        isReadOnly,
        trieuChung,
        setTrieuChung,
        updateField,
        getFieldDefault,
        maNhomBenh,
        setMaNhomBenh,
        chanDoan,
        nhomBenhList,
        predictions,
        predicting,
        threshold,
        setThreshold,
        handleDiagnose,
        handleSelectPrediction,
        handleChanDoanChange,
        handleSelectDisease,
        prescriptionItems,
        handleSave,
        handlePrescriptionSave,
        handleChipClick,
        openPrescription,
        setOpenPrescription,
        confirmReferral,
        setConfirmReferral,
        referring,
        handleReferClick,
        handleReferConfirm,
        confirmAdmission,
        setConfirmAdmission,
        handleAdmissionClick,
        handleAdmissionConfirm,
        snackbar,
        setSnackbar,
    } = useKhamBenhForm({
        open,
        examinationId,
        rowData,
        onClose,
        onSaved,
        readOnly,
    });

    const patientInfoData = useMemo(
        () => ({
            ho_ten: qn?.ho_ten,
            ten_don_vi: qn?.ten_don_vi || qn?.ma_don_vi,
            cap_bac: qn?.cap_bac,
            chuc_vu: qn?.chuc_vu,
            ngay_kham: exam?.ngay_kham,
            ten_nguoi_kham: exam?.ten_nguoi_kham,
            vai_tro_nguoi_kham: exam?.vai_tro_nguoi_kham,
            ma_quan_nhan: exam?.ma_quan_nhan,
        }),
        [qn, exam],
    );

    const handleOpenPrescription = useCallback(
        () => setOpenPrescription(true),
        [],
    );

    const hasSymptoms = useMemo(
        () => trieuChung.split(/[,;]\s*/).filter(Boolean).length > 0,
        [trieuChung],
    );

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="lg"
                fullWidth
                slotProps={{ paper: { sx: { height: "80vh" } } }}
            >
                <DialogTitleWrapper wrap={false}>
                    Khám bệnh
                    {loading && (
                        <Typography variant="body2" color="text.secondary">
                            Đang tải...
                        </Typography>
                    )}
                </DialogTitleWrapper>
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
                            <PatientInfoCard
                                data={patientInfoData}
                                fields={PATIENT_FIELDS}
                            />

                            <Grid container spacing={3}>
                                <SymptomsSection
                                    trieuChung={trieuChung}
                                    onTrieuChungChange={setTrieuChung}
                                    onChipClick={handleChipClick}
                                    readOnly={isReadOnly}
                                />
                                <PredictionPanel
                                    predictions={predictions}
                                    predicting={predicting}
                                    threshold={threshold}
                                    onThresholdChange={setThreshold}
                                    onDiagnose={handleDiagnose}
                                    onSelectPrediction={handleSelectPrediction}
                                    readOnly={isReadOnly}
                                    disabled={!hasSymptoms}
                                />
                            </Grid>

                            <DiagnosisSection
                                updateField={updateField}
                                getFieldDefault={getFieldDefault}
                                chanDoan={chanDoan}
                                onChanDoanChange={handleChanDoanChange}
                                onSelectDisease={handleSelectDisease}
                                maNhomBenh={maNhomBenh}
                                nhomBenhList={nhomBenhList}
                                onMaNhomBenhChange={setMaNhomBenh}
                                readOnly={isReadOnly}
                            />

                            <DonThuocTable
                                rows={prescriptionItems}
                                heading="Đơn thuốc đã kê"
                                hideWhenEmpty
                            />
                        </Stack>
                    )}
                </DialogContent>
                {exam && (
                    <FormActions
                        saving={saving}
                        hasPrescription={prescriptionItems.length > 0}
                        onSave={handleSave}
                        onPrescription={handleOpenPrescription}
                        onReferral={handleReferClick}
                        onAdmission={handleAdmissionClick}
                        isReadOnly={isReadOnly}
                        onClose={onClose}
                    />
                )}
            </Dialog>

            <ConfirmDialog
                open={confirmReferral.open}
                title="Xác nhận chuyển tuyến"
                message="Bạn có chắc muốn chuyển tuyến quân nhân này?"
                confirmLabel="Chuyển tuyến"
                confirmColor="warning"
                loading={referring}
                onConfirm={handleReferConfirm}
                onClose={() => setConfirmReferral({ open: false })}
            />

            <ConfirmDialog
                open={confirmAdmission.open}
                title="Xác nhận nhập bệnh xá"
                message="Xác nhận chuyển quân nhân này sang nội trú?"
                confirmLabel="Nhập bệnh xá"
                confirmColor="info"
                loading={saving}
                onConfirm={handleAdmissionConfirm}
                onClose={() => setConfirmAdmission({ open: false })}
            />

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

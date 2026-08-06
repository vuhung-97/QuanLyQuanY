import { useMemo } from "react";
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
import SectionHeading from "@/components/common/SectionHeading.jsx";
import FormTextField from "@/components/common/FormTextField.jsx";
import FormDatePicker from "@/components/common/FormDatePicker.jsx";
import LoadingAlert from "@/components/common/LoadingAlert.jsx";
import ChuyenTuyenPrint from "./ChuyenTuyenPrint.jsx";
import { PATIENT_FIELDS_CHUYEN_TUYEN } from "@/components/KhamBenhChoQN/constants.js";
import useChuyenTuyenForm from "@/hooks/useChuyenTuyenForm.js";
import { parseDonThuocToRows } from "@/utils/khamBenhUtils.js";
import {
    PRINT_STYLES,
    PRINT_DIALOG_CONTENT_SX,
    triggerPrint,
} from "@/utils/printUtils.js";

export default function ChuyenTuyenForm({
    open,
    selectedExam,
    examDetail,
    loading,
    giayGt,
    diTuyen,
    saving,
    onClose,
    onSave,
    readOnly = false,
}) {
    const {
        tenBenhVien,
        yKienDeNghi,
        ngayDi,
        thoiGianDen,
        chanDoan,
        quyetDinhYSinh,
        ngayVe,
        chanDoanLucVe,
        ketQuaDieuTri,
        updateField,
        blurSync,
        handleSave,
    } = useChuyenTuyenForm({ open, giayGt, diTuyen, onSave });

    const prescriptionRows = useMemo(
        () => parseDonThuocToRows(examDetail),
        [examDetail],
    );

    const fieldConfig = useMemo(() => {
        return [
            {
                type: "text",
                name: "tenBenhVien",
                initialValue: tenBenhVien,
                label: "Đơn vị chuyển đến",
            },
            {
                type: "text",
                name: "yKienDeNghi",
                initialValue: yKienDeNghi,
                label: "Ý kiến đề nghị",
                multiline: true,
                minRows: 2,
            },
            { type: "date", name: "ngayDi", initialValue: ngayDi, label: "Ngày đi" },
            {
                type: "date",
                name: "thoiGianDen",
                initialValue: thoiGianDen,
                label: "Thời gian đến bệnh viện, bệnh xá",
            },
            {
                type: "text",
                name: "chanDoan",
                initialValue: chanDoan,
                label: "Chẩn đoán của Y sinh",
                multiline: true,
                minRows: 2,
            },
            {
                type: "text",
                name: "quyetDinhYSinh",
                initialValue: quyetDinhYSinh,
                label: "Quyết định của y sinh",
                multiline: true,
                minRows: 2,
            },
            { type: "heading", label: "Sau khi quân nhân về" },
            { type: "date", name: "ngayVe", initialValue: ngayVe, label: "Ngày về" },
            {
                type: "text",
                name: "chanDoanLucVe",
                initialValue: chanDoanLucVe,
                label: "Chẩn đoán lúc về",
                multiline: true,
                minRows: 2,
            },
            {
                type: "text",
                name: "ketQuaDieuTri",
                initialValue: ketQuaDieuTri,
                label: "Kết quả hướng điều trị",
                multiline: true,
                minRows: 2,
            },
        ];
    }, [tenBenhVien, yKienDeNghi, ngayDi, thoiGianDen, chanDoan, quyetDinhYSinh, ngayVe, chanDoanLucVe, ketQuaDieuTri]);

    const renderField = (cfg) => {
        if (cfg.type === "heading") {
            return <SectionHeading key={cfg.label}>{cfg.label}</SectionHeading>;
        }
        if (cfg.type === "date") {
            return (
                <Stack
                    key={cfg.name}
                    direction="row"
                    spacing={2}
                    sx={{ alignItems: "center" }}
                >
                    <Typography variant="body2" sx={{ minWidth: 220 }}>
                        {cfg.label}:
                    </Typography>
                    <FormDatePicker
                        name={cfg.name}
                        initialValue={cfg.initialValue}
                        onUpdateRef={updateField}
                        onBlurSync={blurSync}
                        size="small"
                    />
                </Stack>
            );
        }
        return (
            <FormTextField
                key={cfg.name}
                name={cfg.name}
                initialValue={cfg.initialValue}
                onUpdateRef={updateField}
                onBlurSync={blurSync}
                label={cfg.label}
                multiline={cfg.multiline}
                minRows={cfg.minRows}
                fullWidth
                size="small"
            />
        );
    };

    return (
        <>
            <style>{PRINT_STYLES}</style>
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
                <DialogTitleWrapper
                    sx={{ "@media print": { display: "none" } }}
                >
                    Thông tin chuyển tuyến
                </DialogTitleWrapper>

                <DialogContent
                    dividers
                    sx={{
                        pt: 0,
                        ...PRINT_DIALOG_CONTENT_SX,
                    }}
                >
                    <LoadingAlert
                        loading={loading}
                        empty={!loading && !selectedExam}
                        emptyMessage="Không tìm thấy thông tin."
                    />

                    {!loading && selectedExam && (
                        <>
                            <Box
                                sx={{
                                    "@media print": { display: "none" },
                                    mt: 1,
                                    pointerEvents: readOnly
                                        ? "none"
                                        : undefined,
                                    opacity: readOnly ? 0.7 : 1,
                                }}
                            >
                                <Stack spacing={2.5}>
                                    <PatientInfoCard
                                        data={selectedExam}
                                        fields={PATIENT_FIELDS_CHUYEN_TUYEN}
                                    />

                                    {[
                                        ["trieu_chung", "Triệu chứng"],
                                        ["chan_doan", "Chẩn đoán"],
                                        [
                                            "phuong_phap_dieu_tri",
                                            "Phương pháp điều trị",
                                        ],
                                    ]
                                        .filter(([key]) => examDetail?.[key])
                                        .map(([key, label]) => (
                                            <Box key={key}>
                                                <SectionHeading>
                                                    {label}
                                                </SectionHeading>
                                                <Typography variant="body1">
                                                    {examDetail[key]}
                                                </Typography>
                                            </Box>
                                        ))}

                                    <DonThuocTable
                                        rows={prescriptionRows}
                                        heading="Đơn thuốc đã kê"
                                        hideWhenEmpty
                                    />

                                    <Box>
                                        <SectionHeading>
                                            Chuyển tuyến
                                        </SectionHeading>
                                        <Stack spacing={2}>
                                            {fieldConfig.map(renderField)}
                                        </Stack>
                                    </Box>
                                </Stack>
                            </Box>

                            <ChuyenTuyenPrint
                                selectedExam={selectedExam}
                                examDetail={examDetail}
                                tenBenhVien={tenBenhVien}
                                yKienDeNghi={yKienDeNghi}
                            />
                        </>
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
                            In giấy giới thiệu
                        </Button>
                        {!readOnly && (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSave}
                                disabled={
                                    saving ||
                                    !selectedExam ||
                                    !tenBenhVien?.trim()
                                }
                                sx={{ textTransform: "none" }}
                            >
                                {saving ? "Đang xử lý..." : "Lưu"}
                            </Button>
                        )}
                    </DialogActions>
                </Box>
            </Dialog>
        </>
    );
}

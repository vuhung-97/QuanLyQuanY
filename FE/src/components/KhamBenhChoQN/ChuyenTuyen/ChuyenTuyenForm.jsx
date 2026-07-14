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
import { PATIENT_FIELDS } from "./constants.js";
import useChuyenTuyenForm from "@/hooks/useChuyenTuyenForm.js";
import { parseDonThuocToRows } from "@/utils/khamBenhUtils.js";
import { PRINT_STYLES, PRINT_DIALOG_CONTENT_SX, triggerPrint } from "@/utils/printUtils.js";

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
        formRef,
        tenBenhVien,
        yKienDeNghi,
        updateField,
        blurSync,
        handleSave,
    } = useChuyenTuyenForm({ open, giayGt, diTuyen, onSave });

    const prescriptionRows = useMemo(
        () => parseDonThuocToRows(examDetail),
        [examDetail],
    );

    return (
        <>
            <style>{PRINT_STYLES}</style>
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitleWrapper sx={{ "@media print": { display: "none" } }}>
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
                                pointerEvents: readOnly ? "none" : undefined,
                                opacity: readOnly ? 0.7 : 1,
                            }}
                        >
                        <Stack spacing={2.5}>
                            <PatientInfoCard
                                data={selectedExam}
                                fields={PATIENT_FIELDS}
                            />

                            {examDetail?.trieu_chung && (
                                <Box>
                                    <SectionHeading>Triệu chứng</SectionHeading>
                                    <Typography variant="body1">
                                        {examDetail.trieu_chung}
                                    </Typography>
                                </Box>
                            )}

                            {examDetail?.chan_doan && (
                                <Box>
                                    <SectionHeading>Chẩn đoán</SectionHeading>
                                    <Typography variant="body1">
                                        {examDetail.chan_doan}
                                    </Typography>
                                </Box>
                            )}

                            {examDetail?.phuong_phap_dieu_tri && (
                                <Box>
                                    <SectionHeading>
                                        Phương pháp điều trị
                                    </SectionHeading>
                                    <Typography variant="body1">
                                        {examDetail.phuong_phap_dieu_tri}
                                    </Typography>
                                </Box>
                            )}

                            <DonThuocTable
                                rows={prescriptionRows}
                                heading="Đơn thuốc đã kê"
                                hideWhenEmpty
                            />

                            <Box>
                                <SectionHeading>Chuyển tuyến</SectionHeading>
                                <Stack spacing={2}>
                                    <FormTextField
                                        name="tenBenhVien"
                                        initialValue={tenBenhVien}
                                        onUpdateRef={updateField}
                                        onBlurSync={blurSync}
                                        label="Đơn vị chuyển đến"
                                        fullWidth
                                        size="small"
                                    />
                                    <FormTextField
                                        name="yKienDeNghi"
                                        initialValue={yKienDeNghi}
                                        onUpdateRef={updateField}
                                        onBlurSync={blurSync}
                                        label="Ý kiến đề nghị"
                                        multiline
                                        minRows={2}
                                        fullWidth
                                        size="small"
                                    />
                                    <Stack
                                        direction="row"
                                        spacing={2}
                                        sx={{ alignItems: "center" }}
                                    >
                                        <Typography
                                            variant="body2"
                                            sx={{ minWidth: 220 }}
                                        >
                                            Ngày đi:
                                        </Typography>
                                        <FormDatePicker
                                            name="ngayDi"
                                            initialValue={
                                                formRef.current.ngayDi
                                            }
                                            onUpdateRef={updateField}
                                            onBlurSync={blurSync}
                                            size="small"
                                        />
                                    </Stack>
                                </Stack>
                            </Box>

                            <Box>
                                <SectionHeading>
                                    Sau khi quân nhân về
                                </SectionHeading>
                                <Stack spacing={2}>
                                    <Stack
                                        direction="row"
                                        spacing={2}
                                        sx={{ alignItems: "center" }}
                                    >
                                        <Typography
                                            variant="body2"
                                            sx={{ minWidth: 220 }}
                                        >
                                            Thời gian đến bệnh viện, bệnh xá:
                                        </Typography>
                                        <FormDatePicker
                                            name="thoiGianDen"
                                            initialValue={
                                                formRef.current.thoiGianDen
                                            }
                                            onUpdateRef={updateField}
                                            onBlurSync={blurSync}
                                            size="small"
                                        />
                                    </Stack>
                                    <FormTextField
                                        name="chanDoan"
                                        initialValue={formRef.current.chanDoan}
                                        onUpdateRef={updateField}
                                        onBlurSync={blurSync}
                                        label="Chẩn đoán"
                                        multiline
                                        minRows={2}
                                        fullWidth
                                        size="small"
                                    />
                                    <FormTextField
                                        name="quyetDinhYSinh"
                                        initialValue={
                                            formRef.current.quyetDinhYSinh
                                        }
                                        onUpdateRef={updateField}
                                        onBlurSync={blurSync}
                                        label="Quyết định của y sinh"
                                        multiline
                                        minRows={2}
                                        fullWidth
                                        size="small"
                                    />
                                    <Stack
                                        direction="row"
                                        spacing={2}
                                        sx={{ alignItems: "center" }}
                                    >
                                        <Typography
                                            variant="body2"
                                            sx={{ minWidth: 220 }}
                                        >
                                            Ngày về:
                                        </Typography>
                                        <FormDatePicker
                                            name="ngayVe"
                                            initialValue={
                                                formRef.current.ngayVe
                                            }
                                            onUpdateRef={updateField}
                                            onBlurSync={blurSync}
                                            size="small"
                                        />
                                    </Stack>
                                    <FormTextField
                                        name="chanDoanLucVe"
                                        initialValue={
                                            formRef.current.chanDoanLucVe
                                        }
                                        onUpdateRef={updateField}
                                        onBlurSync={blurSync}
                                        label="Chẩn đoán lúc về"
                                        multiline
                                        minRows={2}
                                        fullWidth
                                        size="small"
                                    />
                                    <FormTextField
                                        name="ketQuaDieuTri"
                                        initialValue={
                                            formRef.current.ketQuaDieuTri
                                        }
                                        onUpdateRef={updateField}
                                        onBlurSync={blurSync}
                                        label="Kết quả hướng điều trị"
                                        multiline
                                        minRows={2}
                                        fullWidth
                                        size="small"
                                    />
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
                        disabled={saving || !selectedExam}
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

import dayjs from "dayjs";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import DialogTitleWrapper from "@/components/common/DialogTitleWrapper";
import PatientInfoCard from "@/components/common/PatientInfoCard.jsx";
import DatePicker from "@/components/common/DatePicker.jsx";
import DonThuocTable from "@/components/common/DonThuoc.jsx";
import ChuyenTuyenPrint from "./ChuyenTuyenPrint.jsx";
import { parseDonThuocToRows } from "@/utils/khamBenhUtils.js";
import { PRINT_STYLES, PRINT_DIALOG_CONTENT_SX, triggerPrint } from "@/utils/printUtils.js";

const PATIENT_FIELDS = [
    "ho_ten",
    "tuoi",
    "cap_bac",
    "chuc_vu",
    "ten_don_vi",
    "ma_kham_benh",
    "ngay_kham",
];

const sectionSx = { mb: 1, fontWeight: 600, color: "text.primary" };
function SectionHeading({ children }) {
    return (
        <Typography variant="h4" sx={sectionSx}>
            {children}
        </Typography>
    );
}

const FormTextField = memo(function FormTextField({
    name,
    initialValue,
    onUpdateRef,
    onBlurSync,
    ...props
}) {
    const [value, setValue] = useState(initialValue ?? "");
    useEffect(() => {
        setValue(initialValue ?? "");
    }, [initialValue]);

    const handleChange = useCallback(
        (e) => {
            const v = e.target.value;
            setValue(v);
            onUpdateRef(name, v);
        },
        [name, onUpdateRef],
    );

    const handleBlur = useCallback(() => {
        onBlurSync(name, value);
    }, [name, value, onBlurSync]);

    return (
        <TextField
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            {...props}
        />
    );
});

const FormDatePicker = memo(function FormDatePicker({
    name,
    initialValue,
    onUpdateRef,
    onBlurSync,
    ...props
}) {
    const [value, setValue] = useState(initialValue ?? null);
    useEffect(() => {
        setValue(initialValue ?? null);
    }, [initialValue]);

    const handleChange = useCallback(
        (v) => {
            setValue(v);
            onUpdateRef(name, v);
        },
        [name, onUpdateRef],
    );

    return <DatePicker value={value} onChange={handleChange} {...props} />;
});

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
    const formRef = useRef({});
    const [tenBenhVien, setTenBenhVien] = useState("");
    const [yKienDeNghi, setYKienDeNghi] = useState("");

    useEffect(() => {
        if (!open) return;
        const data = {
            tenBenhVien: giayGt?.ten_benh_vien || "",
            yKienDeNghi: giayGt?.y_kien_de_nghi || "",
            ngayDi: diTuyen?.ngay_di ? dayjs(diTuyen.ngay_di) : null,
            thoiGianDen: giayGt?.thoi_gian_den_benh_vien
                ? dayjs(giayGt.thoi_gian_den_benh_vien)
                : null,
            chanDoan: giayGt?.chan_doan || "",
            quyetDinhYSinh: giayGt?.quyet_dinh_y_sinh || "",
            ngayVe: diTuyen?.ngay_ve ? dayjs(diTuyen.ngay_ve) : null,
            chanDoanLucVe: diTuyen?.chan_doan_luc_ve || "",
            ketQuaDieuTri: diTuyen?.ket_qua_huong_dieu_tri || "",
        };
        formRef.current = data;
        setTenBenhVien(data.tenBenhVien);
        setYKienDeNghi(data.yKienDeNghi);
    }, [open, giayGt, diTuyen]);

    const updateField = useCallback((name, value) => {
        formRef.current[name] = value;
    }, []);

    const blurSync = useCallback((name, value) => {
        formRef.current[name] = value;
        if (name === "tenBenhVien") setTenBenhVien(value);
        if (name === "yKienDeNghi") setYKienDeNghi(value);
    }, []);

    const isNew = !giayGt?.ma_giay_gt;

    const handleSave = useCallback(() => {
        const d = formRef.current;
        const giayData = {
            ten_benh_vien: d.tenBenhVien,
            y_kien_de_nghi: d.yKienDeNghi,
            thoi_gian_den_benh_vien: d.thoiGianDen?.toISOString?.() || null,
            chan_doan: d.chanDoan,
            quyet_dinh_y_sinh: d.quyetDinhYSinh,
        };
        const diTuyenData = {};
        if (d.ngayDi) diTuyenData.ngay_di = d.ngayDi.format("YYYY-MM-DD");
        if (d.ngayVe) diTuyenData.ngay_ve = d.ngayVe.format("YYYY-MM-DD");
        if (d.chanDoanLucVe) diTuyenData.chan_doan_luc_ve = d.chanDoanLucVe;
        if (d.ketQuaDieuTri)
            diTuyenData.ket_qua_huong_dieu_tri = d.ketQuaDieuTri;
        onSave(giayData, diTuyenData);
    }, [onSave]);

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

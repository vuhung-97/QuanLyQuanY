import { useCallback, useEffect, useState } from "react";
import { khamBenhService } from "@/services/khamBenhService.js";
import useStaticList from "@/hooks/useStaticList.js";
import { parseHuongDieuTri } from "@/utils/khamBenhUtils.js";
export default function useKhamBenhForm({
    open,
    examinationId,
    rowData,
    onClose,
    onSaved,
    readOnly: forceReadOnly = false,
}) {
    const [exam, setExam] = useState(null);
    const statusReadOnly =
        exam &&
        ["đã_nhận_thuốc", "chuyển_tuyến", "nhập_viện"].includes(
            exam.trang_thai,
        );
    const isReadOnly = forceReadOnly || statusReadOnly;
    const [qn, setQn] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [trieuChung, setTrieuChung] = useState("");
    const [chanDoan, setChanDoan] = useState("");
    const [phuongPhap, setPhuongPhap] = useState("");
    const [maNhomBenh, setMaNhomBenh] = useState("");
    const nhomBenhList = useStaticList("/dm_nhom_benh", {
        pageSize: 200,
    });
    const [prescriptionItems, setPrescriptionItems] = useState([]);
    const [openPrescription, setOpenPrescription] = useState(false);
    const [openReferral, setOpenReferral] = useState(false);
    const [confirmReferral, setConfirmReferral] = useState({ open: false });
    const [referring, setReferring] = useState(false);
    const [confirmAdmission, setConfirmAdmission] = useState({ open: false });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    useEffect(() => {
        if (!open || !examinationId) return;
        let ignore = false;
        async function load() {
            setLoading(true);
            try {
                const res = await khamBenhService.getDetail(examinationId);
                if (ignore) return;
                const data = res.data;
                setExam(data);

                const items = [];
                if (data.don_thuoc) {
                    for (const dt of data.don_thuoc) {
                        for (const ct of dt.chi_tiet_don_thuoc || []) {
                            const parsed = parseHuongDieuTri(ct.huong_dieu_tri);
                            items.push({
                                ma_thuoc_vtyt: ct.ma_thuoc_vtyt,
                                ten_thuoc_vtyt: ct.ten_thuoc_vtyt,
                                don_vi_tinh: ct.don_vi_tinh || "",
                                so_luong: ct.so_luong,
                                sang: parsed.sang,
                                trua: parsed.trua,
                                toi: parsed.toi,
                                thoi_diem_dung: parsed.thoi_diem_dung,
                                cach_su_dung: parsed.cach_su_dung,
                                ghi_chu: parsed.ghi_chu,
                                huong_dieu_tri: ct.huong_dieu_tri || "",
                            });
                        }
                    }
                }

                setTrieuChung(data.trieu_chung || "");
                setChanDoan(data.chan_doan || "");
                setPhuongPhap(data.phuong_phap_dieu_tri || "");
                setMaNhomBenh(data.ma_nhom_benh || "");
                setPrescriptionItems(items);
                if (data.ma_quan_nhan) {
                    try {
                        const qnRes = await khamBenhService.getQuanNhan(
                            data.ma_quan_nhan,
                        );
                        if (!ignore) {
                            setQn({
                                ...qnRes.data,
                                ten_don_vi:
                                    rowData?.ten_don_vi ||
                                    qnRes.data?.ten_don_vi,
                            });
                        }
                    } catch {
                        if (!ignore && rowData) {
                            setQn({
                                ma_quan_nhan: data.ma_quan_nhan,
                                ho_ten: rowData.ho_ten,
                                ma_don_vi: rowData.ma_don_vi,
                                ten_don_vi: rowData.ten_don_vi,
                            });
                        }
                    }
                } else if (!ignore && rowData) {
                    setQn({
                        ma_quan_nhan: rowData.ma_quan_nhan,
                        ho_ten: rowData.ho_ten,
                        ma_don_vi: rowData.ma_don_vi,
                        ten_don_vi: rowData.ten_don_vi,
                    });
                }
            } finally {
                if (!ignore) setLoading(false);
            }
        }
        load();

        return () => {
            ignore = true;
        };
    }, [open, examinationId]);

    const persistExamData = useCallback(async (status) => {
        const hasPrescription = prescriptionItems.length > 0;
        const payload = {
            trieu_chung: trieuChung,
            chan_doan: chanDoan,
            phuong_phap_dieu_tri: phuongPhap,
            ma_nhom_benh: maNhomBenh || null,
        };
        if (hasPrescription) {
            await khamBenhService.completeExamination(exam.ma_kham_benh, {
                ...payload,
                prescription_items: prescriptionItems,
            });
        } else {
            if (status) payload.trang_thai = status;
            await khamBenhService.update(exam.ma_kham_benh, payload);
        }
    }, [exam, trieuChung, chanDoan, phuongPhap, prescriptionItems]);

    const handleSave = useCallback(async () => {
        if (!exam) return;
        if (!trieuChung.trim()) {
            setSnackbar({
                open: true,
                message: "Vui lòng nhập triệu chứng.",
                severity: "warning",
            });
            return;
        }
        setSaving(true);
        try {
            const hasPrescription = prescriptionItems.length > 0;
            const isFull = chanDoan.trim() && phuongPhap.trim();
            const status = hasPrescription ? null : (isFull ? "đã_khám" : "đang_khám");
            await persistExamData(status);

            const message = hasPrescription
                ? "Đã lưu và kê đơn thành công."
                : "Đã lưu kết quả khám.";

            setSnackbar({ open: true, message, severity: "success" });
            onSaved?.();
            setTimeout(onClose, 800);
        } catch (err) {
            setSnackbar({
                open: true,
                message: err.response?.data?.detail || "Lỗi lưu kết quả khám.",
                severity: "error",
            });
        } finally {
            setSaving(false);
        }
    }, [exam, trieuChung, chanDoan, phuongPhap, prescriptionItems, persistExamData, onSaved, onClose]);

    const handlePrescriptionSave = useCallback((items) => {
        setPrescriptionItems(items);
    }, []);

    const handleChipClick = useCallback((symptom) => {
        if (isReadOnly) return;
        setTrieuChung((prev) => {
            if (!prev.trim()) return symptom + ", ";

            const words = prev.split(/[,;]\s*/).filter(Boolean);
            if (words.includes(symptom)) {
                const filtered = words.filter((w) => w !== symptom);
                return filtered.length > 0 ? filtered.join(", ") + ", " : "";
            }

            const hasTrailingSep = /[,;]\s*$/.test(prev);
            if (hasTrailingSep) return `${prev}${symptom}, `;

            words[words.length - 1] = symptom;
            return words.join(", ") + ", ";
        });
    }, []);

    const handleReferClick = useCallback(() => {
        setConfirmReferral({ open: true });
    }, []);

    const handleReferConfirm = useCallback(async () => {
        if (!exam || !qn) return;
        if (!trieuChung.trim()) {
            setSnackbar({
                open: true,
                message: "Vui lòng nhập triệu chứng.",
                severity: "warning",
            });
            return;
        }
        setReferring(true);
        try {
            await persistExamData();
            await khamBenhService.referPatient(exam.ma_kham_benh, {
                ma_quan_nhan: qn.ma_quan_nhan,
                ma_kham_benh: exam.ma_kham_benh,
            });
            setSnackbar({
                open: true,
                message: "Đã chuyển tuyến thành công.",
                severity: "success",
            });
            setConfirmReferral({ open: false });
            onSaved?.();
            setTimeout(onClose, 800);
        } catch (err) {
            setSnackbar({
                open: true,
                message:
                    err.response?.data?.detail || "Lỗi chuyển tuyến.",
                severity: "error",
            });
        } finally {
            setReferring(false);
        }
    }, [exam, qn, trieuChung, chanDoan, phuongPhap, prescriptionItems, persistExamData, onSaved, onClose]);

    const handleReferSaved = useCallback(() => {
        setOpenReferral(false);
        onSaved?.();
        onClose();
    }, [onSaved, onClose]);

    const handleAdmissionClick = useCallback(() => {
        setConfirmAdmission({ open: true });
    }, []);

    const handleAdmissionConfirm = useCallback(async () => {
        if (!exam) return;
        if (!trieuChung.trim()) {
            setSnackbar({
                open: true,
                message: "Vui lòng nhập triệu chứng.",
                severity: "warning",
            });
            return;
        }
        setSaving(true);
        try {
            await persistExamData();
            await khamBenhService.admitPatient(exam.ma_kham_benh);
            setSnackbar({
                open: true,
                message: "Đã chuyển sang nhập viện.",
                severity: "success",
            });
            setConfirmAdmission({ open: false });
            onSaved?.();
            setTimeout(onClose, 800);
        } catch (err) {
            setSnackbar({
                open: true,
                message: typeof err.response?.data?.detail === "string"
                    ? err.response.data.detail
                    : "Lỗi nhập viện.",
                severity: "error",
            });
        } finally {
            setSaving(false);
        }
    }, [exam, trieuChung, chanDoan, phuongPhap, prescriptionItems, persistExamData, onSaved, onClose]);

    return {
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
        setPrescriptionItems,
        handleSave,
        handlePrescriptionSave,
        handleChipClick,
        openPrescription,
        setOpenPrescription,
        openReferral,
        setOpenReferral,
        confirmReferral,
        setConfirmReferral,
        referring,
        handleReferClick,
        handleReferConfirm,
        handleReferSaved,
        confirmAdmission,
        setConfirmAdmission,
        handleAdmissionClick,
        handleAdmissionConfirm,
        maNhomBenh,
        setMaNhomBenh,
        nhomBenhList,
        snackbar,
        setSnackbar,
    };
}

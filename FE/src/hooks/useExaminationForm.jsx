import { useCallback, useEffect, useState } from "react";
import { khamBenhService } from "../services/khamBenhService.js";

const INITIAL_FORM = {
    trieuChung: "",
    chanDoan: "",
    phuongPhap: "",
    prescriptionItems: [],
    prescriptionChanDoan: "",
};

export default function useExaminationForm({ open, examinationId, onClose, onSaved }) {
    const [exam, setExam] = useState(null);
    const [qn, setQn] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formState, setFormState] = useState({ ...INITIAL_FORM });
    const [openReferral, setOpenReferral] = useState(false);
    const [openAdmission, setOpenAdmission] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    const updateField = useCallback((field, value) => {
        setFormState((prev) => ({ ...prev, [field]: value }));
    }, []);

    useEffect(() => {
        if (!open || !examinationId) return;
        let ignore = false;
        async function load() {
            setLoading(true);
            try {
                const res = await khamBenhService.getById(examinationId);
                if (ignore) return;
                const data = res.data;
                setExam(data);
                setFormState({
                    trieuChung: data.trieu_chung_chan_doan || "",
                    chanDoan: "",
                    phuongPhap: data.phuong_phap_dieu_tri || "",
                    prescriptionItems: [],
                    prescriptionChanDoan: "",
                });
                if (data.ma_quan_nhan) {
                    try {
                        const qnRes = await khamBenhService.getQuanNhan(data.ma_quan_nhan);
                        if (!ignore) setQn(qnRes.data);
                    } catch {}
                }
            } finally {
                if (!ignore) setLoading(false);
            }
        }
        load();
        return () => { ignore = true; };
    }, [open, examinationId]);

    const handleSave = useCallback(async (taoDon) => {
        if (!exam) return;
        if (!formState.trieuChung.trim()) {
            setSnackbar({ open: true, message: "Vui lòng nhập triệu chứng.", severity: "warning" });
            return;
        }
        setSaving(true);
        try {
            const payload = {
                trieu_chung_chan_doan: formState.trieuChung,
                chan_doan: formState.chanDoan,
                phuong_phap_dieu_tri: formState.phuongPhap,
            };
            if (taoDon && formState.prescriptionItems.length > 0) {
                payload.chan_doan = formState.prescriptionChanDoan;
                payload.prescription_items = formState.prescriptionItems;
            }
            await khamBenhService.update(exam.ma_kham_benh, payload);
            setSnackbar({
                open: true,
                message: taoDon ? "Đã lưu và kê đơn thành công." : "Đã lưu kết quả khám.",
                severity: "success",
            });
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
    }, [exam, formState, onSaved, onClose]);

    const handleChipClick = useCallback((symptom) => {
        setFormState((prev) => {
            const text = prev.trieuChung;
            if (!text.trim()) return { ...prev, trieuChung: symptom };

            const hasTrailingSep = /[,;]\s*$/.test(text);
            if (hasTrailingSep) return { ...prev, trieuChung: `${text}${symptom}` };

            const words = text.split(/[,;]\s*/);
            const last = words[words.length - 1];
            if (last === symptom) return prev;
            words[words.length - 1] = symptom;
            return { ...prev, trieuChung: words.join(", ") };
        });
    }, []);

    const handleReferSaved = useCallback(() => {
        setOpenReferral(false);
        onSaved?.();
        onClose();
    }, [onSaved, onClose]);

    const handleAdmissionSaved = useCallback(() => {
        setOpenAdmission(false);
        onSaved?.();
        onClose();
    }, [onSaved, onClose]);

    return {
        exam,
        qn,
        loading,
        saving,
        formState,
        updateField,
        handleSave,
        handleChipClick,
        openReferral,
        setOpenReferral,
        openAdmission,
        setOpenAdmission,
        handleReferSaved,
        handleAdmissionSaved,
        snackbar,
        setSnackbar,
    };
}

import { useCallback, useEffect, useState } from "react";
import { khamBenhService } from "../services/khamBenhService.js";

const THOI_DIEM_LABEL_TO_VALUE = {
    "Uống sau ăn": "sau_an",
    "Uống trước ăn": "truoc_an",
    "Trước khi ngủ": "truoc_khi_ngu",
    "Sau khi thức dậy": "sau_khi_thuc_day",
    "Không": "khong",
};

const CACH_DUNG_LABEL_TO_VALUE = {
    "Uống": "uong",
    "Bôi": "boi",
    "Tiêm": "tiem",
    "Xông": "xong",
    "Ngậm": "ngam",
    "Nhỏ mắt": "nhot",
    "Khác": "khac",
};

function parseHuongDieuTri(str) {
    if (!str) return { sang: 0, trua: 0, toi: 0, thoi_diem_dung: "sau_an", cach_su_dung: "uong", ghi_chu: "" };
    const parts = str.split(" | ");
    const lieu = parts[0] || "";
    const thoiDiemLabel = parts[1] || "";
    const cachDungLabel = parts[2] || "";
    const ghi_chu = parts.slice(3).join(" | ") || "";
    const lieuParts = lieu.split(" - ");
    const sang = parseInt(lieuParts[0]?.replace("Sáng: ", "")) || 0;
    const trua = parseInt(lieuParts[1]?.replace("Trưa: ", "")) || 0;
    const toi = parseInt(lieuParts[2]?.replace("Tối: ", "")) || 0;
    const thoi_diem_dung =
        THOI_DIEM_LABEL_TO_VALUE[thoiDiemLabel] || "sau_an";
    const cach_su_dung =
        CACH_DUNG_LABEL_TO_VALUE[cachDungLabel] || "uong";
    return { sang, trua, toi, thoi_diem_dung, cach_su_dung, ghi_chu };
}

const INITIAL_FORM = {
    trieuChung: "",
    chanDoan: "",
    phuongPhap: "",
    prescriptionItems: [],
};

export default function useExaminationForm({
    open,
    examinationId,
    rowData,
    onClose,
    onSaved,
}) {
    const [exam, setExam] = useState(null);
    const [qn, setQn] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formState, setFormState] = useState({ ...INITIAL_FORM });
    const [openPrescription, setOpenPrescription] = useState(false);
    const [openReferral, setOpenReferral] = useState(false);
    const [openAdmission, setOpenAdmission] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const updateField = useCallback((field, value) => {
        setFormState((prev) => ({ ...prev, [field]: value }));
    }, []);

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
                            const parsed = parseHuongDieuTri(
                                ct.huong_dieu_tri,
                            );
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

                setFormState({
                    trieuChung: data.trieu_chung || "",
                    chanDoan: data.chan_doan || "",
                    phuongPhap: data.phuong_phap_dieu_tri || "",
                    prescriptionItems: items,
                });
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

    const handleSave = useCallback(
        async () => {
            if (!exam) return;
            if (!formState.trieuChung.trim()) {
                setSnackbar({
                    open: true,
                    message: "Vui lòng nhập triệu chứng.",
                    severity: "warning",
                });
                return;
            }
            setSaving(true);
            try {
                const hasPrescription = formState.prescriptionItems.length > 0;
                const payload = {
                    trieu_chung: formState.trieuChung,
                    chan_doan: formState.chanDoan,
                    phuong_phap_dieu_tri: formState.phuongPhap,
                };

                let message;
                if (hasPrescription) {
                    payload.prescription_items = formState.prescriptionItems;
                    await khamBenhService.completeExamination(
                        exam.ma_kham_benh,
                        payload,
                    );
                    message = "Đã lưu và kê đơn thành công.";
                } else {
                    const isFull =
                        formState.chanDoan.trim() &&
                        formState.phuongPhap.trim();
                    payload.trang_thai = isFull ? "đã_khám" : "đang_khám";
                    await khamBenhService.update(exam.ma_kham_benh, payload);
                    message = "Đã lưu kết quả khám.";
                }

                setSnackbar({
                    open: true,
                    message,
                    severity: "success",
                });
                onSaved?.();
                setTimeout(onClose, 800);
            } catch (err) {
                setSnackbar({
                    open: true,
                    message:
                        err.response?.data?.detail || "Lỗi lưu kết quả khám.",
                    severity: "error",
                });
            } finally {
                setSaving(false);
            }
        },
        [exam, formState, onSaved, onClose],
    );

    const handlePrescriptionSave = useCallback((items) => {
        setFormState((prev) => ({ ...prev, prescriptionItems: items }));
    }, []);

    const handleChipClick = useCallback((symptom) => {
        setFormState((prev) => {
            const text = prev.trieuChung;
            if (!text.trim()) return { ...prev, trieuChung: symptom + ", " };

            const words = text.split(/[,;]\s*/).filter(Boolean);
            if (words.includes(symptom)) return prev;

            const hasTrailingSep = /[,;]\s*$/.test(text);
            if (hasTrailingSep)
                return { ...prev, trieuChung: `${text}${symptom}, ` };

            words[words.length - 1] = symptom;
            return { ...prev, trieuChung: words.join(", ") + ", " };
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
    };
}

import { useCallback, useEffect, useState } from "react";
import api from "../services/api.js";

const emptyDetail = {
    ma_don_vi: "",
    thoi_gian_bat_dau: "",
    thoi_gian_ket_thuc: "",
    dia_diem: "",
};

export default function useScheduleDialog({
    open,
    schedule,
    chiTietList,
    onSaved,
    onClose,
}) {
    const isEdit = Boolean(schedule);
    const [master, setMaster] = useState({
        thoi_gian_bat_dau: "",
        thoi_gian_ket_thuc: "",
    });
    const [details, setDetails] = useState([]);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [unitOptions, setUnitOptions] = useState([]);

    useEffect(() => {
        if (open) {
            api.get("/thong-ke/don-vi", { params: { limit: 100 } })
                .then((res) => {
                    const all = Array.isArray(res.data) ? res.data : [];
                    setUnitOptions(all.filter((u) => !u.ma_don_vi_truc_thuoc));
                })
                .catch(() => {});
        }
    }, [open]);

    useEffect(() => {
        if (open) {
            if (schedule) {
                setMaster({
                    thoi_gian_bat_dau: schedule.thoi_gian_bat_dau || "",
                    thoi_gian_ket_thuc: schedule.thoi_gian_ket_thuc || "",
                });
                setDetails(
                    (chiTietList || []).map((ct) => ({
                        ma_don_vi: ct.ma_don_vi || "",
                        thoi_gian_bat_dau: ct.thoi_gian_bat_dau || "",
                        thoi_gian_ket_thuc: ct.thoi_gian_ket_thuc || "",
                        dia_diem: ct.dia_diem || "",
                    })),
                );
            } else {
                setMaster({ thoi_gian_bat_dau: "", thoi_gian_ket_thuc: "" });
                setDetails([]);
            }
            setError("");
        }
    }, [open, schedule, chiTietList]);

    const handleDetailChange = useCallback((index, field, value) => {
        setDetails((prev) => {
            const next = [...prev];
            next[index] = { ...next[index], [field]: value };
            return next;
        });
    }, []);

    const addDetail = useCallback(() => {
        setDetails((prev) => [...prev, { ...emptyDetail }]);
    }, []);

    const removeDetail = useCallback((index) => {
        setDetails((prev) => prev.filter((_, i) => i !== index));
    }, []);

    const handleMasterChange = useCallback((field, value) => {
        setMaster((prev) => ({ ...prev, [field]: value }));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (details.length === 0) {
            setError("Vui lòng thêm ít nhất một đơn vị.");
            return;
        }
        setSaving(true);
        setError("");
        try {
            if (isEdit) {
                await api.patch(
                    `/lich_kham_sk_nam/${schedule.ma_lich_kham}`,
                    master,
                );
                const existing = chiTietList || [];
                const existingKeys = new Set(
                    existing.map((ct) => ct.ma_don_vi),
                );
                const newKeys = new Set(details.map((d) => d.ma_don_vi));

                for (const d of details) {
                    if (existingKeys.has(d.ma_don_vi)) {
                        await api.patch(
                            `/lich_kham_sk_nam/${schedule.ma_lich_kham}/chi-tiet/${d.ma_don_vi}`,
                            {
                                thoi_gian_bat_dau: d.thoi_gian_bat_dau || null,
                                thoi_gian_ket_thuc:
                                    d.thoi_gian_ket_thuc || null,
                                dia_diem: d.dia_diem || null,
                            },
                        );
                    } else {
                        await api.post(
                            `/lich_kham_sk_nam/${schedule.ma_lich_kham}/chi-tiet`,
                            d,
                        );
                    }
                }
                for (const ct of existing) {
                    if (!newKeys.has(ct.ma_don_vi)) {
                        await api.delete(
                            `/lich_kham_sk_nam/${schedule.ma_lich_kham}/chi-tiet/${ct.ma_don_vi}`,
                        );
                    }
                }
            } else {
                const res = await api.post("/lich_kham_sk_nam", master);
                const ma_lich_kham = res.data?.ma_lich_kham;
                if (!ma_lich_kham) {
                    setError("Không nhận được mã lịch khám từ server.");
                    setSaving(false);
                    return;
                }
                for (const d of details) {
                    await api.post(
                        `/lich_kham_sk_nam/${ma_lich_kham}/chi-tiet`,
                        d,
                    );
                }
            }
            onSaved();
            onClose();
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                    `Lỗi ${err.response?.status}: ${err.message}` ||
                    "Không thể lưu lịch khám.",
            );
        } finally {
            setSaving(false);
        }
    };

    return {
        master,
        details,
        saving,
        error,
        unitOptions,
        isEdit,
        handleMasterChange,
        handleDetailChange,
        addDetail,
        removeDetail,
        handleSubmit,
    };
}

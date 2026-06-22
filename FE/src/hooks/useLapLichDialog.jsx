import { useCallback, useEffect, useRef, useState } from "react";
import { khamSucKhoeService } from "@/services/khamSucKhoeService.js";

function genKey() {
    return Math.random().toString(36).slice(2, 11);
}

export default function useLapLichDialog({
    open,
    schedule,
    chiTietList,
    onSaved,
    onClose,
}) {
    const isEdit = Boolean(schedule);
    const [thoiGianBatDau, setThoiGianBatDau] = useState("");
    const [thoiGianKetThuc, setThoiGianKetThuc] = useState("");
    const [rowKeys, setRowKeys] = useState([]);
    const rowRefs = useRef(new Map());
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [unitOptions, setUnitOptions] = useState([]);

    useEffect(() => {
        if (open) {
            khamSucKhoeService.getDonViList()
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
                setThoiGianBatDau(schedule.thoi_gian_bat_dau || "");
                setThoiGianKetThuc(schedule.thoi_gian_ket_thuc || "");
                setRowKeys(
                    (chiTietList || []).map(() => ({ key: genKey() })),
                );
            } else {
                setThoiGianBatDau("");
                setThoiGianKetThuc("");
                setRowKeys([]);
            }
            rowRefs.current = new Map();
            setError("");
        }
    }, [open, schedule, chiTietList]);

    const addDetail = useCallback(() => {
        setRowKeys((prev) => [...prev, { key: genKey() }]);
    }, []);

    const removeDetail = useCallback((key) => {
        setRowKeys((prev) => prev.filter((r) => r.key !== key));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const details = [];
        rowRefs.current.forEach((ref) => {
            const d = ref.getData();
            if (d.ma_don_vi) details.push(d);
        });
        if (details.length === 0) {
            setError("Vui lòng thêm ít nhất một đơn vị.");
            return;
        }
        setSaving(true);
        setError("");
        try {
            const master = {
                thoi_gian_bat_dau: thoiGianBatDau,
                thoi_gian_ket_thuc: thoiGianKetThuc,
            };
            if (isEdit) {
                await khamSucKhoeService.updateSchedule(schedule.ma_lich_kham, master);
                const existing = chiTietList || [];
                const existingKeys = new Set(
                    existing.map((ct) => ct.ma_don_vi),
                );
                const newKeys = new Set(details.map((d) => d.ma_don_vi));

                for (const d of details) {
                    if (existingKeys.has(d.ma_don_vi)) {
                        await khamSucKhoeService.updateScheduleDetail(
                            schedule.ma_lich_kham,
                            d.ma_don_vi,
                            {
                                thoi_gian_bat_dau: d.thoi_gian_bat_dau || null,
                                thoi_gian_ket_thuc:
                                    d.thoi_gian_ket_thuc || null,
                                dia_diem: d.dia_diem || null,
                            },
                        );
                    } else {
                        await khamSucKhoeService.createScheduleDetail(schedule.ma_lich_kham, d);
                    }
                }
                for (const ct of existing) {
                    if (!newKeys.has(ct.ma_don_vi)) {
                        await khamSucKhoeService.deleteScheduleDetail(schedule.ma_lich_kham, ct.ma_don_vi);
                    }
                }
            } else {
                const res = await khamSucKhoeService.createSchedule(master);
                const ma_lich_kham = res.data?.ma_lich_kham;
                if (!ma_lich_kham) {
                    setError("Không nhận được mã lịch khám từ server.");
                    setSaving(false);
                    return;
                }
                for (const d of details) {
                    await khamSucKhoeService.createScheduleDetail(ma_lich_kham, d);
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
        thoiGianBatDau,
        setThoiGianBatDau,
        thoiGianKetThuc,
        setThoiGianKetThuc,
        rowKeys,
        rowRefs,
        saving,
        error,
        unitOptions,
        isEdit,
        addDetail,
        removeDetail,
        handleSubmit,
        chiTietList,
    };
}

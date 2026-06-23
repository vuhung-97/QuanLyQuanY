import { useCallback, useEffect, useState } from "react";
import { khamSucKhoeService } from "@/services/khamSucKhoeService.js";

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
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [unitOptions, setUnitOptions] = useState([]);
    const [detailData, setDetailData] = useState({});

    // Phân công nhiệm vụ
    const [users, setUsers] = useState([]);
    const [vaiTroList, setVaiTroList] = useState([]);
    const [assignments, setAssignments] = useState({}); // { id_nguoi_dung: ma_vai_tro }
    const [existingAssignments, setExistingAssignments] = useState([]);

    useEffect(() => {
        if (open) {
            khamSucKhoeService.getDonViList()
                .then((res) => {
                    const all = Array.isArray(res.data) ? res.data : [];
                    setUnitOptions(all.filter((u) => !u.ma_don_vi_truc_thuoc));
                })
                .catch(() => {});
            khamSucKhoeService.getNguoiDungList()
                .then((res) => {
                    const list = Array.isArray(res.data) ? res.data : [];
                    setUsers(list.filter((u) => u.id_vai_tro !== "ROLE_ADMIN"));
                })
                .catch(() => {});
            khamSucKhoeService.getVaiTroList()
                .then((res) => {
                    setVaiTroList(Array.isArray(res.data) ? res.data : []);
                })
                .catch(() => {});
        }
    }, [open]);

    useEffect(() => {
        if (open) {
            if (schedule) {
                setThoiGianBatDau(schedule.thoi_gian_bat_dau || "");
                setThoiGianKetThuc(schedule.thoi_gian_ket_thuc || "");
                const init = {};
                for (const ct of (chiTietList || [])) {
                    init[ct.ma_don_vi] = {
                        thoi_gian_bat_dau: ct.thoi_gian_bat_dau || "",
                        thoi_gian_ket_thuc: ct.thoi_gian_ket_thuc || "",
                        dia_diem: ct.dia_diem || "",
                    };
                }
                setDetailData(init);
                // Load assignments hiện có
                khamSucKhoeService.getAssignments(schedule.ma_lich_kham)
                    .then((res) => {
                        const list = Array.isArray(res.data) ? res.data : [];
                        setExistingAssignments(list);
                        const map = {};
                        for (const a of list) {
                            map[a.id_nguoi_dung] = a.ma_vai_tro;
                        }
                        setAssignments(map);
                    })
                    .catch(() => {});
            } else {
                setThoiGianBatDau("");
                setThoiGianKetThuc("");
                setDetailData({});
                setAssignments({});
                setExistingAssignments([]);
            }
            setError("");
        }
    }, [open, schedule, chiTietList]);

    const handleAssignmentChange = useCallback((userId, vaiTro) => {
        setAssignments((prev) => {
            const next = { ...prev };
            if (vaiTro) {
                next[userId] = vaiTro;
            } else {
                delete next[userId];
            }
            return next;
        });
    }, []);

    const handleDetailChange = useCallback((maDonVi, field, value) => {
        setDetailData((prev) => ({
            ...prev,
            [maDonVi]: {
                ...(prev[maDonVi] || {
                    thoi_gian_bat_dau: "",
                    thoi_gian_ket_thuc: "",
                    dia_diem: "",
                }),
                [field]: value,
            },
        }));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const details = Object.entries(detailData)
            .filter(([_, d]) => d.thoi_gian_bat_dau && d.thoi_gian_ket_thuc)
            .map(([ma_don_vi, d]) => ({ ma_don_vi, ...d }));
        if (details.length === 0) {
            setError("Vui lòng nhập ít nhất một đơn vị có thời gian.");
            return;
        }
        setSaving(true);
        setError("");
        try {
            const master = {
                thoi_gian_bat_dau: thoiGianBatDau,
                thoi_gian_ket_thuc: thoiGianKetThuc,
            };
            let ma_lich_kham;
            if (isEdit) {
                ma_lich_kham = schedule.ma_lich_kham;
                await khamSucKhoeService.updateSchedule(ma_lich_kham, master);
                const existing = chiTietList || [];
                const existingKeys = new Set(
                    existing.map((ct) => ct.ma_don_vi),
                );
                const newKeys = new Set(details.map((d) => d.ma_don_vi));

                for (const d of details) {
                    if (existingKeys.has(d.ma_don_vi)) {
                        await khamSucKhoeService.updateScheduleDetail(
                            ma_lich_kham,
                            d.ma_don_vi,
                            {
                                thoi_gian_bat_dau: d.thoi_gian_bat_dau || null,
                                thoi_gian_ket_thuc:
                                    d.thoi_gian_ket_thuc || null,
                                dia_diem: d.dia_diem || null,
                            },
                        );
                    } else {
                        await khamSucKhoeService.createScheduleDetail(ma_lich_kham, d);
                    }
                }
                for (const ct of existing) {
                    if (!newKeys.has(ct.ma_don_vi)) {
                        await khamSucKhoeService.deleteScheduleDetail(ma_lich_kham, ct.ma_don_vi);
                    }
                }
            } else {
                const res = await khamSucKhoeService.createSchedule(master);
                ma_lich_kham = res.data?.ma_lich_kham;
                if (!ma_lich_kham) {
                    setError("Không nhận được mã lịch khám từ server.");
                    setSaving(false);
                    return;
                }
                for (const d of details) {
                    await khamSucKhoeService.createScheduleDetail(ma_lich_kham, d);
                }
            }

            // Batch save assignments
            const existingMap = {};
            for (const a of existingAssignments) {
                existingMap[a.id_nguoi_dung] = a;
            }
            const newUserIds = Object.keys(assignments);

            for (const userId of newUserIds) {
                const vaiTro = assignments[userId];
                if (existingMap[userId]) {
                    if (existingMap[userId].ma_vai_tro !== vaiTro) {
                        await khamSucKhoeService.updateAssignment(
                            ma_lich_kham,
                            existingMap[userId].id,
                            { ma_vai_tro: vaiTro },
                        );
                    }
                } else {
                    await khamSucKhoeService.createAssignment(
                        ma_lich_kham,
                        { id_nguoi_dung: userId, ma_vai_tro: vaiTro },
                    );
                }
            }
            for (const a of existingAssignments) {
                if (!assignments[a.id_nguoi_dung]) {
                    await khamSucKhoeService.deleteAssignment(ma_lich_kham, a.id);
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
        saving,
        error,
        unitOptions,
        isEdit,
        handleSubmit,
        users,
        vaiTroList,
        assignments,
        handleAssignmentChange,
        detailData,
        handleDetailChange,
    };
}

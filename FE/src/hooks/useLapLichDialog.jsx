import { useCallback, useEffect, useState } from "react";
import { khamSucKhoeService } from "@/services/khamSucKhoeService.js";

export default function useLapLichDialog({
    open,
    schedule,
    chiTietList,
    onSaved,
    onClose,
    unitOptions = [],
}) {
    const isEdit = Boolean(schedule);
    const [thoiGianBatDau, setThoiGianBatDau] = useState("");
    const [thoiGianKetThuc, setThoiGianKetThuc] = useState("");
    const [saving, setSaving] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const [detailData, setDetailData] = useState({});

    // Phân công nhiệm vụ
    const [users, setUsers] = useState([]);
    const [vaiTroList, setVaiTroList] = useState([]);
    const [assignments, setAssignments] = useState({}); // { id_nguoi_dung: ma_vai_tro }
    const [existingAssignments, setExistingAssignments] = useState([]);

    useEffect(() => {
        if (open) {
            khamSucKhoeService.getNguoiDungList()
                .then((res) => {
                    const list = Array.isArray(res.data) ? res.data : [];
                    const EXCLUDED_ROLES = new Set(["ROLE_ADMIN", "ROLE_QN"]);
                    setUsers(list.filter((u) => u.id_vai_tro && !EXCLUDED_ROLES.has(u.id_vai_tro)));
                })
                .catch(() => setSnackbar({ open: true, message: "Lỗi tải danh sách người dùng.", severity: "error" }));
            khamSucKhoeService.getVaiTroList()
                .then((res) => {
                    setVaiTroList(Array.isArray(res.data) ? res.data : []);
                })
                .catch(() => setSnackbar({ open: true, message: "Lỗi tải danh sách vai trò.", severity: "error" }));
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
                    .catch(() => setSnackbar({ open: true, message: "Lỗi tải phân công nhiệm vụ.", severity: "error" }));
            } else {
                setThoiGianBatDau("");
                setThoiGianKetThuc("");
                setDetailData({});
                setAssignments({});
                setExistingAssignments([]);
            }
            setSnackbar({ open: false, message: "", severity: "success" });
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

    const handleCloseSnackbar = useCallback(() => {
        setSnackbar((s) => ({ ...s, open: false }));
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
            setSnackbar({ open: true, message: "Vui lòng nhập ít nhất một đơn vị có thời gian.", severity: "warning" });
            return;
        }
        setSaving(true);
        setSnackbar({ open: false, message: "", severity: "success" });
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
                    setSnackbar({ open: true, message: "Không nhận được mã lịch khám từ server.", severity: "error" });
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

            setSnackbar({ open: true, message: "Đã lưu lịch khám.", severity: "success" });
            setTimeout(() => { onSaved(); onClose(); }, 400);
        } catch (err) {
            setSnackbar({
                open: true,
                message: err.response?.data?.detail || "Không thể lưu lịch khám.",
                severity: "error",
            });
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
        snackbar,
        handleCloseSnackbar,
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

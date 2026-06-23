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
                setRowKeys(
                    (chiTietList || []).map(() => ({ key: genKey() })),
                );
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
                setRowKeys([]);
                setAssignments({});
                setExistingAssignments([]);
            }
            rowRefs.current = new Map();
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
        users,
        vaiTroList,
        assignments,
        handleAssignmentChange,
    };
}

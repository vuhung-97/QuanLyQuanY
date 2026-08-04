import { useCallback, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
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
    const [thoiGianLayMauBatDau, setThoiGianLayMauBatDau] = useState("");
    const [thoiGianLayMauKetThuc, setThoiGianLayMauKetThuc] = useState("");
    const [thoiGianDuTruLayMauBatDau, setThoiGianDuTruLayMauBatDau] =
        useState("");
    const [thoiGianDuTruLayMauKetThuc, setThoiGianDuTruLayMauKetThuc] =
        useState("");
    const [thoiGianDuTruKhamBatDau, setThoiGianDuTruKhamBatDau] = useState("");
    const [thoiGianDuTruKhamKetThuc, setThoiGianDuTruKhamKetThuc] =
        useState("");
    const [saving, setSaving] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState("");
    const [detailData, setDetailData] = useState({});
    const [selectedUnits, setSelectedUnits] = useState({});

    // Phân công nhiệm vụ
    const [users, setUsers] = useState([]);
    const [vaiTroList, setVaiTroList] = useState([]);
    const [assignments, setAssignments] = useState({}); // { id_nguoi_dung: ma_vai_tro }
    const [existingAssignments, setExistingAssignments] = useState([]);

    useEffect(() => {
        if (open) {
            khamSucKhoeService
                .getNguoiDungList()
                .then((res) => {
                    const list = Array.isArray(res.data) ? res.data : [];
                    const EXCLUDED_ROLES = new Set(["ROLE_ADMIN", "ROLE_QN"]);
                    setUsers(
                        list.filter(
                            (u) =>
                                u.id_vai_tro &&
                                !EXCLUDED_ROLES.has(u.id_vai_tro),
                        ),
                    );
                })
                .catch(() =>
                    setSnackbar({
                        open: true,
                        message: "Lỗi tải danh sách người dùng.",
                        severity: "error",
                    }),
                );
            khamSucKhoeService
                .getVaiTroList()
                .then((res) => {
                    setVaiTroList(Array.isArray(res.data) ? res.data : []);
                })
                .catch(() =>
                    setSnackbar({
                        open: true,
                        message: "Lỗi tải danh sách vai trò.",
                        severity: "error",
                    }),
                );
        }
    }, [open]);

    useEffect(() => {
        if (open) {
            if (schedule) {
                setThoiGianBatDau(schedule.thoi_gian_bat_dau || "");
                setThoiGianKetThuc(schedule.thoi_gian_ket_thuc || "");
                setThoiGianLayMauBatDau(
                    schedule.thoi_gian_lay_mau_bat_dau || "",
                );
                setThoiGianLayMauKetThuc(
                    schedule.thoi_gian_lay_mau_ket_thuc || "",
                );
                setThoiGianDuTruLayMauBatDau(
                    schedule.thoi_gian_du_tru_lay_mau_bat_dau || "",
                );
                setThoiGianDuTruLayMauKetThuc(
                    schedule.thoi_gian_du_tru_lay_mau_ket_thuc || "",
                );
                setThoiGianDuTruKhamBatDau(
                    schedule.thoi_gian_du_tru_kham_bat_dau || "",
                );
                setThoiGianDuTruKhamKetThuc(
                    schedule.thoi_gian_du_tru_kham_ket_thuc || "",
                );
                const init = {};
                const sel = {};
                for (const ct of chiTietList || []) {
                    init[ct.ma_don_vi] = {
                        thoi_gian_bat_dau: ct.thoi_gian_bat_dau || "",
                        thoi_gian_ket_thuc: ct.thoi_gian_ket_thuc || "",
                        thoi_gian_lay_mau_bat_dau: ct.thoi_gian_lay_mau_bat_dau || "",
                        thoi_gian_lay_mau_ket_thuc: ct.thoi_gian_lay_mau_ket_thuc || "",
                        thoi_gian_du_tru_lay_mau_bat_dau: ct.thoi_gian_du_tru_lay_mau_bat_dau || "",
                        thoi_gian_du_tru_lay_mau_ket_thuc: ct.thoi_gian_du_tru_lay_mau_ket_thuc || "",
                        thoi_gian_du_tru_kham_bat_dau: ct.thoi_gian_du_tru_kham_bat_dau || "",
                        thoi_gian_du_tru_kham_ket_thuc: ct.thoi_gian_du_tru_kham_ket_thuc || "",
                        dia_diem: ct.dia_diem || "",
                    };
                    sel[ct.ma_don_vi] = true;
                }
                setDetailData(init);
                setSelectedUnits(sel);
                // Load assignments hiện có
                khamSucKhoeService
                    .getAssignments(schedule.ma_lich_kham)
                    .then((res) => {
                        const list = Array.isArray(res.data) ? res.data : [];
                        setExistingAssignments(list);
                        const map = {};
                        for (const a of list) {
                            map[a.id_nguoi_dung] = a.ma_vai_tro;
                        }
                        setAssignments(map);
                    })
                    .catch(() =>
                        setSnackbar({
                            open: true,
                            message: "Lỗi tải phân công nhiệm vụ.",
                            severity: "error",
                        }),
                    );
            } else {
                setThoiGianBatDau("");
                setThoiGianKetThuc("");
                setThoiGianLayMauBatDau("");
                setThoiGianLayMauKetThuc("");
                setThoiGianDuTruLayMauBatDau("");
                setThoiGianDuTruLayMauKetThuc("");
                setThoiGianDuTruKhamBatDau("");
                setThoiGianDuTruKhamKetThuc("");
                setDetailData({});
                setSelectedUnits({});
                setAssignments({});
                setExistingAssignments([]);
            }
            setConfirmOpen(false);
            setConfirmMessage("");
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

    const handleToggleUnit = useCallback((maDonVi) => {
        setSelectedUnits((prev) => {
            const checked = !prev[maDonVi];
            if (!checked) {
                setDetailData((dd) => {
                    const next = { ...dd };
                    delete next[maDonVi];
                    return next;
                });
            }
            return { ...prev, [maDonVi]: checked };
        });
    }, []);

    const handleDetailChange = useCallback((maDonVi, field, value) => {
        setDetailData((prev) => ({
            ...prev,
            [maDonVi]: {
                ...(prev[maDonVi] || {
                    thoi_gian_bat_dau: "",
                    thoi_gian_ket_thuc: "",
                    thoi_gian_lay_mau_bat_dau: "",
                    thoi_gian_lay_mau_ket_thuc: "",
                    thoi_gian_du_tru_lay_mau_bat_dau: "",
                    thoi_gian_du_tru_lay_mau_ket_thuc: "",
                    thoi_gian_du_tru_kham_bat_dau: "",
                    thoi_gian_du_tru_kham_ket_thuc: "",
                    dia_diem: "",
                }),
                [field]: value,
            },
        }));
    }, []);

    const showError = useCallback((message) => {
        setSnackbar({ open: true, message, severity: "warning" });
    }, []);

    const buildDetails = useCallback(
        () =>
            Object.entries(detailData)
                .filter(
                    ([ma_don_vi, d]) =>
                        selectedUnits[ma_don_vi] &&
                        d.thoi_gian_bat_dau &&
                        d.thoi_gian_ket_thuc,
                )
                .map(([ma_don_vi, d]) => ({ ma_don_vi, ...d })),
        [detailData, selectedUnits],
    );

    const doSave = useCallback(async () => {
        setSaving(true);
        setSnackbar({ open: false, message: "", severity: "success" });
        try {
            const assignmentsList = Object.entries(assignments).map(
                ([id_nguoi_dung, ma_vai_tro]) => ({
                    id_nguoi_dung,
                    ma_vai_tro,
                }),
            );
            const payload = {
                thoi_gian_bat_dau: thoiGianBatDau,
                thoi_gian_ket_thuc: thoiGianKetThuc,
                thoi_gian_lay_mau_bat_dau: thoiGianLayMauBatDau,
                thoi_gian_lay_mau_ket_thuc: thoiGianLayMauKetThuc,
                thoi_gian_du_tru_lay_mau_bat_dau: thoiGianDuTruLayMauBatDau,
                thoi_gian_du_tru_lay_mau_ket_thuc: thoiGianDuTruLayMauKetThuc,
                thoi_gian_du_tru_kham_bat_dau: thoiGianDuTruKhamBatDau,
                thoi_gian_du_tru_kham_ket_thuc: thoiGianDuTruKhamKetThuc,
                details: buildDetails(),
                assignments: assignmentsList,
            };
            if (isEdit) {
                await khamSucKhoeService.replaceSchedule(
                    schedule.ma_lich_kham,
                    payload,
                );
            } else {
                await khamSucKhoeService.createSchedule(payload);
            }
            setSnackbar({
                open: true,
                message: "Đã lưu lịch khám.",
                severity: "success",
            });
            setTimeout(() => {
                onSaved();
                onClose();
            }, 400);
        } catch (err) {
            setSnackbar({
                open: true,
                message:
                    err.response?.data?.detail || "Không thể lưu lịch khám.",
                severity: "error",
            });
        } finally {
            setSaving(false);
        }
    }, [
        assignments,
        thoiGianBatDau,
        thoiGianKetThuc,
        thoiGianLayMauBatDau,
        thoiGianLayMauKetThuc,
        thoiGianDuTruLayMauBatDau,
        thoiGianDuTruLayMauKetThuc,
        thoiGianDuTruKhamBatDau,
        thoiGianDuTruKhamKetThuc,
        buildDetails,
        isEdit,
        schedule,
        onSaved,
        onClose,
    ]);

    const timeErrors = useMemo(() => {
        const e = {
            thoi_gian_bat_dau: "",
            thoi_gian_ket_thuc: "",
            thoi_gian_lay_mau_bat_dau: "",
            thoi_gian_lay_mau_ket_thuc: "",
            thoi_gian_du_tru_lay_mau_bat_dau: "",
            thoi_gian_du_tru_lay_mau_ket_thuc: "",
            thoi_gian_du_tru_kham_bat_dau: "",
            thoi_gian_du_tru_kham_ket_thuc: "",
        };

        const khamBd = thoiGianBatDau ? dayjs(thoiGianBatDau) : null;
        const khamKt = thoiGianKetThuc ? dayjs(thoiGianKetThuc) : null;
        const layMauBd = thoiGianLayMauBatDau
            ? dayjs(thoiGianLayMauBatDau)
            : null;
        const layMauKt = thoiGianLayMauKetThuc
            ? dayjs(thoiGianLayMauKetThuc)
            : null;

        const addErr = (field, msg) => {
            e[field] = e[field] ? e[field] + "; " + msg : msg;
        };

        const checkRange = (bdF, ktF, bd, kt, label) => {
            if (bd && kt && (kt.isBefore(bd) || kt.isSame(bd))) {
                const msg = `${label}: Kết thúc phải sau bắt đầu`;
                addErr(bdF, msg);
                addErr(ktF, msg);
            }
        };

        checkRange(
            "thoi_gian_bat_dau",
            "thoi_gian_ket_thuc",
            khamBd,
            khamKt,
            "Thời gian khám",
        );
        checkRange(
            "thoi_gian_lay_mau_bat_dau",
            "thoi_gian_lay_mau_ket_thuc",
            layMauBd,
            layMauKt,
            "Thời gian lấy máu",
        );

        const duTruLMBd = thoiGianDuTruLayMauBatDau
            ? dayjs(thoiGianDuTruLayMauBatDau)
            : null;
        const duTruLMKt = thoiGianDuTruLayMauKetThuc
            ? dayjs(thoiGianDuTruLayMauKetThuc)
            : null;
        checkRange(
            "thoi_gian_du_tru_lay_mau_bat_dau",
            "thoi_gian_du_tru_lay_mau_ket_thuc",
            duTruLMBd,
            duTruLMKt,
            "Dự trù lấy máu",
        );

        const duTruKBd = thoiGianDuTruKhamBatDau
            ? dayjs(thoiGianDuTruKhamBatDau)
            : null;
        const duTruKKt = thoiGianDuTruKhamKetThuc
            ? dayjs(thoiGianDuTruKhamKetThuc)
            : null;
        checkRange(
            "thoi_gian_du_tru_kham_bat_dau",
            "thoi_gian_du_tru_kham_ket_thuc",
            duTruKBd,
            duTruKKt,
            "Dự trù khám",
        );

        if (layMauBd && layMauKt && khamBd && khamKt) {
            if (layMauBd.isBefore(khamKt) && khamBd.isBefore(layMauKt)) {
                const msgLm = "Thời gian lấy máu trùng với thời gian khám";
                const msgKh = "Thời gian khám trùng với thời gian lấy máu";
                addErr("thoi_gian_lay_mau_bat_dau", msgLm);
                addErr("thoi_gian_lay_mau_ket_thuc", msgLm);
                addErr("thoi_gian_bat_dau", msgKh);
                addErr("thoi_gian_ket_thuc", msgKh);
            }
        } else {
            if (layMauBd && layMauKt && khamBd) {
                if ((khamBd.isAfter(layMauBd) || khamBd.isSame(layMauBd)) && khamBd.isBefore(layMauKt)) {
                    addErr(
                        "thoi_gian_bat_dau",
                        "Thời gian khám trùng với thời gian lấy máu",
                    );
                    addErr(
                        "thoi_gian_lay_mau_bat_dau",
                        "Thời gian lấy máu trùng với thời gian khám",
                    );
                    addErr(
                        "thoi_gian_lay_mau_ket_thuc",
                        "Thời gian lấy máu trùng với thời gian khám",
                    );
                }
            }
            if (layMauBd && layMauKt && khamKt) {
                if (khamKt.isAfter(layMauBd) && (khamKt.isBefore(layMauKt) || khamKt.isSame(layMauKt))) {
                    addErr(
                        "thoi_gian_ket_thuc",
                        "Thời gian khám trùng với thời gian lấy máu",
                    );
                    addErr(
                        "thoi_gian_lay_mau_bat_dau",
                        "Thời gian lấy máu trùng với thời gian khám",
                    );
                    addErr(
                        "thoi_gian_lay_mau_ket_thuc",
                        "Thời gian lấy máu trùng với thời gian khám",
                    );
                }
            }
            if (khamBd && khamKt && layMauBd) {
                if ((layMauBd.isAfter(khamBd) || layMauBd.isSame(khamBd)) && layMauBd.isBefore(khamKt)) {
                    addErr(
                        "thoi_gian_lay_mau_bat_dau",
                        "Thời gian lấy máu trùng với thời gian khám",
                    );
                    addErr(
                        "thoi_gian_bat_dau",
                        "Thời gian khám trùng với thời gian lấy máu",
                    );
                    addErr(
                        "thoi_gian_ket_thuc",
                        "Thời gian khám trùng với thời gian lấy máu",
                    );
                }
            }
            if (khamBd && khamKt && layMauKt) {
                if (layMauKt.isAfter(khamBd) && (layMauKt.isBefore(khamKt) || layMauKt.isSame(khamKt))) {
                    addErr(
                        "thoi_gian_lay_mau_ket_thuc",
                        "Thời gian lấy máu trùng với thời gian khám",
                    );
                    addErr(
                        "thoi_gian_bat_dau",
                        "Thời gian khám trùng với thời gian lấy máu",
                    );
                    addErr(
                        "thoi_gian_ket_thuc",
                        "Thời gian khám trùng với thời gian lấy máu",
                    );
                }
            }
        }

        for (const [bdF, ktF, bdV, ktV, label] of [
            [
                "thoi_gian_du_tru_lay_mau_bat_dau",
                "thoi_gian_du_tru_lay_mau_ket_thuc",
                thoiGianDuTruLayMauBatDau,
                thoiGianDuTruLayMauKetThuc,
                "Dự trù lấy máu",
            ],
            [
                "thoi_gian_du_tru_kham_bat_dau",
                "thoi_gian_du_tru_kham_ket_thuc",
                thoiGianDuTruKhamBatDau,
                thoiGianDuTruKhamKetThuc,
                "Dự trù khám",
            ],
        ]) {
            if (Boolean(bdV) !== Boolean(ktV)) {
                addErr(bdF, "Cần điền đầy đủ thời gian bắt đầu và kết thúc");
                addErr(ktF, "Cần điền đầy đủ thời gian bắt đầu và kết thúc");
            }
            const bd = bdV ? dayjs(bdV) : null;
            if (bd && khamKt && bd.isBefore(khamKt)) {
                const msg = `${label} phải sau thời gian khám và không được trùng thời gian khám`;
                addErr(bdF, msg);
                addErr(ktF, msg);
            }
        }

        if (duTruLMBd && duTruLMKt && duTruKBd && duTruKKt) {
            if (duTruLMBd.isBefore(duTruKKt) && duTruKBd.isBefore(duTruLMKt)) {
                const msgLm = "Dự trù lấy máu trùng với dự trù khám";
                const msgKh = "Dự trù khám trùng với dự trù lấy máu";
                addErr("thoi_gian_du_tru_lay_mau_bat_dau", msgLm);
                addErr("thoi_gian_du_tru_lay_mau_ket_thuc", msgLm);
                addErr("thoi_gian_du_tru_kham_bat_dau", msgKh);
                addErr("thoi_gian_du_tru_kham_ket_thuc", msgKh);
            }
        } else {
            if (duTruLMBd && duTruLMKt && duTruKBd) {
                if ((duTruKBd.isAfter(duTruLMBd) || duTruKBd.isSame(duTruLMBd)) && duTruKBd.isBefore(duTruLMKt)) {
                    addErr(
                        "thoi_gian_du_tru_kham_bat_dau",
                        "Dự trù khám trùng với dự trù lấy máu",
                    );
                    addErr(
                        "thoi_gian_du_tru_lay_mau_bat_dau",
                        "Dự trù lấy máu trùng với dự trù khám",
                    );
                    addErr(
                        "thoi_gian_du_tru_lay_mau_ket_thuc",
                        "Dự trù lấy máu trùng với dự trù khám",
                    );
                }
            }
            if (duTruLMBd && duTruLMKt && duTruKKt) {
                if (duTruKKt.isAfter(duTruLMBd) && (duTruKKt.isBefore(duTruLMKt) || duTruKKt.isSame(duTruLMKt))) {
                    addErr(
                        "thoi_gian_du_tru_kham_ket_thuc",
                        "Dự trù khám trùng với dự trù lấy máu",
                    );
                    addErr(
                        "thoi_gian_du_tru_lay_mau_bat_dau",
                        "Dự trù lấy máu trùng với dự trù khám",
                    );
                    addErr(
                        "thoi_gian_du_tru_lay_mau_ket_thuc",
                        "Dự trù lấy máu trùng với dự trù khám",
                    );
                }
            }
            if (duTruKBd && duTruKKt && duTruLMBd) {
                if ((duTruLMBd.isAfter(duTruKBd) || duTruLMBd.isSame(duTruKBd)) && duTruLMBd.isBefore(duTruKKt)) {
                    addErr(
                        "thoi_gian_du_tru_lay_mau_bat_dau",
                        "Dự trù lấy máu trùng với dự trù khám",
                    );
                    addErr(
                        "thoi_gian_du_tru_kham_bat_dau",
                        "Dự trù khám trùng với dự trù lấy máu",
                    );
                    addErr(
                        "thoi_gian_du_tru_kham_ket_thuc",
                        "Dự trù khám trùng với dự trù lấy máu",
                    );
                }
            }
            if (duTruKBd && duTruKKt && duTruLMKt) {
                if (duTruLMKt.isAfter(duTruKBd) && (duTruLMKt.isBefore(duTruKKt) || duTruLMKt.isSame(duTruKKt))) {
                    addErr(
                        "thoi_gian_du_tru_lay_mau_ket_thuc",
                        "Dự trù lấy máu trùng với dự trù khám",
                    );
                    addErr(
                        "thoi_gian_du_tru_kham_bat_dau",
                        "Dự trù khám trùng với dự trù lấy máu",
                    );
                    addErr(
                        "thoi_gian_du_tru_kham_ket_thuc",
                        "Dự trù khám trùng với dự trù lấy máu",
                    );
                }
            }
        }

        return e;
    }, [
        thoiGianBatDau,
        thoiGianKetThuc,
        thoiGianLayMauBatDau,
        thoiGianLayMauKetThuc,
        thoiGianDuTruLayMauBatDau,
        thoiGianDuTruLayMauKetThuc,
        thoiGianDuTruKhamBatDau,
        thoiGianDuTruKhamKetThuc,
    ]);

    const detailErrors = useMemo(() => {
        const errors = {};

        const checkBounds = (valStr, masterBdStr, masterKtStr, label) => {
            if (!valStr) return "";
            const val = dayjs(valStr);
            if (masterBdStr) {
                const masterBd = dayjs(masterBdStr);
                if (val.isBefore(masterBd)) {
                    return `Không được trước thời gian bắt đầu ${label} của lịch năm`;
                }
            }
            if (masterKtStr) {
                const masterKt = dayjs(masterKtStr);
                if (val.isAfter(masterKt)) {
                    return `Không được sau thời gian kết thúc ${label} của lịch năm`;
                }
            }
            return "";
        };

        const checkRange = (bdStr, ktStr, label) => {
            if (bdStr && ktStr) {
                const bd = dayjs(bdStr);
                const kt = dayjs(ktStr);
                if (kt.isBefore(bd) || kt.isSame(bd)) {
                    return `Thời gian kết thúc ${label} phải sau thời gian bắt đầu`;
                }
            }
            return "";
        };

        Object.keys(selectedUnits).forEach((maDonVi) => {
            if (!selectedUnits[maDonVi]) return;
            const d = detailData[maDonVi] || {};
            const unitErrs = {
                thoi_gian_lay_mau_bat_dau: "",
                thoi_gian_lay_mau_ket_thuc: "",
                thoi_gian_bat_dau: "",
                thoi_gian_ket_thuc: "",
                thoi_gian_du_tru_lay_mau_bat_dau: "",
                thoi_gian_du_tru_lay_mau_ket_thuc: "",
                thoi_gian_du_tru_kham_bat_dau: "",
                thoi_gian_du_tru_kham_ket_thuc: "",
            };

            const rangeLm = checkRange(d.thoi_gian_lay_mau_bat_dau, d.thoi_gian_lay_mau_ket_thuc, "lấy máu");
            if (rangeLm) {
                unitErrs.thoi_gian_lay_mau_bat_dau = rangeLm;
                unitErrs.thoi_gian_lay_mau_ket_thuc = rangeLm;
            }
            const rangeKh = checkRange(d.thoi_gian_bat_dau, d.thoi_gian_ket_thuc, "khám");
            if (rangeKh) {
                unitErrs.thoi_gian_bat_dau = rangeKh;
                unitErrs.thoi_gian_ket_thuc = rangeKh;
            }
            const rangeDtLm = checkRange(d.thoi_gian_du_tru_lay_mau_bat_dau, d.thoi_gian_du_tru_lay_mau_ket_thuc, "dự trù lấy máu");
            if (rangeDtLm) {
                unitErrs.thoi_gian_du_tru_lay_mau_bat_dau = rangeDtLm;
                unitErrs.thoi_gian_du_tru_lay_mau_ket_thuc = rangeDtLm;
            }
            const rangeDtKh = checkRange(d.thoi_gian_du_tru_kham_bat_dau, d.thoi_gian_du_tru_kham_ket_thuc, "dự trù khám");
            if (rangeDtKh) {
                unitErrs.thoi_gian_du_tru_kham_bat_dau = rangeDtKh;
                unitErrs.thoi_gian_du_tru_kham_ket_thuc = rangeDtKh;
            }

            const bLmBd = checkBounds(d.thoi_gian_lay_mau_bat_dau, thoiGianLayMauBatDau, thoiGianLayMauKetThuc, "lấy máu");
            if (bLmBd) unitErrs.thoi_gian_lay_mau_bat_dau = bLmBd;
            const bLmKt = checkBounds(d.thoi_gian_lay_mau_ket_thuc, thoiGianLayMauBatDau, thoiGianLayMauKetThuc, "lấy máu");
            if (bLmKt) unitErrs.thoi_gian_lay_mau_ket_thuc = bLmKt;

            const bKhBd = checkBounds(d.thoi_gian_bat_dau, thoiGianBatDau, thoiGianKetThuc, "khám");
            if (bKhBd) unitErrs.thoi_gian_bat_dau = bKhBd;
            const bKhKt = checkBounds(d.thoi_gian_ket_thuc, thoiGianBatDau, thoiGianKetThuc, "khám");
            if (bKhKt) unitErrs.thoi_gian_ket_thuc = bKhKt;

            const bDtLmBd = checkBounds(d.thoi_gian_du_tru_lay_mau_bat_dau, thoiGianDuTruLayMauBatDau, thoiGianDuTruLayMauKetThuc, "dự trù lấy máu");
            if (bDtLmBd) unitErrs.thoi_gian_du_tru_lay_mau_bat_dau = bDtLmBd;
            const bDtLmKt = checkBounds(d.thoi_gian_du_tru_lay_mau_ket_thuc, thoiGianDuTruLayMauBatDau, thoiGianDuTruLayMauKetThuc, "dự trù lấy máu");
            if (bDtLmKt) unitErrs.thoi_gian_du_tru_lay_mau_ket_thuc = bDtLmKt;

            const bDtKhBd = checkBounds(d.thoi_gian_du_tru_kham_bat_dau, thoiGianDuTruKhamBatDau, thoiGianDuTruKhamKetThuc, "dự trù khám");
            if (bDtKhBd) unitErrs.thoi_gian_du_tru_kham_bat_dau = bDtKhBd;
            const bDtKhKt = checkBounds(d.thoi_gian_du_tru_kham_ket_thuc, thoiGianDuTruKhamBatDau, thoiGianDuTruKhamKetThuc, "dự trù khám");
            if (bDtKhKt) unitErrs.thoi_gian_du_tru_kham_ket_thuc = bDtKhKt;

            if (Object.values(unitErrs).some(x => x !== "")) {
                errors[maDonVi] = unitErrs;
            }
        });

        return errors;
    }, [
        selectedUnits,
        detailData,
        thoiGianBatDau,
        thoiGianKetThuc,
        thoiGianLayMauBatDau,
        thoiGianLayMauKetThuc,
        thoiGianDuTruLayMauBatDau,
        thoiGianDuTruLayMauKetThuc,
        thoiGianDuTruKhamBatDau,
        thoiGianDuTruKhamKetThuc,
    ]);

    const duTruConfig = useCallback(
        () => [
            {
                label: "Thời gian dự trù lấy máu",
                bd: thoiGianDuTruLayMauBatDau,
                kt: thoiGianDuTruLayMauKetThuc,
            },
            {
                label: "Thời gian dự trù khám sức khỏe",
                bd: thoiGianDuTruKhamBatDau,
                kt: thoiGianDuTruKhamKetThuc,
            },
        ],
        [
            thoiGianDuTruLayMauBatDau,
            thoiGianDuTruLayMauKetThuc,
            thoiGianDuTruKhamBatDau,
            thoiGianDuTruKhamKetThuc,
        ],
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!thoiGianBatDau || !thoiGianKetThuc) {
            showError(
                "Vui lòng điền đầy đủ thời gian khám chính (bắt đầu, kết thúc).",
            );
            return;
        }
        if (!thoiGianLayMauBatDau || !thoiGianLayMauKetThuc) {
            showError(
                "Vui lòng điền đầy đủ thời gian lấy máu (bắt đầu, kết thúc).",
            );
            return;
        }

        const khamBd = dayjs(thoiGianBatDau);
        const khamKt = dayjs(thoiGianKetThuc);
        const layMauBd = dayjs(thoiGianLayMauBatDau);
        const layMauKt = dayjs(thoiGianLayMauKetThuc);

        if (layMauKt <= layMauBd) {
            showError("Thời gian kết thúc lấy máu phải sau thời gian bắt đầu.");
            return;
        }
        if (layMauBd < khamKt && khamBd < layMauKt) {
            showError("Thời gian lấy máu không được trùng với thời gian khám.");
            return;
        }

        for (const dt of duTruConfig()) {
            if (Boolean(dt.bd) !== Boolean(dt.kt)) {
                showError(
                    `${dt.label}: phải điền đầy đủ thời gian bắt đầu và kết thúc.`,
                );
                return;
            }
            if (dt.bd && dt.kt) {
                if (dayjs(dt.kt) <= dayjs(dt.bd)) {
                    showError(
                        `${dt.label}: thời gian kết thúc phải sau thời gian bắt đầu.`,
                    );
                    return;
                }
                if (dayjs(dt.bd) < khamKt) {
                    showError(
                        `${dt.label} phải sau thời gian khám và không được trùng thời gian khám.`,
                    );
                    return;
                }
            }
        }

        const duTruLMBd = thoiGianDuTruLayMauBatDau
            ? dayjs(thoiGianDuTruLayMauBatDau)
            : null;
        const duTruLMKt = thoiGianDuTruLayMauKetThuc
            ? dayjs(thoiGianDuTruLayMauKetThuc)
            : null;
        const duTruKBd = thoiGianDuTruKhamBatDau
            ? dayjs(thoiGianDuTruKhamBatDau)
            : null;
        const duTruKKt = thoiGianDuTruKhamKetThuc
            ? dayjs(thoiGianDuTruKhamKetThuc)
            : null;

        if (duTruLMBd && duTruLMKt && duTruKBd && duTruKKt) {
            if (duTruLMBd < duTruKKt && duTruKBd < duTruLMKt) {
                showError(
                    "Thời gian dự trù lấy máu không được trùng với thời gian dự trù khám.",
                );
                return;
            }
        }

        if (Object.keys(detailErrors).length > 0) {
            showError("Vui lòng sửa các lỗi thời gian tại danh sách đơn vị trước khi lưu.");
            return;
        }

        const details = buildDetails();
        if (details.length === 0) {
            showError("Vui lòng nhập ít nhất một đơn vị có thời gian.");
            return;
        }

        const assignedRoles = Object.values(assignments);
        const missingRoles = vaiTroList.filter(
            (vt) => !assignedRoles.includes(vt.ma_vai_tro),
        );
        if (missingRoles.length > 0) {
            showError(
                `Vai trò chưa được phân công: ${missingRoles
                    .map((m) => m.ten_vai_tro)
                    .join(", ")}.`,
            );
            return;
        }

        const duTruThieu = duTruConfig().some((dt) => !dt.bd || !dt.kt);
        const chuaChonHetDonVi =
            Object.keys(selectedUnits).length < unitOptions.length;
        if (duTruThieu || chuaChonHetDonVi) {
            const items = [];
            if (duTruThieu) items.push("Chưa điền đầy đủ thời gian dự trù");
            if (chuaChonHetDonVi) items.push("Chưa chọn hết đơn vị");
            setConfirmMessage(`${items.join(" và ")}. Bạn vẫn muốn lưu?`);
            setConfirmOpen(true);
            return;
        }

        doSave();
    };

    const handleAutoDistribute = useCallback(() => {
        if (!thoiGianBatDau || !thoiGianKetThuc) {
            showError("Vui lòng điền đầy đủ thời gian khám chính (Thông tin chung) trước để làm mốc phân chia.");
            return;
        }
        if (!thoiGianLayMauBatDau || !thoiGianLayMauKetThuc) {
            showError("Vui lòng điền đầy đủ thời gian lấy máu (Thông tin chung) trước để làm mốc phân chia.");
            return;
        }

        const checkedUnits = Object.keys(selectedUnits).filter((k) => selectedUnits[k]);
        if (checkedUnits.length === 0) {
            showError("Vui lòng chọn ít nhất một đơn vị để phân chia.");
            return;
        }

        const buildDaysList = (startStr, endStr) => {
            if (!startStr || !endStr) return [];
            const start = dayjs(startStr).startOf("day");
            const end = dayjs(endStr).startOf("day");
            const list = [];
            let curr = start;
            while (curr.isBefore(end) || curr.isSame(end)) {
                list.push(curr.format("YYYY-MM-DD"));
                curr = curr.add(1, "day");
            }
            return list;
        };

        const daysList = buildDaysList(thoiGianBatDau, thoiGianKetThuc);
        if (daysList.length === 0) {
            daysList.push(dayjs(thoiGianBatDau).format("YYYY-MM-DD"));
        }

        const dtLmDaysList = buildDaysList(thoiGianDuTruLayMauBatDau, thoiGianDuTruLayMauKetThuc);
        const dtKhDaysList = buildDaysList(thoiGianDuTruKhamBatDau, thoiGianDuTruKhamKetThuc);

        const getTimePart = (isoStr, defaultPart) => {
            if (!isoStr) return defaultPart;
            const parts = isoStr.split("T");
            return parts[1] || defaultPart;
        };

        const lmBdTime = getTimePart(thoiGianLayMauBatDau, "06:00");
        const lmKtTime = getTimePart(thoiGianLayMauKetThuc, "17:00");
        const khBdTime = getTimePart(thoiGianBatDau, "06:00");
        const khKtTime = getTimePart(thoiGianKetThuc, "17:00");

        const dtLmBdTime = getTimePart(thoiGianDuTruLayMauBatDau, "06:00");
        const dtLmKtTime = getTimePart(thoiGianDuTruLayMauKetThuc, "17:00");
        const dtKhBdTime = getTimePart(thoiGianDuTruKhamBatDau, "06:00");
        const dtKhKtTime = getTimePart(thoiGianDuTruKhamKetThuc, "17:00");

        const startDay = dayjs(thoiGianBatDau).startOf("day");
        const lmOffset = dayjs(thoiGianLayMauBatDau).startOf("day").diff(startDay, "day");

        const nextDetailData = { ...detailData };

        checkedUnits.forEach((maDonVi, index) => {
            const dayIdx = index % daysList.length;
            const examDate = daysList[dayIdx];
            const bloodDate = dayjs(examDate).add(lmOffset, "day").format("YYYY-MM-DD");

            const unitData = {
                thoi_gian_bat_dau: `${examDate}T${khBdTime}`,
                thoi_gian_ket_thuc: `${examDate}T${khKtTime}`,
                thoi_gian_lay_mau_bat_dau: `${bloodDate}T${lmBdTime}`,
                thoi_gian_lay_mau_ket_thuc: `${bloodDate}T${lmKtTime}`,
                thoi_gian_du_tru_lay_mau_bat_dau: "",
                thoi_gian_du_tru_lay_mau_ket_thuc: "",
                thoi_gian_du_tru_kham_bat_dau: "",
                thoi_gian_du_tru_kham_ket_thuc: "",
                dia_diem: detailData[maDonVi]?.dia_diem || "",
            };

            if (dtLmDaysList.length > 0) {
                const dtLmDate = dtLmDaysList[index % dtLmDaysList.length];
                unitData.thoi_gian_du_tru_lay_mau_bat_dau = `${dtLmDate}T${dtLmBdTime}`;
                unitData.thoi_gian_du_tru_lay_mau_ket_thuc = `${dtLmDate}T${dtLmKtTime}`;
            }

            if (dtKhDaysList.length > 0) {
                const dtKhDate = dtKhDaysList[index % dtKhDaysList.length];
                unitData.thoi_gian_du_tru_kham_bat_dau = `${dtKhDate}T${dtKhBdTime}`;
                unitData.thoi_gian_du_tru_kham_ket_thuc = `${dtKhDate}T${dtKhKtTime}`;
            }

            nextDetailData[maDonVi] = unitData;
        });

        setDetailData(nextDetailData);
        setSnackbar({
            open: true,
            message: "Đã tự động phân chia thời gian khám cho các đơn vị.",
            severity: "success",
        });
    }, [
        thoiGianBatDau,
        thoiGianKetThuc,
        thoiGianLayMauBatDau,
        thoiGianLayMauKetThuc,
        thoiGianDuTruLayMauBatDau,
        thoiGianDuTruLayMauKetThuc,
        thoiGianDuTruKhamBatDau,
        thoiGianDuTruKhamKetThuc,
        selectedUnits,
        detailData,
        showError,
    ]);

    const handleConfirmSave = useCallback(() => {
        setConfirmOpen(false);
        doSave();
    }, [doSave]);

    const handleCloseConfirm = useCallback(() => {
        setConfirmOpen(false);
    }, []);

    return {
        thoiGianBatDau,
        setThoiGianBatDau,
        thoiGianKetThuc,
        setThoiGianKetThuc,
        thoiGianLayMauBatDau,
        setThoiGianLayMauBatDau,
        thoiGianLayMauKetThuc,
        setThoiGianLayMauKetThuc,
        thoiGianDuTruLayMauBatDau,
        setThoiGianDuTruLayMauBatDau,
        thoiGianDuTruLayMauKetThuc,
        setThoiGianDuTruLayMauKetThuc,
        thoiGianDuTruKhamBatDau,
        setThoiGianDuTruKhamBatDau,
        thoiGianDuTruKhamKetThuc,
        setThoiGianDuTruKhamKetThuc,
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
        selectedUnits,
        handleToggleUnit,
        confirmOpen,
        confirmMessage,
        handleConfirmSave,
        handleCloseConfirm,
        timeErrors,
        detailErrors,
        handleAutoDistribute,
    };
}

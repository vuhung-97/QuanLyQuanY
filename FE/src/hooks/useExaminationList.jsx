import { useCallback, useEffect, useMemo, useState } from "react";
import useDebounce from "./useDebounce.jsx";
import { khamBenhService } from "../services/khamBenhService.js";

export default function useExaminationList() {
    const [examinations, setExaminations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const debouncedSearchText = useDebounce(searchText);

    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

    const [openExamForm, setOpenExamForm] = useState(false);
    const [selectedExamId, setSelectedExamId] = useState(null);

    const [openHistory, setOpenHistory] = useState(false);
    const [historyQnId, setHistoryQnId] = useState(null);
    const [historyQnName, setHistoryQnName] = useState("");

    const [openReceiveDialog, setOpenReceiveDialog] = useState(false);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await khamBenhService.getHomNay();
            setExaminations(res.data || []);
        } catch (err) {
            setSnackbar({
                open: true,
                message: err.response?.data?.detail || "Lỗi tải danh sách ca khám.",
                severity: "error",
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadData(); }, [loadData]);

    const filtered = useMemo(() => {
        if (!debouncedSearchText) return examinations;
        const q = debouncedSearchText.toLowerCase();
        return examinations.filter(
            (e) =>
                (e.ma_kham_benh || "").toLowerCase().includes(q) ||
                (e.ho_ten || "").toLowerCase().includes(q) ||
                (e.ten_don_vi || "").toLowerCase().includes(q),
        );
    }, [examinations, debouncedSearchText]);

    const statusCounts = useMemo(() => {
        const count = (status) => examinations.filter((e) => e.trang_thai === status).length;
        return {
            cho: count("chờ"),
            dangKham: count("đang_khám"),
            daXong: count("đã_khám") + count("chờ_nhận_thuốc") + count("đã_nhận_thuốc"),
            chuyenTuyen: count("chuyển_tuyến") + count("nhập_viện"),
        };
    }, [examinations]);

    const handleDeleteClick = useCallback((id) => {
        setConfirmDelete({ open: true, id });
    }, []);

    const handleDeleteConfirm = useCallback(async () => {
        try {
            await khamBenhService.delete(confirmDelete.id);
            setConfirmDelete({ open: false, id: null });
            setSnackbar({ open: true, message: "Đã xóa ca khám.", severity: "success" });
            loadData();
        } catch (err) {
            setSnackbar({
                open: true,
                message: err.response?.data?.detail || "Lỗi xóa ca khám.",
                severity: "error",
            });
        }
    }, [confirmDelete.id, loadData]);

    const handleSelectQN = useCallback(async (qn) => {
        try {
            await khamBenhService.create({ ma_quan_nhan: qn.ma_quan_nhan });
            setOpenReceiveDialog(false);
            setSnackbar({ open: true, message: `Đã tiếp nhận ${qn.ho_ten} thành công.`, severity: "success" });
            loadData();
        } catch (err) {
            setSnackbar({
                open: true,
                message: err.response?.data?.detail || "Lỗi tiếp nhận quân nhân.",
                severity: "error",
            });
        }
    }, [loadData]);

    const handleOpenExamForm = useCallback((id) => {
        setSelectedExamId(id);
        setOpenExamForm(true);
    }, []);

    const handleCloseExamForm = useCallback(() => {
        setOpenExamForm(false);
        setSelectedExamId(null);
    }, []);

    const handleOpenHistory = useCallback(() => {
        setHistoryQnId("");
        setHistoryQnName("");
        setOpenHistory(true);
    }, []);

    const handleCloseHistory = useCallback(() => {
        setOpenHistory(false);
    }, []);

    return {
        loading,
        searchText,
        setSearchText,
        filtered,
        statusCounts,
        snackbar,
        setSnackbar,
        confirmDelete,
        handleDeleteClick,
        handleDeleteConfirm,
        openExamForm,
        selectedExamId,
        handleOpenExamForm,
        handleCloseExamForm,
        openHistory,
        historyQnId,
        historyQnName,
        handleOpenHistory,
        handleCloseHistory,
        openReceiveDialog,
        setOpenReceiveDialog,
        handleSelectQN,
        loadData,
    };
}

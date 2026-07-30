import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";

import useFilterModePagination from "./useFilterModePagination.jsx";
import { khamBenhService } from "@/services/khamBenhService.js";

export default function useDanhSachKhamBenh() {
    const [examinations, setExaminations] = useState([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [nam, setNam] = useState(null);
    const [thang, setThang] = useState(null);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const {
        isLeft,
        handleFilterModeChange,
        page,
        setPage,
        totalRecords,
        setTotalRecords,
        ROWS_PER_PAGE,
        offset,
    } = useFilterModePagination();

    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

    const [openExamForm, setOpenExamForm] = useState(false);
    const [selectedExamId, setSelectedExamId] = useState(null);

    const [openHistory, setOpenHistory] = useState(false);
    const [historyQnId, setHistoryQnId] = useState(null);
    const [historyQnName, setHistoryQnName] = useState("");

    const [openReceiveDialog, setOpenReceiveDialog] = useState(false);

    const loadData = useCallback(async () => {
        setRefreshing(true);
        try {
            if (!isLeft) {
                const ngay = selectedDate.format("YYYY-MM-DD");
                const res = await khamBenhService.getHomNay(ngay);
                setExaminations(res.data || []);
                setTotalRecords(0);
            } else {
                const params = { limit: ROWS_PER_PAGE, offset };
                if (nam) params.nam = nam;
                if (thang) params.thang = thang;
                const res = await khamBenhService.getAll(params);
                setExaminations(res.data.data || []);
                setTotalRecords(res.data.total || 0);
            }
        } catch (err) {
            setSnackbar({
                open: true,
                message: err.response?.data?.detail || "Lỗi tải danh sách ca khám.",
                severity: "error",
            });
        } finally {
            setRefreshing(false);
            setInitialLoading(false);
        }
    }, [isLeft, selectedDate, offset, ROWS_PER_PAGE, nam, thang]);

    useEffect(() => { loadData(); }, [loadData]);

    const filtered = useMemo(() => {
        let result = examinations;
        if (statusFilter) {
            result = result.filter((e) => e.trang_thai === statusFilter);
        }
        if (searchText) {
            const q = searchText.toLowerCase();
            result = result.filter(
                (e) =>
                    (e.ma_kham_benh || "").toLowerCase().includes(q) ||
                    (e.ho_ten || "").toLowerCase().includes(q) ||
                    (e.ten_don_vi || "").toLowerCase().includes(q),
            );
        }
        return result;
    }, [examinations, searchText, statusFilter]);

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

    const handleDeleteCancel = useCallback(() => {
        setConfirmDelete({ open: false, id: null });
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

    const handleFilterThangChange = useCallback((value) => {
        setThang(value || null);
        setPage(1);
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
        initialLoading,
        refreshing,
        searchText,
        setSearchText,
        statusFilter,
        setStatusFilter,
        filtered,
        selectedDate,
        setSelectedDate,
        statusCounts,
        snackbar,
        setSnackbar,
        confirmDelete,
        handleDeleteClick,
        handleDeleteCancel,
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
        isLeft,
        handleFilterModeChange,
        page,
        setPage,
        totalRecords,
        ROWS_PER_PAGE,
        offset,
        nam,
        setNam,
        thang,
        setThang,
        handleFilterThangChange,
    };
}

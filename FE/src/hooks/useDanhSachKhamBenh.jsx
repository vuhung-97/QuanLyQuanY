import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { khamBenhService } from "@/services/khamBenhService.js";
import useExamList from "./useExamList.jsx";

export default function useDanhSachKhamBenh() {
    const [searchParams] = useSearchParams();
    const {
        examinations,
        initialLoading,
        refreshing,
        setSearchText,
        statusFilter,
        setStatusFilter,
        filtered,
        snackbar,
        setSnackbar,
        loadData,
        isLeft,
        handleFilterModeChange,
        page,
        setPage,
        totalRecords,
        ROWS_PER_PAGE,
        offset,
        selectedDate,
        setSelectedDate,
        nam,
        setNam,
        thang,
        setThang,
        handleFilterThangChange,
    } = useExamList({
        loadErrorMessage: "Lỗi tải danh sách ca khám.",
        initialIsLeft: searchParams.get("all") === "1",
        initialStatus: searchParams.get("filter") || "",
        fetchData: async ({ isLeft, selectedDate, offset, limit, nam, thang }) => {
            if (!isLeft) {
                const ngay = selectedDate.format("YYYY-MM-DD");
                const res = await khamBenhService.getHomNay(ngay);
                return { list: res.data || [], total: 0 };
            }
            const params = { limit, offset };
            if (nam) params.nam = nam;
            if (thang) params.thang = thang;
            const res = await khamBenhService.getAll(params);
            return { list: res.data.data || [], total: res.data.total || 0 };
        },
    });

    const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

    const [openExamForm, setOpenExamForm] = useState(false);
    const [selectedExamId, setSelectedExamId] = useState(null);

    const [openHistory, setOpenHistory] = useState(false);
    const [historyQnId, setHistoryQnId] = useState(null);
    const [historyQnName, setHistoryQnName] = useState("");

    const [openReceiveDialog, setOpenReceiveDialog] = useState(false);

    const statusCounts = useMemo(() => {
        const count = (status) =>
            examinations.filter((e) => e.trang_thai === status).length;
        return {
            cho: count("chờ"),
            dangKham: count("đang_khám"),
            daXong:
                count("đã_khám") +
                count("chờ_nhận_thuốc") +
                count("đã_nhận_thuốc"),
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
            setSnackbar({
                open: true,
                message: "Đã xóa ca khám.",
                severity: "success",
            });
            loadData();
        } catch (err) {
            setSnackbar({
                open: true,
                message: err.response?.data?.detail || "Lỗi xóa ca khám.",
                severity: "error",
            });
        }
    }, [confirmDelete.id, loadData, setSnackbar]);

    const handleSelectQN = useCallback(
        async (qn) => {
            try {
                await khamBenhService.create({ ma_quan_nhan: qn.ma_quan_nhan });
                setOpenReceiveDialog(false);
                setSnackbar({
                    open: true,
                    message: `Đã tiếp nhận ${qn.ho_ten} thành công.`,
                    severity: "success",
                });
                loadData();
            } catch (err) {
                setSnackbar({
                    open: true,
                    message:
                        err.response?.data?.detail ||
                        "Lỗi tiếp nhận quân nhân.",
                    severity: "error",
                });
            }
        },
        [loadData, setSnackbar],
    );

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
        initialLoading,
        refreshing,
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

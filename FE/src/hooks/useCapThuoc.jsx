import { useCallback, useState } from "react";

import { khamBenhService } from "@/services/khamBenhService.js";
import { clearThuocCache } from "./useThuocList.jsx";
import useExamList from "./useExamList.jsx";

const STATUSES = ["chờ_nhận_thuốc", "đã_nhận_thuốc"];

export default function useCapThuoc() {
    const {
        examinations,
        baseList,
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
    } = useExamList({
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
        subset: (list) => list.filter((e) => STATUSES.includes(e.trang_thai)),
    });

    const [selectedExam, setSelectedExam] = useState(null);
    const [examDetail, setExamDetail] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [openForm, setOpenForm] = useState(false);
    const [dispensing, setDispensing] = useState(false);

    const stats = {
        choCap: baseList.filter((e) => e.trang_thai === "chờ_nhận_thuốc")
            .length,
        daNhan: baseList.filter((e) => e.trang_thai === "đã_nhận_thuốc")
            .length,
    };

    const handleOpenForm = useCallback(
        async (id) => {
            const exam = examinations.find((e) => e.ma_kham_benh === id);
            setSelectedExam(exam);
            setDetailLoading(true);
            setOpenForm(true);
            try {
                const res = await khamBenhService.getDetail(id);
                setExamDetail(res.data);
            } catch (err) {
                setSnackbar({
                    open: true,
                    message:
                        err.response?.data?.detail ||
                        "Lỗi tải chi tiết đơn thuốc.",
                    severity: "error",
                });
                setOpenForm(false);
            } finally {
                setDetailLoading(false);
            }
        },
        [examinations, setSnackbar],
    );

    const handleCloseForm = useCallback(() => {
        setOpenForm(false);
        setSelectedExam(null);
        setExamDetail(null);
    }, []);

    const handleDispense = useCallback(async () => {
        if (!selectedExam) return;
        setDispensing(true);
        try {
            await khamBenhService.receiveMedicine(selectedExam.ma_kham_benh);
            clearThuocCache();
            setSnackbar({
                open: true,
                message: `Đã cấp thuốc cho ${selectedExam.ho_ten} thành công.`,
                severity: "success",
            });
            handleCloseForm();
            loadData();
        } catch (err) {
            setSnackbar({
                open: true,
                message: err.response?.data?.detail || "Lỗi cấp thuốc.",
                severity: "error",
            });
        } finally {
            setDispensing(false);
        }
    }, [selectedExam, handleCloseForm, loadData, setSnackbar]);

    return {
        initialLoading,
        refreshing,
        selectedDate,
        setSelectedDate,
        setSearchText,
        statusFilter,
        setStatusFilter,
        filtered,
        stats,
        snackbar,
        setSnackbar,
        selectedExam,
        examDetail,
        detailLoading,
        openForm,
        handleOpenForm,
        handleCloseForm,
        handleDispense,
        dispensing,
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
    };
}

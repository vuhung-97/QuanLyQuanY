import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import useDebounce from "./useDebounce.jsx";
import useFilterModePagination from "./useFilterModePagination.jsx";
import { khamBenhService } from "@/services/khamBenhService.js";

export default function useCapThuoc() {
    const [examinations, setExaminations] = useState([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [searchText, setSearchText] = useState("");
    const [nam, setNam] = useState(null);
    const debouncedSearchText = useDebounce(searchText);
    const {
        filterMode,
        handleFilterModeChange,
        page,
        setPage,
        totalRecords,
        setTotalRecords,
        ROWS_PER_PAGE,
        offset,
    } = useFilterModePagination();
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const [selectedExam, setSelectedExam] = useState(null);
    const [examDetail, setExamDetail] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [openForm, setOpenForm] = useState(false);
    const [dispensing, setDispensing] = useState(false);

    const loadData = useCallback(async () => {
        setRefreshing(true);
        try {
            if (filterMode === "theo_ngay") {
                const ngay = selectedDate.format("YYYY-MM-DD");
                const res = await khamBenhService.getHomNay(ngay);
                setExaminations(res.data || []);
                setTotalRecords(0);
            } else {
                const params = { limit: ROWS_PER_PAGE, offset };
                if (nam) params.nam = nam;
                const res = await khamBenhService.getAll(params);
                setExaminations(res.data.data || []);
                setTotalRecords(res.data.total || 0);
            }
        } catch (err) {
            setSnackbar({
                open: true,
                message: err.response?.data?.detail || "Lỗi tải danh sách.",
                severity: "error",
            });
        } finally {
            setRefreshing(false);
            setInitialLoading(false);
        }
    }, [filterMode, selectedDate, offset, ROWS_PER_PAGE, nam]);

    useEffect(() => { loadData(); }, [loadData]);

    const patients = useMemo(() => {
        return examinations.filter(
            (e) => e.trang_thai === "chờ_nhận_thuốc" || e.trang_thai === "đã_nhận_thuốc",
        );
    }, [examinations]);

    const stats = useMemo(() => {
        return {
            choCap: patients.filter((e) => e.trang_thai === "chờ_nhận_thuốc").length,
            daNhan: patients.filter((e) => e.trang_thai === "đã_nhận_thuốc").length,
        };
    }, [patients]);

    const filtered = useMemo(() => {
        if (!debouncedSearchText) return patients;
        const q = debouncedSearchText.toLowerCase();
        return patients.filter(
            (e) =>
                (e.ma_kham_benh || "").toLowerCase().includes(q) ||
                (e.ho_ten || "").toLowerCase().includes(q) ||
                (e.ten_don_vi || "").toLowerCase().includes(q),
        );
    }, [patients, debouncedSearchText]);

    const handleOpenForm = useCallback(async (id) => {
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
                message: err.response?.data?.detail || "Lỗi tải chi tiết đơn thuốc.",
                severity: "error",
            });
            setOpenForm(false);
        } finally {
            setDetailLoading(false);
        }
    }, [examinations]);

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
    }, [selectedExam, handleCloseForm, loadData]);

    return {
        initialLoading,
        refreshing,
        selectedDate,
        setSelectedDate,
        searchText,
        setSearchText,
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
        filterMode,
        handleFilterModeChange,
        page,
        setPage,
        totalRecords,
        ROWS_PER_PAGE,
        offset,
        nam,
        setNam,
    };
}

import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import useDebounce from "./useDebounce.jsx";
import useFilterModePagination from "./useFilterModePagination.jsx";
import { khamBenhService } from "@/services/khamBenhService.js";

export default function useChuyenTuyen() {
    const [examinations, setExaminations] = useState([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [searchText, setSearchText] = useState("");
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
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const [selectedExam, setSelectedExam] = useState(null);
    const [examDetail, setExamDetail] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);

    const [selectedGiayGt, setSelectedGiayGt] = useState(null);
    const [selectedDiTuyen, setSelectedDiTuyen] = useState(null);

    const [openForm, setOpenForm] = useState(false);
    const [saving, setSaving] = useState(false);

    const loadData = useCallback(async () => {
        setRefreshing(true);
        try {
            if (filterMode === "theo_ngay") {
                const ngay = selectedDate.format("YYYY-MM-DD");
                const res = await khamBenhService.getHomNay(ngay);
                setExaminations(res.data || []);
                setTotalRecords(0);
            } else {
                const res = await khamBenhService.getAll({ limit: ROWS_PER_PAGE, offset });
                setExaminations(res.data.data || []);
                setTotalRecords(res.data.total || 0);
            }
        } catch (err) {
            setSnackbar({
                open: true,
                message:
                    err.response?.data?.detail || "Lỗi tải danh sách.",
                severity: "error",
            });
        } finally {
            setRefreshing(false);
            setInitialLoading(false);
        }
    }, [filterMode, selectedDate, offset, ROWS_PER_PAGE]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const patients = useMemo(() => {
        return examinations.filter(
            (e) => e.trang_thai === "chuyển_tuyến",
        );
    }, [examinations]);

    const stats = useMemo(() => {
        return { tongSo: patients.length };
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

    const handleViewDetail = useCallback(
        async (id) => {
            const exam = patients.find(
                (e) => e.ma_kham_benh === id,
            );
            if (!exam) return;
            setSelectedExam(exam);
            setDetailLoading(true);
            setOpenForm(true);
            try {
                const res = await khamBenhService.getDetail(id);
                setExamDetail(res.data);

                const gtRes =
                    await khamBenhService.getGiayGioiThieuByKhamBenh(
                        id,
                    );
                const gtList = gtRes.data || [];
                const gt = gtList.length > 0 ? gtList[0] : null;
                setSelectedGiayGt(gt);

                if (gt?.ma_giay_gt) {
                    const dtRes =
                        await khamBenhService.getDiTuyenSauDieuTri({
                            limit: 100,
                        });
                    const dtList = dtRes.data || [];
                    const dt = dtList.find(
                        (d) => d.ma_giay_gt === gt.ma_giay_gt,
                    );
                    setSelectedDiTuyen(dt || null);
                } else {
                    setSelectedDiTuyen(null);
                }
            } catch (err) {
                setSnackbar({
                    open: true,
                    message:
                        err.response?.data?.detail ||
                        "Lỗi tải chi tiết.",
                    severity: "error",
                });
                setOpenForm(false);
            } finally {
                setDetailLoading(false);
            }
        },
        [patients],
    );

    const handleCloseForm = useCallback(() => {
        setOpenForm(false);
        setSelectedExam(null);
        setExamDetail(null);
        setSelectedGiayGt(null);
        setSelectedDiTuyen(null);
    }, []);

    const handleSave = useCallback(
        async (giayData, diTuyenData) => {
            if (!selectedExam) return;
            setSaving(true);
            try {
                if (selectedGiayGt?.ma_giay_gt) {
                    await khamBenhService.updateGiayGioiThieu(
                        selectedGiayGt.ma_giay_gt,
                        giayData,
                    );
                } else {
                    const createData = {
                        ...giayData,
                        ma_quan_nhan: selectedExam.ma_quan_nhan,
                        ma_kham_benh: selectedExam.ma_kham_benh,
                    };
                    await khamBenhService.createGiayGioiThieu(
                        createData,
                    );
                }

                if (
                    selectedDiTuyen?.ma_chuyen_tuyen &&
                    Object.keys(diTuyenData).length > 0
                ) {
                    await khamBenhService.updateDiTuyenSauDieuTri(
                        selectedDiTuyen.ma_chuyen_tuyen,
                        diTuyenData,
                    );
                } else if (
                    !selectedDiTuyen &&
                    Object.keys(diTuyenData).length > 0
                ) {
                    const createDtData = {
                        ...diTuyenData,
                        ma_quan_nhan: selectedExam.ma_quan_nhan,
                    };
                    await khamBenhService.createDiTuyenSauDieuTri(
                        createDtData,
                    );
                }

                setSnackbar({
                    open: true,
                    message: "Đã lưu thông tin chuyển tuyến.",
                    severity: "success",
                });
                handleCloseForm();
                loadData();
            } catch (err) {
                setSnackbar({
                    open: true,
                    message:
                        err.response?.data?.detail ||
                        "Lỗi lưu thông tin.",
                    severity: "error",
                });
            } finally {
                setSaving(false);
            }
        },
        [selectedExam, selectedGiayGt, selectedDiTuyen, handleCloseForm, loadData],
    );

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
        selectedGiayGt,
        selectedDiTuyen,
        saving,
        handleViewDetail,
        handleCloseForm,
        handleSave,
        loadData,
        filterMode,
        handleFilterModeChange,
        page,
        setPage,
        totalRecords,
        ROWS_PER_PAGE,
        offset,
    };
}

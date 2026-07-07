import { useCallback, useEffect, useMemo, useState } from "react";
import useDebounce from "./useDebounce.jsx";
import { khamBenhService } from "@/services/khamBenhService.js";

const ROWS_PER_PAGE = 100;

export default function useChuyenTuyen() {
    const [examinations, setExaminations] = useState([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [nam, setNam] = useState(null);
    const debouncedSearchText = useDebounce(searchText);

    const [filterMode, setFilterMode] = useState("tat_ca");
    const [page, setPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

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

    const offset = useMemo(
        () => (filterMode === "tat_ca" ? (page - 1) * ROWS_PER_PAGE : 0),
        [filterMode, page],
    );

    const handleFilterModeChange = useCallback(() => {
        setFilterMode(prev => prev === "tat_ca" ? "chuyen_tuyen" : "tat_ca");
        setPage(1);
    }, []);

    const loadData = useCallback(async () => {
        setRefreshing(true);
        try {
            const params = { limit: ROWS_PER_PAGE, offset };
            if (nam) params.nam = nam;
            const res = await khamBenhService.getChuyenTuyenList(params);
            const data = res.data?.data || [];
            setExaminations(data);
            setTotalRecords(res.data?.total || 0);
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
    }, [offset, nam]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const patients = useMemo(() => {
        if (filterMode === "chuyen_tuyen") {
            return examinations.filter(
                (e) => e.chuyen_tuyen_status === "đề_nghị_chuyển_tuyến",
            );
        }
        return examinations;
    }, [examinations, filterMode]);

    const stats = useMemo(() => {
        const deNghi = examinations.filter(
            (e) => e.chuyen_tuyen_status === "đề_nghị_chuyển_tuyến",
        ).length;
        const daChuyenTuyen = examinations.filter(
            (e) => e.chuyen_tuyen_status === "đã_chuyển_tuyến",
        ).length;
        const daVe = examinations.filter(
            (e) => e.chuyen_tuyen_status === "đã_về",
        ).length;
        return { tongSo: examinations.length, deNghi, daChuyenTuyen, daVe };
    }, [examinations]);

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
        nam,
        setNam,
    };
}

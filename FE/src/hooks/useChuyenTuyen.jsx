import { useCallback, useEffect, useMemo, useState } from "react";

import { khamBenhService } from "@/services/khamBenhService.js";

const ROWS_PER_PAGE = 50;

export default function useChuyenTuyen() {
    const [examinations, setExaminations] = useState([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [nam, setNam] = useState(null);
    const [thang, setThang] = useState(null);

    const [isLeft, setIsLeft] = useState(false);
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

    const offset = useMemo(() => (page - 1) * ROWS_PER_PAGE, [page]);

    const handleFilterModeChange = useCallback(() => {
        setIsLeft((prev) => !prev);
        setPage(1);
    }, []);

    const loadData = useCallback(async () => {
        setRefreshing(true);
        try {
            const params = { limit: ROWS_PER_PAGE, offset };
            if (nam) params.nam = nam;
            if (thang) params.thang = thang;
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
    }, [offset, nam, thang]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const patients = useMemo(() => {
        if (!isLeft) {
            return examinations.filter(
                (e) =>
                    e.chuyen_tuyen_status === "đề_nghị_chuyển_tuyến" ||
                    e.chuyen_tuyen_status === "chờ_chuyển_tuyến",
            );
        }
        return examinations;
    }, [examinations, isLeft]);

    const stats = useMemo(() => {
        const deNghi = examinations.filter(
            (e) => e.chuyen_tuyen_status === "đề_nghị_chuyển_tuyến",
        ).length;
        const choChuyenTuyen = examinations.filter(
            (e) => e.chuyen_tuyen_status === "chờ_chuyển_tuyến",
        ).length;
        const daChuyenTuyen = examinations.filter(
            (e) => e.chuyen_tuyen_status === "đã_chuyển_tuyến",
        ).length;
        const daVe = examinations.filter(
            (e) => e.chuyen_tuyen_status === "đã_về",
        ).length;
        return {
            tongSo: examinations.length,
            deNghi,
            choChuyenTuyen,
            daChuyenTuyen,
            daVe,
        };
    }, [examinations]);

    const filtered = useMemo(() => {
        if (!searchText) return patients;
        const q = searchText.toLowerCase();
        return patients.filter(
            (e) =>
                (e.ma_kham_benh || "").toLowerCase().includes(q) ||
                (e.ho_ten || "").toLowerCase().includes(q) ||
                (e.ten_don_vi || "").toLowerCase().includes(q),
        );
    }, [patients, searchText]);

    const handleViewDetail = useCallback(
        async (id) => {
            const exam = patients.find((e) => e.ma_kham_benh === id);
            if (!exam) return;
            setSelectedExam(exam);
            setDetailLoading(true);
            setOpenForm(true);
            try {
                const [detailRes, ctRes] = await Promise.all([
                    khamBenhService.getDetail(id),
                    khamBenhService.getChiTietChuyenTuyen(id),
                ]);
                setExamDetail(detailRes.data);
                const ct = ctRes.data;
                setSelectedGiayGt(ct?.giay_chuyen_tuyen || null);
                setSelectedDiTuyen(ct?.di_tuyen || null);
            } catch (err) {
                setSnackbar({
                    open: true,
                    message: err.response?.data?.detail || "Lỗi tải chi tiết.",
                    severity: "error",
                });
                setOpenForm(false);
            } finally {
                setDetailLoading(false);
            }
        },
        [patients],
    );

    const handleApproveChuyenTuyen = useCallback(
        async (maKhamBenh) => {
            try {
                await khamBenhService.approveChuyenTuyen(maKhamBenh);
                loadData();
            } catch (err) {
                setSnackbar({
                    open: true,
                    message:
                        err.response?.data?.detail || "Lỗi duyệt chuyển tuyến.",
                    severity: "error",
                });
            }
        },
        [loadData],
    );

    const handleRejectChuyenTuyen = useCallback(
        async (maKhamBenh) => {
            try {
                await khamBenhService.rejectChuyenTuyen(maKhamBenh);
                loadData();
            } catch (err) {
                setSnackbar({
                    open: true,
                    message:
                        err.response?.data?.detail ||
                        "Lỗi từ chối chuyển tuyến.",
                    severity: "error",
                });
            }
        },
        [loadData],
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
                let maGiayGt = selectedGiayGt?.ma_giay_gt;

                if (maGiayGt) {
                    await khamBenhService.updateGiayGioiThieu(
                        maGiayGt,
                        giayData,
                    );
                } else {
                    const res = await khamBenhService.createGiayGioiThieu({
                        ...giayData,
                        ma_quan_nhan: selectedExam.ma_quan_nhan,
                        ma_kham_benh: selectedExam.ma_kham_benh,
                    });
                    maGiayGt = res.data?.ma_giay_gt;
                }

                if (Object.keys(diTuyenData).length > 0) {
                    const diTuyenPayload = {
                        ...diTuyenData,
                        noi_dieu_tri: giayData.ten_benh_vien,
                        chan_doan_luc_di:
                            examDetail?.chan_doan || giayData.chanDoan,
                    };
                    if (selectedDiTuyen?.ma_chuyen_tuyen) {
                        await khamBenhService.updateDiTuyenSauDieuTri(
                            selectedDiTuyen.ma_chuyen_tuyen,
                            diTuyenPayload,
                        );
                    } else if (maGiayGt) {
                        await khamBenhService.createDiTuyenSauDieuTri({
                            ...diTuyenPayload,
                            ma_quan_nhan: selectedExam.ma_quan_nhan,
                            ma_giay_gt: maGiayGt,
                        });
                    }
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
                    message: err.response?.data?.detail || "Lỗi lưu thông tin.",
                    severity: "error",
                });
            } finally {
                setSaving(false);
            }
        },
        [
            selectedExam,
            selectedGiayGt,
            selectedDiTuyen,
            handleCloseForm,
            loadData,
        ],
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
        handleApproveChuyenTuyen,
        handleRejectChuyenTuyen,
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

import { useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { khamBenhService } from "@/services/khamBenhService.js";
import useExamList from "./useExamList.jsx";

export default function useChuyenTuyen() {
    const [searchParams] = useSearchParams();

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
        nam,
        setNam,
        thang,
        setThang,
    } = useExamList({
        rowsPerPage: 50,
        statusField: "chuyen_tuyen_status",
        hasDateMode: false,
        initialIsLeft: searchParams.get("all") === "1",
        initialStatus: searchParams.get("filter") || "",
        fetchData: async ({ offset, limit, nam, thang }) => {
            const params = { limit, offset };
            if (nam) params.nam = nam;
            if (thang) params.thang = thang;
            const res = await khamBenhService.getChuyenTuyenList(params);
            return {
                list: res.data?.data || [],
                total: res.data?.total || 0,
            };
        },
        subset: (list, isLeft) => {
            if (!isLeft) {
                return list.filter(
                    (e) =>
                        e.chuyen_tuyen_status === "đề_nghị_chuyển_tuyến" ||
                        e.chuyen_tuyen_status === "chờ_chuyển_tuyến",
                );
            }
            return list;
        },
    });

    const [selectedExam, setSelectedExam] = useState(null);
    const [examDetail, setExamDetail] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);

    const [selectedGiayGt, setSelectedGiayGt] = useState(null);
    const [selectedDiTuyen, setSelectedDiTuyen] = useState(null);

    const [openForm, setOpenForm] = useState(false);
    const [saving, setSaving] = useState(false);

    const stats = {
        tongSo: examinations.length,
        deNghi: examinations.filter(
            (e) => e.chuyen_tuyen_status === "đề_nghị_chuyển_tuyến",
        ).length,
        choChuyenTuyen: examinations.filter(
            (e) => e.chuyen_tuyen_status === "chờ_chuyển_tuyến",
        ).length,
        daChuyenTuyen: examinations.filter(
            (e) => e.chuyen_tuyen_status === "đã_chuyển_tuyến",
        ).length,
        daVe: examinations.filter((e) => e.chuyen_tuyen_status === "đã_về")
            .length,
    };

    const handleViewDetail = useCallback(
        async (id) => {
            const exam = baseList.find((e) => e.ma_kham_benh === id);
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
        [baseList, setSnackbar],
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
        [loadData, setSnackbar],
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
        [loadData, setSnackbar],
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
            examDetail,
            handleCloseForm,
            loadData,
            setSnackbar,
        ],
    );

    return {
        initialLoading,
        refreshing,
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

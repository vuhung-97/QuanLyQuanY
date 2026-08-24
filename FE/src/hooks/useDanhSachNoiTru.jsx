import { useCallback, useEffect, useMemo, useState } from "react";
import { noiTruService } from "@/services/noiTruService.js";

const ROWS_PER_PAGE = 100;

export default function useDanhSachNoiTru() {
    const [examinations, setExaminations] = useState([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [isLeft, setIsLeft] = useState(false);
    const currentYear = new Date().getFullYear();
    const [filterNam, setFilterNam] = useState(null);
    const [filterThang, setFilterThang] = useState(null);
    const [sortBy, setSortBy] = useState("");
    const [page, setPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const [confirmRaVien, setConfirmRaVien] = useState({ open: false, benhAnId: null });
    const [openChiTiet, setOpenChiTiet] = useState(false);
    const [selectedBenhAnId, setSelectedBenhAnId] = useState(null);
    const [choNhapVienCount, setChoNhapVienCount] = useState(0);

    const offset = useMemo(
        () => (isLeft ? (page - 1) * ROWS_PER_PAGE : 0),
        [isLeft, page],
    );

    const handleFilterModeChange = useCallback(() => {
        setIsLeft(prev => !prev);
        setPage(1);
    }, []);

    const handleFilterNamChange = useCallback((value) => {
        setFilterNam(value || null);
        setPage(1);
    }, []);

    const handleFilterThangChange = useCallback((value) => {
        setFilterThang(value || null);
        setPage(1);
    }, []);

    const handleSortByChange = useCallback((value) => {
        setSortBy(value);
        setPage(1);
    }, []);

    const loadData = useCallback(async () => {
        setRefreshing(true);
        try {
            const trang_thai = isLeft ? undefined : "đang_điều_trị";
            const [resNoiTru, resChoNhapVien] = await Promise.all([
                noiTruService.getDanhSachNoiTru({
                    trang_thai, limit: ROWS_PER_PAGE, offset,
                    nam: filterNam || undefined,
                    thang: filterThang || undefined,
                    sap_xep: sortBy || undefined,
                }),
                noiTruService.getDanhSachNhapVien({ limit: 1, offset: 0 }),
            ]);
            setExaminations(resNoiTru.data.data || []);
            setTotalRecords(resNoiTru.data.total || 0);
            setChoNhapVienCount(resChoNhapVien.data.total || 0);
        } catch (err) {
            setSnackbar({
                open: true,
                message: err.response?.data?.detail || "Lỗi tải danh sách nội trú.",
                severity: "error",
            });
        } finally {
            setRefreshing(false);
            setInitialLoading(false);
        }
    }, [isLeft, offset, filterNam, filterThang, sortBy]);

    useEffect(() => { loadData(); }, [loadData]);

    const stats = useMemo(() => {
        const all = examinations;
        const dangDieuTri = all.filter(
            (e) => e.trang_thai === "đang_điều_trị",
        ).length;
        const daRaVien = all.filter(
            (e) => e.trang_thai === "đã_ra_viện",
        ).length;
        return { tongSo: all.length, choNhapVien: choNhapVienCount, dangDieuTri, daRaVien };
    }, [examinations, choNhapVienCount]);

    const filtered = useMemo(() => {
        if (!searchText) return examinations;
        const q = searchText.toLowerCase();
        return examinations.filter(
            (e) =>
                (e.ma_benh_an || "").toLowerCase().includes(q) ||
                (e.ho_ten || "").toLowerCase().includes(q) ||
                (e.ten_don_vi || "").toLowerCase().includes(q),
        );
    }, [examinations, searchText]);

    const handleRaVienClick = useCallback((benhAnId) => {
        setConfirmRaVien({ open: true, benhAnId });
    }, []);

    const handleRaVienCancel = useCallback(() => {
        setConfirmRaVien({ open: false, benhAnId: null });
    }, []);

    const handleRaVienConfirm = useCallback(async (data) => {
        try {
            await noiTruService.raVien(confirmRaVien.benhAnId, data);
            setConfirmRaVien({ open: false, benhAnId: null });
            setSnackbar({ open: true, message: "Đã ra viện thành công.", severity: "success" });
            loadData();
        } catch (err) {
            setSnackbar({
                open: true,
                message: err.response?.data?.detail || "Lỗi ra viện.",
                severity: "error",
            });
        }
    }, [confirmRaVien.benhAnId, loadData]);

    const handleOpenChiTiet = useCallback((benhAnId) => {
        setSelectedBenhAnId(benhAnId);
        setOpenChiTiet(true);
    }, []);

    const handleCloseChiTiet = useCallback(() => {
        setOpenChiTiet(false);
        setSelectedBenhAnId(null);
    }, []);

    return {
        initialLoading,
        refreshing,
        filtered,
        stats,
        searchText,
        setSearchText,
        snackbar,
        setSnackbar,
        confirmRaVien,
        handleRaVienClick,
        handleRaVienCancel,
        handleRaVienConfirm,
        openChiTiet,
        selectedBenhAnId,
        handleOpenChiTiet,
        handleCloseChiTiet,
        loadData,
        isLeft,
        handleFilterModeChange,
        filterNam,
        setFilterNam,
        handleFilterNamChange,
        filterThang,
        setFilterThang,
        handleFilterThangChange,
        sortBy,
        handleSortByChange,
        page,
        setPage,
        totalRecords,
        ROWS_PER_PAGE,
        offset,
    };
}
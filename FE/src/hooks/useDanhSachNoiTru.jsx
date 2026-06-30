import { useCallback, useEffect, useMemo, useState } from "react";
import useDebounce from "./useDebounce.jsx";
import { noiTruService } from "@/services/noiTruService.js";

const ROWS_PER_PAGE = 100;

export default function useDanhSachNoiTru() {
    const [examinations, setExaminations] = useState([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchText, setSearchText] = useState("");
    const debouncedSearchText = useDebounce(searchText);
    const [filterMode, setFilterMode] = useState("dang_dieu_tri");
    const currentYear = new Date().getFullYear();
    const [filterNam, setFilterNam] = useState(null);
    const [filterThang, setFilterThang] = useState(null);
    const [page, setPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const [confirmRaVien, setConfirmRaVien] = useState({ open: false, benhAnId: null });
    const [openChiTiet, setOpenChiTiet] = useState(false);
    const [selectedBenhAnId, setSelectedBenhAnId] = useState(null);
    const [choNhapVienCount, setChoNhapVienCount] = useState(0);

    const offset = useMemo(
        () => (filterMode === "tat_ca" ? (page - 1) * ROWS_PER_PAGE : 0),
        [filterMode, page],
    );

    const handleFilterModeChange = useCallback(() => {
        setFilterMode(prev => prev === "tat_ca" ? "dang_dieu_tri" : "tat_ca");
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

    const loadData = useCallback(async () => {
        setRefreshing(true);
        try {
            const trang_thai = filterMode === "dang_dieu_tri" ? "đang_điều_trị" : undefined;
            const [resNoiTru, resChoNhapVien] = await Promise.all([
                noiTruService.getDanhSachNoiTru({
                    trang_thai, limit: ROWS_PER_PAGE, offset,
                    nam: filterNam || undefined,
                    thang: filterThang || undefined,
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
    }, [filterMode, offset, filterNam, filterThang]);

    useEffect(() => { loadData(); }, [loadData]);

    const stats = useMemo(() => {
        const all = examinations;
        const dangDieuTri = all.filter((e) => e.trang_thai === "đang_điều_trị").length;
        const daRaVien = all.filter((e) => e.trang_thai === "đã_ra_viện").length;
        return { dangDieuTri, daRaVien, choNhapVien: choNhapVienCount };
    }, [examinations, choNhapVienCount]);

    const filtered = useMemo(() => {
        if (!debouncedSearchText) return examinations;
        const q = debouncedSearchText.toLowerCase();
        return examinations.filter(
            (e) =>
                (e.ma_benh_an || "").toLowerCase().includes(q) ||
                (e.ho_ten || "").toLowerCase().includes(q) ||
                (e.ten_buong || "").toLowerCase().includes(q),
        );
    }, [examinations, debouncedSearchText]);

    const handleOpenChiTiet = useCallback((id) => {
        setSelectedBenhAnId(id);
        setOpenChiTiet(true);
    }, []);

    const handleCloseChiTiet = useCallback(() => {
        setOpenChiTiet(false);
        setSelectedBenhAnId(null);
        loadData();
    }, [loadData]);

    const handleRaVienClick = useCallback((id) => {
        setConfirmRaVien({ open: true, benhAnId: id });
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

    return {
        initialLoading,
        refreshing,
        searchText,
        setSearchText,
        filtered,
        stats,
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
        filterMode,
        handleFilterModeChange,
        filterNam,
        setFilterNam,
        handleFilterNamChange,
        filterThang,
        setFilterThang,
        handleFilterThangChange,
        page,
        setPage,
        totalRecords,
        ROWS_PER_PAGE,
        offset,
    };
}
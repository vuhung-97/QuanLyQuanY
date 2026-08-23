import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { khoDuocService } from "@/services/khoDuocService.js";
import { setDeferred } from "@/utils/setDeferred.js";
import { ROWS_PER_PAGE, DEFAULT_THRESHOLDS } from "@/constants/khoConstant.js";

export default function useKhoList(thresholds = DEFAULT_THRESHOLDS) {
    const [searchParams] = useSearchParams();
    const [allItems, setAllItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sapHetHan, setSapHetHan] = useState([]);
    const [search, setSearch] = useState("");
    const [phanLoaiFilter, setPhanLoaiFilter] = useState("");
    const [filterMode, setFilterMode] = useState(
        () => searchParams.get("filter") || "all",
    );
    const [page, setPage] = useState(1);
    const [dialog, setDialog] = useState({
        open: false,
        id: null,
        mode: "create",
    });
    const [confirm, setConfirm] = useState({ open: false, id: null });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [data, expiring] = await Promise.all([
                khoDuocService.fetchAllThuocVtyt(),
                khoDuocService.getSapHetHan(thresholds.sapHetHanNgay).catch(() => []),
            ]);
            setDeferred(
                setAllItems,
                (data || []).sort((a, b) =>
                    (a.ten_thuoc_vtyt || "").localeCompare(
                        b.ten_thuoc_vtyt || "",
                    ),
                ),
            );
            setDeferred(setSapHetHan, Array.isArray(expiring) ? expiring : []);
        } catch {
            setSnackbar({
                open: true,
                message: "Lỗi tải danh sách",
                severity: "error",
            });
        } finally {
            setLoading(false);
        }
    }, [thresholds.sapHetHanNgay]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const phanLoaiOptions = useMemo(() => {
        const s = new Set(allItems.map((i) => i.phan_loai).filter(Boolean));
        return [...s].sort();
    }, [allItems]);

    const sapHetHanMaSet = useMemo(
        () => new Set(sapHetHan.map((i) => i.ma_thuoc_vtyt)),
        [sapHetHan],
    );

    const filteredItems = useMemo(() => {
        let items = allItems;
        if (search.trim()) {
            const q = search.trim().toLowerCase();
            items = items.filter(
                (i) =>
                    i.ten_thuoc_vtyt?.toLowerCase().includes(q) ||
                    i.hoat_chat?.toLowerCase().includes(q) ||
                    i.ma_thuoc_vtyt?.toLowerCase().includes(q),
            );
        }
        if (phanLoaiFilter) {
            items = items.filter((i) => i.phan_loai === phanLoaiFilter);
        }
        if (filterMode === "low-stock") {
            items = items.filter((i) => {
                const qty = i.so_luong ?? 0;
                return i.loai !== "vat_tu" ? qty < thresholds.thuoc : qty < thresholds.vat_tu;
            });
        } else if (filterMode === "expiring") {
            items = items.filter((i) => sapHetHanMaSet.has(i.ma_thuoc_vtyt));
        }
        return items;
    }, [allItems, search, phanLoaiFilter, filterMode, sapHetHanMaSet, thresholds.thuoc, thresholds.vat_tu]);

    const totalPages = Math.ceil(filteredItems.length / ROWS_PER_PAGE);

    const paginatedItems = useMemo(() => {
        const start = (page - 1) * ROWS_PER_PAGE;
        return filteredItems.slice(start, start + ROWS_PER_PAGE);
    }, [filteredItems, page]);

    const statItems = useMemo(() => {
        const thuocTonThap = allItems.filter(
            (i) => (i.so_luong ?? 0) < thresholds.thuoc && i.loai !== "vat_tu",
        ).length;
        const vtytTonThap = allItems.filter(
            (i) => (i.so_luong ?? 0) < thresholds.vat_tu && i.loai === "vat_tu",
        ).length;
        return [
            {
                label: "Tổng cộng",
                value: allItems.length,
                icon: "inventory",
                color: "#0B3B60",
                bg: "#E8F0FE",
                filterKey: "all",
            },
            {
                label: `Tồn kho thấp (<${thresholds.thuoc}T, <${thresholds.vat_tu}V)`,
                value: thuocTonThap + vtytTonThap,
                icon: "warning",
                color: "#F59E0B",
                bg: "#FEF3C7",
                filterKey: "low-stock",
            },
            {
                label: `Sắp hết hạn (${thresholds.sapHetHanNgay} ngày)`,
                value: sapHetHan.length,
                icon: "error",
                color: "#DC2626",
                bg: "#FEE2E2",
                filterKey: "expiring",
            },
        ];
    }, [allItems, sapHetHan, thresholds.thuoc, thresholds.vat_tu, thresholds.sapHetHanNgay]);

    const handleSearchChange = useCallback((v) => {
        setSearch(v);
        setPage(1);
    }, []);

    const handlePhanLoaiChange = useCallback((e) => {
        setPhanLoaiFilter(e.target.value);
        setPage(1);
    }, []);

    const handleCardClick = useCallback((filterKey) => {
        setFilterMode(filterKey || "all");
        setPage(1);
    }, []);

    const handleView = useCallback(
        (id) => setDialog({ open: true, id, mode: "view" }),
        [],
    );
    const handleEdit = useCallback(
        (id) => setDialog({ open: true, id, mode: "edit" }),
        [],
    );
    const handleDelete = useCallback(
        (id) => setConfirm({ open: true, id }),
        [],
    );

    const confirmDelete = useCallback(async () => {
        if (!confirm.id) return;
        try {
            await khoDuocService.deleteThuocVtyt(confirm.id);
            setSnackbar({
                open: true,
                message: "Xoá thành công",
                severity: "success",
            });
            setAllItems((prev) => {
                const next = prev.filter((i) => i.ma_thuoc_vtyt !== confirm.id);
                const newTotalPages = Math.max(
                    1,
                    Math.ceil(next.length / ROWS_PER_PAGE),
                );
                setPage((p) => Math.min(p, newTotalPages));
                return next;
            });
            setConfirm({ open: false, id: null });
        } catch (err) {
            const msg = err?.response?.data?.detail || "Lỗi xoá dữ liệu";
            setSnackbar({ open: true, message: msg, severity: "error" });
        }
    }, [confirm.id]);

    const rowExtra = useMemo(
        () => ({
            onView: handleView,
            onEdit: handleEdit,
            onDelete: handleDelete,
        }),
        [handleView, handleEdit, handleDelete],
    );

    return {
        allItems,
        loading,
        search,
        phanLoaiFilter,
        filterMode,
        page,
        dialog,
        confirm,
        snackbar,
        phanLoaiOptions,
        filteredItems,
        paginatedItems,
        totalPages,
        statItems,
        sapHetHanMaSet,
        rowExtra,
        fetchData,
        setPage,
        setDialog,
        setConfirm,
        setSnackbar,
        handleSearchChange,
        handlePhanLoaiChange,
        handleCardClick,
        handleView,
        handleEdit,
        handleDelete,
        confirmDelete,
    };
}

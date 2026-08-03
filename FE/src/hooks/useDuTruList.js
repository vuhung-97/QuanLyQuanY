import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { khoDuocService } from "@/services/khoDuocService.js";

export const TRANG_THAI_OPTIONS = [
    { value: "", label: "Tất cả" },
    { value: "cho_gui", label: "Chờ gửi" },
    { value: "chua_duyet", label: "Chờ duyệt" },
    { value: "da_duyet", label: "Đã duyệt" },
    { value: "tu_choi", label: "Từ chối" },
    { value: "da_nhap", label: "Đã nhập kho" },
];

export const STATUS_CHIP = {
    cho_gui: { label: "Chờ gửi", color: "default" },
    chua_duyet: { label: "Chờ duyệt", color: "warning" },
    da_duyet: { label: "Đã duyệt", color: "success" },
    tu_choi: { label: "Từ chối", color: "error" },
    da_nhap: { label: "Đã nhập kho", color: "info" },
};

export const ROWS_PER_PAGE = 20;

const ACTION_LABEL = {
    duyet: "Duyệt",
    gui: "Gửi duyệt",
    tu_choi: "Không duyệt",
    xoa: "Xoá",
};

export const EMPTY_STATS = { tong: 0, cho_gui: 0, chua_duyet: 0, da_duyet: 0, tu_choi: 0, da_nhap: 0 };

export default function useDuTruList() {
    const [rows, setRows] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const [trangThai, setTrangThai] = useState(
        () => searchParams.get("filter") || "",
    );
    const [nam, setNam] = useState(null);
    const [thang, setThang] = useState(null);
    const [stats, setStats] = useState(EMPTY_STATS);
    const [statsLoading, setStatsLoading] = useState(false);
    const [openPhieu, setOpenPhieu] = useState({ open: false, id: null, mode: "create" });
    const [confirm, setConfirm] = useState({ open: false, action: null, id: null });
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const params = { limit: ROWS_PER_PAGE, offset: (page - 1) * ROWS_PER_PAGE };
            if (trangThai) params.trang_thai = trangThai;
            if (nam) params.nam = nam;
            if (thang) params.thang = thang;
            const res = await khoDuocService.getDanhSachPhieuDuTru(params);
            const body = res.data || {};
            const allData = body.data || [];
            const totalCount = body.total ?? allData.length;
            setRows(allData);
            setTotal(totalCount);
        } catch {
            setRows([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    }, [page, trangThai, nam, thang]);

    const fetchStats = useCallback(async () => {
        setStatsLoading(true);
        try {
            const params = {};
            if (nam) params.nam = nam;
            if (thang) params.thang = thang;
            const res = await khoDuocService.getThongKePhieuDuTru(params);
            setStats(res.data || EMPTY_STATS);
        } catch {
            setStats(EMPTY_STATS);
        } finally {
            setStatsLoading(false);
        }
    }, [nam, thang]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const handleAction = async (id, action) => {
        setConfirm({ open: false, action: null, id: null });
        try {
            if (action === "duyet") await khoDuocService.duyetPhieuDuTru(id);
            else if (action === "gui") await khoDuocService.guiPhieuDuTru(id);
            else if (action === "tu_choi") await khoDuocService.tuChoiPhieuDuTru(id);
            else if (action === "xoa") await khoDuocService.deletePhieuDuTru(id);
            setSnackbar({
                open: true,
                message: `${ACTION_LABEL[action] || "Thao tác"} thành công.`,
                severity: "success",
            });
            fetchData();
            fetchStats();
        } catch (err) {
            setSnackbar({
                open: true,
                message: err.response?.data?.detail || "Thao tác thất bại.",
                severity: "error",
            });
        }
    };

    const openConfirm = (id, action) => setConfirm({ open: true, action, id });

    const handleView = useCallback((id) => setOpenPhieu({ open: true, id, mode: "view" }), []);
    const handleEdit = useCallback((id) => setOpenPhieu({ open: true, id, mode: "edit" }), []);

    return {
        rows,
        total,
        page,
        loading,
        trangThai,
        nam,
        thang,
        stats,
        statsLoading,
        openPhieu,
        confirm,
        snackbar,
        setPage,
        setTrangThai,
        setNam,
        setThang,
        setOpenPhieu,
        setSnackbar,
        setConfirm,
        fetchData,
        handleAction,
        handleView,
        handleEdit,
        openConfirm,
        ACTION_LABEL,
        ROWS_PER_PAGE,
    };
}

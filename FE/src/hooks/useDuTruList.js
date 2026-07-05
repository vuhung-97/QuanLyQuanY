import { useCallback, useEffect, useState } from "react";
import { khoDuocService } from "@/services/khoDuocService.js";

export const TRANG_THAI_OPTIONS = [
    { value: "", label: "Tất cả" },
    { value: "chua_duyet", label: "Chưa duyệt" },
    { value: "da_duyet", label: "Đã duyệt" },
    { value: "tu_choi", label: "Từ chối" },
    { value: "da_nhap", label: "Đã nhập kho" },
];

export const STATUS_CHIP = {
    chua_duyet: { label: "Chưa duyệt", color: "warning" },
    da_duyet: { label: "Đã duyệt", color: "success" },
    tu_choi: { label: "Từ chối", color: "error" },
    da_nhap: { label: "Đã nhập kho", color: "info" },
};

const ROWS_PER_PAGE = 20;

const ACTION_LABEL = {
    duyet: "Duyệt",
    xoa: "Xoá",
};

export default function useDuTruList() {
    const [rows, setRows] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [trangThai, setTrangThai] = useState("");
    const [openPhieu, setOpenPhieu] = useState({ open: false, id: null, mode: "create" });
    const [confirm, setConfirm] = useState({ open: false, action: null, id: null });
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const params = { limit: ROWS_PER_PAGE, offset: (page - 1) * ROWS_PER_PAGE };
            if (trangThai) params.trang_thai = trangThai;
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
    }, [page, trangThai]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAction = async (id, action) => {
        setConfirm({ open: false, action: null, id: null });
        try {
            if (action === "duyet") await khoDuocService.duyetPhieuDuTru(id);
            else if (action === "tu_choi") await khoDuocService.tuChoiPhieuDuTru(id);
            else if (action === "xoa") await khoDuocService.deletePhieuDuTru(id);
            setSnackbar({
                open: true,
                message: `${ACTION_LABEL[action] || "Thao tác"} thành công.`,
                severity: "success",
            });
            fetchData();
        } catch (err) {
            setSnackbar({
                open: true,
                message: err.response?.data?.detail || "Thao tác thất bại.",
                severity: "error",
            });
        }
    };

    const openConfirm = (id, action) => setConfirm({ open: true, action, id });

    return {
        rows,
        total,
        page,
        loading,
        trangThai,
        openPhieu,
        confirm,
        snackbar,
        setPage,
        setTrangThai,
        setOpenPhieu,
        setSnackbar,
        setConfirm,
        fetchData,
        handleAction,
        openConfirm,
        ACTION_LABEL,
    };
}

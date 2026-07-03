import { useCallback, useEffect, useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import DataTable from "@/components/common/DataTable.jsx";
import FeedbackSnackbar from "@/components/common/FeedbackSnackbar.jsx";
import PaginationWidget from "@/components/common/PaginationWidget.jsx";
import { khoDuocService } from "@/services/khoDuocService.js";
import PhieuDuTruDialog from "./PhieuDuTruDialog.jsx";
import ConfirmDialog from "@/components/common/ConfirmDialog.jsx";

const TRANG_THAI_OPTIONS = [
    { value: "", label: "Tất cả" },
    { value: "chua_duyet", label: "Chưa duyệt" },
    { value: "da_duyet", label: "Đã duyệt" },
    { value: "tu_choi", label: "Từ chối" },
    { value: "da_nhap", label: "Đã nhập kho" },
];

const STATUS_CHIP = {
    chua_duyet: { label: "Chưa duyệt", color: "warning" },
    da_duyet: { label: "Đã duyệt", color: "success" },
    tu_choi: { label: "Từ chối", color: "error" },
    da_nhap: { label: "Đã nhập kho", color: "info" },
};

const ROWS_PER_PAGE = 20;

export default function DuTruList() {
    const [rows, setRows] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [trangThai, setTrangThai] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [confirm, setConfirm] = useState({ open: false, action: null, id: null });
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const params = { limit: ROWS_PER_PAGE, offset: (page - 1) * ROWS_PER_PAGE };
            if (trangThai) params.trang_thai = trangThai;
            const res = await khoDuocService.listPhieuDuTru(params);
            const data = res.data || [];
            const allData = Array.isArray(data) ? data : data.items || data.data || [];
            const totalCount = data.total ?? allData.length;
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
            let res;
            const labelMap = { duyet: "Duyệt", tu_choi: "Từ chối", nhap_kho: "Nhập kho", xoa: "Xoá" };
            if (action === "duyet") res = await khoDuocService.duyetPhieuDuTru(id);
            else if (action === "tu_choi") res = await khoDuocService.tuChoiPhieuDuTru(id);
            else if (action === "nhap_kho") res = await khoDuocService.nhapKhoTuPhieuDuTru(id);
            else if (action === "xoa") res = await khoDuocService.deletePhieuDuTru(id);
            setSnackbar({
                open: true,
                message: `${labelMap[action] || "Thao tác"} thành công.`,
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

    const openConfirm = (id, action) =>
        setConfirm({ open: true, action, id });

    const confirmLabel = {
        duyet: "Duyệt",
        tu_choi: "Từ chối",
        nhap_kho: "Nhập kho",
        xoa: "Xoá",
    };

    const columns = [
        { key: "ma_phieu_du_tru", label: "Mã phiếu" },
        { key: "ngay_lap_phieu", label: "Ngày lập" },
        { key: "ma_don_vi", label: "Đơn vị" },
        {
            key: "trang_thai",
            label: "Trạng thái",
            render: (row) => {
                const chip = STATUS_CHIP[row.trang_thai] || { label: row.trang_thai, color: "default" };
                return <Chip label={chip.label} color={chip.color} size="small" />;
            },
        },
        { key: "nguoi_lap", label: "Người lập" },
        {
            key: "actions",
            label: "Thao tác",
            render: (row) => (
                <Stack direction="row" spacing={1}>
                    {row.trang_thai === "chua_duyet" && (
                        <>
                            <Button size="small" variant="contained" color="success"
                                onClick={() => openConfirm(row.ma_phieu_du_tru, "duyet")}>
                                Duyệt
                            </Button>
                            <Button size="small" variant="outlined" color="error"
                                onClick={() => openConfirm(row.ma_phieu_du_tru, "tu_choi")}>
                                Từ chối
                            </Button>
                        </>
                    )}
                    {row.trang_thai === "da_duyet" && (
                        <Button size="small" variant="contained"
                            onClick={() => openConfirm(row.ma_phieu_du_tru, "nhap_kho")}>
                            Nhập kho
                        </Button>
                    )}
                    {["chua_duyet", "tu_choi"].includes(row.trang_thai) && (
                        <Button size="small" variant="outlined" color="error"
                            onClick={() => openConfirm(row.ma_phieu_du_tru, "xoa")}>
                            Xoá
                        </Button>
                    )}
                </Stack>
            ),
        },
    ];

    return (
        <>
            <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                    <Stack spacing={2.5}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" spacing={2}>
                            <TextField
                                select
                                size="small"
                                label="Trạng thái"
                                value={trangThai}
                                onChange={(e) => { setTrangThai(e.target.value); setPage(1); }}
                                sx={{ minWidth: 160 }}
                            >
                                {TRANG_THAI_OPTIONS.map((opt) => (
                                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                ))}
                            </TextField>

                            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)}>
                                Tạo phiếu dự trù
                            </Button>
                        </Stack>

                        <DataTable columns={columns} rows={rows} loading={loading} minWidth={800}
                            emptyMessage="Không có phiếu dự trù." />

                        {total > ROWS_PER_PAGE && (
                            <PaginationWidget
                                page={page}
                                totalRecords={total}
                                rowsPerPage={ROWS_PER_PAGE}
                                onChange={setPage}
                            />
                        )}
                    </Stack>
                </CardContent>
            </Card>

            <PhieuDuTruDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                onSaved={() => { fetchData(); }}
            />

            <ConfirmDialog
                open={confirm.open}
                title="Xác nhận"
                message={`Bạn có chắc muốn ${confirmLabel[confirm.action]?.toLowerCase() || "thực hiện thao tác"} phiếu dự trù này?`}
                confirmLabel={confirmLabel[confirm.action] || "Xác nhận"}
                confirmColor={confirm.action === "xoa" || confirm.action === "tu_choi" ? "error" : "primary"}
                onConfirm={() => handleAction(confirm.id, confirm.action)}
                onClose={() => setConfirm({ open: false, action: null, id: null })}
            />

            <FeedbackSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
            />
        </>
    );
}

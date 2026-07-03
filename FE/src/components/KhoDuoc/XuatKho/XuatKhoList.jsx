import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Button,
    Card,
    CardContent,
    Chip,
    IconButton,
    MenuItem,
    Stack,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import {
    Add as AddIcon,
    Cancel as CancelIcon,
    CheckCircle as CheckCircleIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Visibility as VisibilityIcon,
} from "@mui/icons-material";
import dayjs from "dayjs";
import DataTable from "@/components/common/DataTable.jsx";
import FeedbackSnackbar from "@/components/common/FeedbackSnackbar.jsx";
import PaginationWidget from "@/components/common/PaginationWidget.jsx";
import { khoDuocService } from "@/services/khoDuocService.js";
import { decodeJWT } from "@/services/api.js";
import PhieuXuatDialog from "./PhieuXuatDialog.jsx";
import ConfirmDialog from "@/components/common/ConfirmDialog.jsx";

const TRANG_THAI_OPTIONS = [
    { value: "", label: "Tất cả" },
    { value: "cho_duyet", label: "Chờ duyệt" },
    { value: "da_duyet", label: "Đã duyệt" },
    { value: "tu_choi", label: "Từ chối" },
    { value: "da_xuat", label: "Đã xuất" },
];

const STATUS_CHIP = {
    cho_duyet: { label: "Chờ duyệt", color: "warning" },
    da_duyet: { label: "Đã duyệt", color: "success" },
    tu_choi: { label: "Từ chối", color: "error" },
    da_xuat: { label: "Đã xuất", color: "info" },
};

const ROWS_PER_PAGE = 20;

export default function XuatKhoList() {
    const [rows, setRows] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [trangThai, setTrangThai] = useState("");
    const [confirm, setConfirm] = useState({ open: false, action: null, id: null });
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
    const [openPhieu, setOpenPhieu] = useState({ open: false, id: null, mode: "create" });

    const currentUser = useMemo(() => {
        const token = localStorage.getItem("datamed_access_token");
        return token ? decodeJWT(token) : null;
    }, []);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const params = { limit: ROWS_PER_PAGE, offset: (page - 1) * ROWS_PER_PAGE };
            if (trangThai) params.trang_thai = trangThai;
            const res = await khoDuocService.getDanhSachPhieuXuat(params);
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
            const labelMap = { duyet: "Duyệt", tu_choi: "Từ chối", xoa: "Xoá" };
            if (action === "duyet") await khoDuocService.duyetPhieuXuat(id);
            else if (action === "tu_choi") await khoDuocService.tuChoiPhieuXuat(id);
            else if (action === "xoa") await khoDuocService.deletePhieuXuatKho(id);
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

    const role = currentUser?.role;
    const isCNQYorAdmin = role === "ROLE_ADMIN" || role === "ROLE_CNQY";

    const columns = [
        { key: "ma_phieu_xuat", label: "Mã phiếu" },
        { key: "nguoi_xuat_ho_ten", label: "Người tạo" },
        {
            key: "ngay_thang_nam",
            label: "Ngày tạo",
            render: (row) =>
                row.ngay_thang_nam
                    ? dayjs(row.ngay_thang_nam).format("DD/MM/YYYY HH:mm")
                    : "—",
        },
        { key: "ho_ten_nguoi_nhan", label: "Người nhận" },
        {
            key: "trang_thai",
            label: "Trạng thái",
            render: (row) => {
                const chip = STATUS_CHIP[row.trang_thai] || { label: row.trang_thai, color: "default" };
                return <Chip label={chip.label} color={chip.color} size="small" />;
            },
        },
        {
            key: "actions",
            label: "Thao tác",
            render: (row) => {
                const isCreator = row.nguoi_xuat === currentUser?.id;

                return (
                    <Stack direction="row" spacing={0.5}>
                        {(row.trang_thai === "da_duyet" || row.trang_thai === "da_xuat" || (!isCreator && !isCNQYorAdmin)) && (
                            <Tooltip title="Xem">
                                <IconButton size="small" color="primary"
                                    onClick={() => setOpenPhieu({ open: true, id: row.ma_phieu_xuat, mode: "view" })}>
                                    <VisibilityIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}

                        {row.trang_thai === "cho_duyet" && isCNQYorAdmin && (
                            <>
                                <Tooltip title="Duyệt">
                                    <IconButton size="small" color="success"
                                        onClick={() => setConfirm({ open: true, action: "duyet", id: row.ma_phieu_xuat })}>
                                        <CheckCircleIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Từ chối">
                                    <IconButton size="small" color="error"
                                        onClick={() => setConfirm({ open: true, action: "tu_choi", id: row.ma_phieu_xuat })}>
                                        <CancelIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </>
                        )}

                        {row.trang_thai === "cho_duyet" && (isCreator || isCNQYorAdmin) && (
                            <Tooltip title="Sửa">
                                <IconButton size="small" color="primary"
                                    onClick={() => setOpenPhieu({ open: true, id: row.ma_phieu_xuat, mode: "edit" })}>
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}

                        {row.trang_thai === "tu_choi" && isCreator && (
                            <Tooltip title="Sửa">
                                <IconButton size="small" color="primary"
                                    onClick={() => setOpenPhieu({ open: true, id: row.ma_phieu_xuat, mode: "edit" })}>
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}

                        {["cho_duyet", "tu_choi"].includes(row.trang_thai) && (isCreator || isCNQYorAdmin) && (
                            <Tooltip title="Xoá">
                                <IconButton size="small" color="error"
                                    onClick={() => setConfirm({ open: true, action: "xoa", id: row.ma_phieu_xuat })}>
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}


                    </Stack>
                );
            },
        },
    ];

    const confirmLabel = { duyet: "Duyệt", tu_choi: "Từ chối", xoa: "Xoá" };

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

                            <Button variant="contained" startIcon={<AddIcon />}
                                onClick={() => setOpenPhieu({ open: true, id: null, mode: "create" })}>
                                Tạo phiếu xuất
                            </Button>
                        </Stack>

                        <DataTable columns={columns} rows={rows} loading={loading} minWidth={800}
                            emptyMessage="Không có phiếu xuất." />

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

            <PhieuXuatDialog
                open={openPhieu.open}
                phieuId={openPhieu.id}
                mode={openPhieu.mode}
                onClose={() => setOpenPhieu({ open: false, id: null, mode: "create" })}
                onSaved={() => { fetchData(); }}
            />

            <ConfirmDialog
                open={confirm.open}
                title="Xác nhận"
                message={`Bạn có chắc muốn ${confirmLabel[confirm.action]?.toLowerCase() || "thực hiện thao tác"} phiếu xuất này?`}
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

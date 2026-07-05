import { useMemo } from "react";
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
} from "@mui/material";
import {
    Add as AddIcon,
    CheckCircle as CheckCircleIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Visibility as VisibilityIcon,
} from "@mui/icons-material";
import dayjs from "dayjs";
import DataTable from "@/components/common/DataTable.jsx";
import FeedbackSnackbar from "@/components/common/FeedbackSnackbar.jsx";
import PaginationWidget from "@/components/common/PaginationWidget.jsx";
import PhieuDuTruDialog from "./PhieuDuTruDialog.jsx";
import ConfirmDialog from "@/components/common/ConfirmDialog.jsx";
import useDuTruList, { STATUS_CHIP, TRANG_THAI_OPTIONS } from "@/hooks/useDuTruList.js";
import { decodeJWT } from "@/services/api.js";

const ROWS_PER_PAGE = 20;

export default function DuTruList() {
    const {
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
    } = useDuTruList();

    const currentUser = useMemo(() => {
        const token = localStorage.getItem("datamed_access_token");
        return token ? decodeJWT(token) : null;
    }, []);

    const role = currentUser?.role;
    const isCNQYorAdmin = role === "ROLE_ADMIN" || role === "ROLE_CNQY";

    const columns = [
        { key: "ma_phieu_du_tru", label: "Mã phiếu" },
        {
            key: "ngay_lap_phieu",
            label: "Ngày lập",
            render: (row) =>
                row.ngay_lap_phieu
                    ? dayjs(row.ngay_lap_phieu).format("DD/MM/YYYY")
                    : "—",
        },
        { key: "nguoi_lap_ho_ten", label: "Người lập" },
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
                const isCreator = row.nguoi_lap === currentUser?.id;

                return (
                    <Stack direction="row" spacing={0.5}>
                        {(row.trang_thai === "da_duyet" || row.trang_thai === "da_nhap" || (!isCreator && !isCNQYorAdmin)) && (
                            <Tooltip title="Xem">
                                <IconButton size="small" color="primary"
                                    onClick={() => setOpenPhieu({ open: true, id: row.ma_phieu_du_tru, mode: "view" })}>
                                    <VisibilityIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}

                        {row.trang_thai === "chua_duyet" && isCNQYorAdmin && (
                            <Tooltip title="Duyệt">
                                <IconButton size="small" color="success"
                                    onClick={() => openConfirm(row.ma_phieu_du_tru, "duyet")}>
                                    <CheckCircleIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}

                        {row.trang_thai === "chua_duyet" && (isCreator || isCNQYorAdmin) && (
                            <Tooltip title="Sửa">
                                <IconButton size="small" color="primary"
                                    onClick={() => setOpenPhieu({ open: true, id: row.ma_phieu_du_tru, mode: "edit" })}>
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}

                        {row.trang_thai === "tu_choi" && isCreator && (
                            <Tooltip title="Sửa">
                                <IconButton size="small" color="primary"
                                    onClick={() => setOpenPhieu({ open: true, id: row.ma_phieu_du_tru, mode: "edit" })}>
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}

                        {["chua_duyet", "tu_choi"].includes(row.trang_thai) && (isCreator || isCNQYorAdmin) && (
                            <Tooltip title="Xoá">
                                <IconButton size="small" color="error"
                                    onClick={() => openConfirm(row.ma_phieu_du_tru, "xoa")}>
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}

                        {row.trang_thai === "da_duyet" && (
                            <Button size="small" variant="contained"
                                onClick={() => openConfirm(row.ma_phieu_du_tru, "nhap_kho")}>
                                Nhập kho
                            </Button>
                        )}
                    </Stack>
                );
            },
        },
    ];

    return (
        <>
            <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                    <Stack spacing={2.5}>
                        <Stack direction="row" spacing={2} sx={{ justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
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
                open={openPhieu.open}
                phieuId={openPhieu.id}
                mode={openPhieu.mode}
                onClose={() => setOpenPhieu({ open: false, id: null, mode: "create" })}
                onSaved={() => { fetchData(); }}
            />

            <ConfirmDialog
                open={confirm.open}
                title="Xác nhận"
                message={`Bạn có chắc muốn ${ACTION_LABEL[confirm.action]?.toLowerCase() || "thực hiện thao tác"} phiếu dự trù này?`}
                confirmLabel={ACTION_LABEL[confirm.action] || "Xác nhận"}
                confirmColor={confirm.action === "xoa" ? "error" : "primary"}
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

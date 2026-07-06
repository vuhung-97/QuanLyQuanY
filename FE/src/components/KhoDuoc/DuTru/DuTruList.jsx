import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    Button,
    Card,
    CardContent,
    Chip,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Tooltip,
} from "@mui/material";
import {
    Add as AddIcon,
    Cancel as CancelIcon,
    CheckCircle as CheckCircleIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    HourglassEmpty as HourglassEmptyIcon,
    Inventory as InventoryIcon,
    ReceiptLong as ReceiptLongIcon,
    Visibility as VisibilityIcon,
} from "@mui/icons-material";
import dayjs from "dayjs";
import DataTable from "@/components/common/DataTable.jsx";
import FeedbackSnackbar from "@/components/common/FeedbackSnackbar.jsx";
import PaginationWidget from "@/components/common/PaginationWidget.jsx";
import StatCardGrid from "@/components/common/StatCardGrid.jsx";
import PhieuDuTruDialog from "./PhieuDuTruDialog.jsx";
import ConfirmDialog from "@/components/common/ConfirmDialog.jsx";
import useDuTruList, {
    STATUS_CHIP,
    TRANG_THAI_OPTIONS,
    ROWS_PER_PAGE,
} from "@/hooks/useDuTruList.js";
import { decodeJWT } from "@/services/api.js";
import { getNamOptions } from "@/utils/yearOptions.js";

const NAM_OPTIONS = getNamOptions();

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
            const chip = STATUS_CHIP[row.trang_thai] || {
                label: row.trang_thai,
                color: "default",
            };
            return <Chip label={chip.label} color={chip.color} size="small" />;
        },
    },
    {
        key: "actions",
        label: "Thao tác",
        render: (row, _idx, extra) => {
            const {
                currentUser,
                isCNQYorAdmin,
                onView,
                onEdit,
                onDuyet,
                onXoa,
                onNhapKho,
            } = extra || {};
            const isCreator = row.nguoi_lap === currentUser?.id;

            return (
                <Stack direction="row" spacing={0.5}>
                    {(row.trang_thai === "da_duyet" ||
                        row.trang_thai === "da_nhap" ||
                        (!isCreator && !isCNQYorAdmin)) && (
                        <Tooltip title="Xem">
                            <IconButton
                                size="small"
                                color="primary"
                                onClick={() => onView(row.ma_phieu_du_tru)}
                            >
                                <VisibilityIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}

                    {row.trang_thai === "chua_duyet" && isCNQYorAdmin && (
                        <Tooltip title="Duyệt">
                            <IconButton
                                size="small"
                                color="success"
                                onClick={() => onDuyet(row.ma_phieu_du_tru)}
                            >
                                <CheckCircleIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}

                    {row.trang_thai === "chua_duyet" &&
                        (isCreator || isCNQYorAdmin) && (
                            <Tooltip title="Sửa">
                                <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => onEdit(row.ma_phieu_du_tru)}
                                >
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}

                    {row.trang_thai === "tu_choi" && isCreator && (
                        <Tooltip title="Sửa">
                            <IconButton
                                size="small"
                                color="primary"
                                onClick={() => onEdit(row.ma_phieu_du_tru)}
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}

                    {["chua_duyet", "tu_choi"].includes(row.trang_thai) &&
                        (isCreator || isCNQYorAdmin) && (
                            <Tooltip title="Xoá">
                                <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => onXoa(row.ma_phieu_du_tru)}
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}

                    {row.trang_thai === "da_duyet" && (
                        <Button
                            size="small"
                            variant="contained"
                            onClick={() => onNhapKho(row.ma_phieu_du_tru)}
                        >
                            Nhập kho
                        </Button>
                    )}
                </Stack>
            );
        },
    },
];

function DuTruListFilterBar({
    trangThai,
    onTrangThaiChange,
    nam,
    onNamChange,
}) {
    return (
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
            <TextField
                select
                size="small"
                label="Trạng thái"
                value={trangThai}
                onChange={(e) => {
                    onTrangThaiChange(e.target.value);
                }}
                sx={{ minWidth: 160 }}
            >
                {TRANG_THAI_OPTIONS.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                    </MenuItem>
                ))}
            </TextField>

            <FormControl size="small" sx={{ minWidth: 100 }}>
                <InputLabel id="nam-label">Năm</InputLabel>
                <Select
                    labelId="nam-label"
                    value={nam ?? ""}
                    label="Năm"
                    onChange={(e) => {
                        onNamChange(e.target.value || null);
                    }}
                >
                    <MenuItem value="">Tất cả</MenuItem>
                    {NAM_OPTIONS.map((y) => (
                        <MenuItem key={y} value={y}>
                            {y}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Stack>
    );
}

export default function DuTruList() {
    const navigate = useNavigate();
    const {
        rows,
        total,
        page,
        loading,
        trangThai,
        nam,
        stats,
        statsLoading,
        openPhieu,
        confirm,
        snackbar,
        setPage,
        setTrangThai,
        setNam,
        setOpenPhieu,
        setSnackbar,
        setConfirm,
        fetchData,
        handleAction,
        handleView,
        handleEdit,
        openConfirm,
        ACTION_LABEL,
    } = useDuTruList();

    const currentUser = useMemo(() => {
        const token = localStorage.getItem("datamed_access_token");
        return token ? decodeJWT(token) : null;
    }, []);

    const role = currentUser?.role;
    const isCNQYorAdmin = role === "ROLE_ADMIN" || role === "ROLE_CNQY";

    const statItems = useMemo(
        () => [
            {
                label: "Chờ duyệt",
                value: stats.chua_duyet,
                icon: <HourglassEmptyIcon />,
                color: "#F59E0B",
                bg: "#FEF3C7",
            },
            {
                label: "Đã duyệt",
                value: stats.da_duyet,
                icon: <CheckCircleIcon />,
                color: "#10B981",
                bg: "#D1FAE5",
            },
            {
                label: "Đã nhập kho",
                value: stats.da_nhap,
                icon: <InventoryIcon />,
                color: "#00B4D8",
                bg: "#E0F7FA",
            },
            {
                label: "Từ chối",
                value: stats.tu_choi,
                icon: <CancelIcon />,
                color: "#EF4444",
                bg: "#FEE2E2",
            },
        ],
        [stats],
    );

    const rowExtra = useMemo(
        () => ({
            currentUser,
            isCNQYorAdmin,
            onView: handleView,
            onEdit: handleEdit,
            onDuyet: (id) => openConfirm(id, "duyet"),
            onXoa: (id) => openConfirm(id, "xoa"),
            onNhapKho: (id) =>
                navigate("/kho-duoc/nhap", {
                    state: { openNhapKhoPhieuId: id },
                }),
        }),
        [
            currentUser,
            isCNQYorAdmin,
            handleView,
            handleEdit,
            openConfirm,
            navigate,
        ],
    );

    return (
        <>
            <StatCardGrid items={statItems} loading={statsLoading} />

            <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                    <Stack spacing={2.5}>
                        <Stack
                            direction="row"
                            spacing={2}
                            sx={{
                                justifyContent: "space-between",
                                alignItems: "center",
                                flexWrap: "wrap",
                            }}
                        >
                            <DuTruListFilterBar
                                trangThai={trangThai}
                                onTrangThaiChange={(v) => {
                                    setTrangThai(v);
                                    setPage(1);
                                }}
                                nam={nam}
                                onNamChange={(v) => {
                                    setNam(v);
                                    setPage(1);
                                }}
                            />
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() =>
                                    setOpenPhieu({
                                        open: true,
                                        id: null,
                                        mode: "create",
                                    })
                                }
                            >
                                Tạo phiếu dự trù
                            </Button>
                        </Stack>

                        <DataTable
                            columns={columns}
                            rows={rows}
                            loading={loading}
                            minWidth={800}
                            emptyMessage="Không có phiếu dự trù."
                            rowExtra={rowExtra}
                        />

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
                onClose={() =>
                    setOpenPhieu({ open: false, id: null, mode: "create" })
                }
                onSaved={() => {
                    fetchData();
                }}
            />

            <ConfirmDialog
                open={confirm.open}
                title="Xác nhận"
                message={`Bạn có chắc muốn ${ACTION_LABEL[confirm.action]?.toLowerCase() || "thực hiện thao tác"} phiếu dự trù này?`}
                confirmLabel={ACTION_LABEL[confirm.action] || "Xác nhận"}
                confirmColor={confirm.action === "xoa" ? "error" : "primary"}
                onConfirm={() => handleAction(confirm.id, confirm.action)}
                onClose={() =>
                    setConfirm({ open: false, action: null, id: null })
                }
            />

            <FeedbackSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={() =>
                    setSnackbar((prev) => ({ ...prev, open: false }))
                }
            />
        </>
    );
}

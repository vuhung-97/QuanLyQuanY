import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    Button,
    Card,
    CardContent,
    Chip,
    Stack,
} from "@mui/material";
import {
    Add as AddIcon,
    Cancel as CancelIcon,
    CheckCircle as CheckCircleIcon,
    HourglassEmpty as HourglassEmptyIcon,
    Inventory as InventoryIcon,
    Send as SendIcon,
} from "@mui/icons-material";
import dayjs from "dayjs";
import DataTable from "@/components/common/DataTable.jsx";
import FeedbackSnackbar from "@/components/common/FeedbackSnackbar.jsx";
import PaginationWidget from "@/components/common/PaginationWidget.jsx";
import StatCardGrid from "@/components/common/StatCardGrid.jsx";
import StatusFilter from "@/components/common/StatusFilter.jsx";
import PhieuDuTruDialog from "./PhieuDuTruDialog.jsx";
import ConfirmDialog from "@/components/common/ConfirmDialog.jsx";
import YearMonthFilter from "@/components/common/YearMonthFilter.jsx";
import useDuTruList, {
    STATUS_CHIP,
    ROWS_PER_PAGE,
} from "@/hooks/useDuTruList.js";
import { getCurrentUser } from "@/services/api.js";
import DuTruRowActions from "./DuTruRowActions.jsx";

const STAT_ICONS = {
    cho_gui: <SendIcon />,
    chua_duyet: <HourglassEmptyIcon />,
    da_duyet: <CheckCircleIcon />,
    da_nhap: <InventoryIcon />,
    tu_choi: <CancelIcon />,
};
const STAT_COLORS = {
    cho_gui: { color: "#6B7280", bg: "#F3F4F6" },
    chua_duyet: { color: "#F59E0B", bg: "#FEF3C7" },
    da_duyet: { color: "#10B981", bg: "#D1FAE5" },
    da_nhap: { color: "#00B4D8", bg: "#E0F7FA" },
    tu_choi: { color: "#EF4444", bg: "#FEE2E2" },
};
const STAT_LABELS = {
    cho_gui: "Chờ gửi",
    chua_duyet: "Chờ duyệt",
    da_duyet: "Đã duyệt",
    da_nhap: "Đã nhập kho",
    tu_choi: "Từ chối",
};
const STAT_KEYS = ["cho_gui", "chua_duyet", "da_duyet", "da_nhap", "tu_choi"];

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
        render: (row, _idx, extra) => (
            <DuTruRowActions row={row} extra={extra} />
        ),
    },
];

function DuTruListFilterBar({
    trangThai,
    onTrangThaiChange,
    nam,
    onNamChange,
    thang,
    onThangChange,
}) {
    return (
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
            <StatusFilter
                value={trangThai}
                onChange={onTrangThaiChange}
                statusMap={STATUS_CHIP}
            />
            <YearMonthFilter
                nam={nam}
                onNamChange={onNamChange}
                thang={thang}
                onThangChange={onThangChange}
            />
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
    } = useDuTruList();

    const currentUser = useMemo(() => getCurrentUser(), []);

    const role = currentUser?.role;
    const isCNQYorAdmin = role === "ROLE_ADMIN" || role === "ROLE_CNQY";

    const statItems = useMemo(
        () =>
            STAT_KEYS.map((key) => ({
                label: STAT_LABELS[key],
                value: stats[key],
                icon: STAT_ICONS[key],
                ...STAT_COLORS[key],
            })),
        [stats],
    );

    const rowExtra = useMemo(
        () => ({
            currentUser,
            isCNQYorAdmin,
            onView: handleView,
            onEdit: handleEdit,
            onDuyet: (id) => openConfirm(id, "duyet"),
            onGui: (id) => openConfirm(id, "gui"),
            onTuChoi: (id) => openConfirm(id, "tu_choi"),
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
                                thang={thang}
                                onThangChange={(v) => {
                                    setThang(v);
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

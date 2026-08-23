import { useState } from "react";
import {
    Button,
    Card,
    CardContent,
    Stack,
    Typography,
} from "@mui/material";
import ActionIcon from "@/components/common/ActionIcon.jsx";
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Error as ErrorIcon,
    Inventory2 as Inventory2Icon,
    Settings as SettingsIcon,
    Visibility as VisibilityIcon,
    WarningAmber as WarningAmberIcon,
} from "@mui/icons-material";
import dayjs from "dayjs";
import DataTable from "@/components/common/DataTable.jsx";
import FeedbackSnackbar from "@/components/common/FeedbackSnackbar.jsx";
import PaginationWidget from "@/components/common/PaginationWidget.jsx";
import StatCardGrid from "@/components/common/StatCardGrid.jsx";
import SearchBarDebounced from "@/components/common/SearchBarDebounced.jsx";
import StatusFilter from "@/components/common/StatusFilter.jsx";
import ConfirmDialog from "@/components/common/ConfirmDialog.jsx";
import KhoDialog from "./KhoDialog.jsx";
import ThresholdDialog from "./ThresholdDialog.jsx";
import useKhoList from "@/hooks/useKhoList.js";
import useThresholdSettings from "@/hooks/useThresholdSettings.js";
import { ROWS_PER_PAGE } from "@/constants/khoConstant.js";
import IfRole from "@/components/common/IfRole.jsx";
import { ROLES } from "@/constants/roleConstants.js";

const STAT_ICONS = {
    inventory: <Inventory2Icon />,
    warning: <WarningAmberIcon />,
    error: <ErrorIcon />,
};

const columns = [
    {
        key: "loai",
        label: "Loại",
        render: (row) => {
            if (row.loai === "thuoc") return "Thuốc";
            if (row.loai === "vat_tu") return "VTYT";
            return "—";
        },
    },
    { key: "ten_thuoc_vtyt", label: "Tên thuốc / VTYT" },
    { key: "don_vi_tinh", label: "ĐV tính" },
    {
        key: "so_luong",
        label: "Tồn kho",
        align: "right",
        render: (row, _idx, extra) => {
            const qty = row.so_luong ?? 0;
            const t = extra?.thresholds ?? { thuoc: 100, vat_tu: 30 };
            const isThuoc = row.loai !== "vat_tu";
            const lowStock = isThuoc ? qty < t.thuoc : qty < t.vat_tu;
            return (
                <Typography
                    variant="body2"
                    sx={{
                        fontWeight: 600,
                        color:
                            qty <= 5
                                ? "error.main"
                                : lowStock
                                  ? "warning.main"
                                  : "text.primary",
                    }}
                >
                    {qty}
                </Typography>
            );
        },
    },
    { key: "phan_loai", label: "Phân loại" },
    { key: "so_lo_han_dung", label: "Số lô" },
    {
        key: "don_gia",
        label: "Đơn giá",
        align: "right",
        render: (row) => {
            if (row.don_gia == null) return "—";
            return Math.round(Number(row.don_gia)).toLocaleString("vi-VN") + "đ";
        },
    },
    {
        key: "han_su_dung",
        label: "Hạn sử dụng",
        render: (row, _idx, extra) => {
            const isExpiring = extra?.sapHetHanMaSet?.has(row.ma_thuoc_vtyt);
            return row.han_su_dung ? (
                <Typography
                    variant="body2"
                    sx={{
                        fontWeight: isExpiring ? 600 : 400,
                        color: isExpiring ? "error.main" : "text.primary",
                    }}
                >
                    {dayjs(row.han_su_dung).format("DD/MM/YYYY")}
                </Typography>
            ) : (
                "—"
            );
        },
    },
    {
        key: "actions",
        label: "Thao tác",
        render: (row, _idx, extra) => {
            const { onView, onEdit, onDelete } = extra || {};
            return (
                <Stack direction="row" spacing={0.5}>
                    <ActionIcon
                        title="Sửa"
                        icon={<EditIcon />}
                        onClick={() => onEdit(row.ma_thuoc_vtyt)}
                    />
                    <ActionIcon
                        title="Xoá"
                        icon={<DeleteIcon />}
                        color="error"
                        onClick={() => onDelete(row.ma_thuoc_vtyt)}
                    />
                </Stack>
            );
        },
    },
];

export default function KhoList() {
    const { thresholds, updateThresholds } = useThresholdSettings();
    const hook = useKhoList(thresholds);
    const [thresholdDialogOpen, setThresholdDialogOpen] = useState(false);

    const statItems = hook.statItems.map((s) => ({
        ...s,
        icon: STAT_ICONS[s.icon] || null,
    }));

    const rowExtra = {
        ...hook.rowExtra,
        sapHetHanMaSet: hook.sapHetHanMaSet,
        thresholds,
    };

    return (
        <>
            <StatCardGrid
                items={statItems}
                loading={hook.loading}
                onCardClick={hook.handleCardClick}
            />

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
                            <Stack
                                direction="row"
                                spacing={1.5}
                                sx={{ alignItems: "center" }}
                            >
                                <SearchBarDebounced
                                    onSearch={hook.handleSearchChange}
                                    placeholder="Tên, hoạt chất, mã..."
                                />
                                <StatusFilter
                                    value={hook.phanLoaiFilter}
                                    onChange={(v) =>
                                        hook.handlePhanLoaiChange({
                                            target: { value: v },
                                        })
                                    }
                                    options={hook.phanLoaiOptions.map((o) => ({
                                        value: o,
                                        label: o,
                                    }))}
                                    label="Phân loại"
                                />
                            </Stack>
                            <Stack direction="row" spacing={1}>
                                <Button
                                    variant="outlined"
                                    startIcon={<SettingsIcon />}
                                    onClick={() => setThresholdDialogOpen(true)}
                                    sx={{ mr: 1 }}
                                >
                                    Giới hạn tồn kho
                                </Button>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={() =>
                                        hook.setDialog({
                                            open: true,
                                            id: null,
                                            mode: "create",
                                        })
                                    }
                                >
                                    Thêm thuốc / VTYT
                                </Button>
                            </Stack>
                        </Stack>

                        <DataTable
                            columns={columns}
                            rows={hook.paginatedItems}
                            loading={hook.loading}
                            minWidth={800}
                            emptyMessage="Không có thuốc / vật tư y tế nào."
                            rowExtra={rowExtra}
                        />

                        {hook.totalPages > 1 && (
                            <PaginationWidget
                                page={hook.page}
                                totalRecords={hook.filteredItems.length}
                                rowsPerPage={ROWS_PER_PAGE}
                                onChange={hook.setPage}
                            />
                        )}
                    </Stack>
                </CardContent>
            </Card>

            <KhoDialog
                open={hook.dialog.open}
                thuocId={hook.dialog.id}
                mode={hook.dialog.mode}
                onClose={() =>
                    hook.setDialog({
                        open: false,
                        id: null,
                        mode: "create",
                    })
                }
                onSaved={() => {
                    hook.fetchData();
                }}
            />

            <ConfirmDialog
                open={hook.confirm.open}
                title="Xác nhận xoá"
                message="Bạn có chắc muốn xoá thuốc / vật tư y tế này?"
                confirmLabel="Xoá"
                confirmColor="error"
                onConfirm={hook.confirmDelete}
                onClose={() => hook.setConfirm({ open: false, id: null })}
            />

            <ThresholdDialog
                open={thresholdDialogOpen}
                onClose={() => setThresholdDialogOpen(false)}
                initialValues={thresholds}
                onSave={(values) => {
                    updateThresholds("thuoc", values.thuoc);
                    updateThresholds("vat_tu", values.vat_tu);
                    updateThresholds("sapHetHanNgay", values.sapHetHanNgay);
                }}
            />

            <FeedbackSnackbar
                open={hook.snackbar.open}
                message={hook.snackbar.message}
                severity={hook.snackbar.severity}
                onClose={() =>
                    hook.setSnackbar((prev) => ({ ...prev, open: false }))
                }
            />
        </>
    );
}

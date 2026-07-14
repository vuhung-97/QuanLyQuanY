import {
    Button,
    Card,
    CardContent,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import ActionIcon from "@/components/common/ActionIcon.jsx";
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Inventory2 as Inventory2Icon,
    Visibility as VisibilityIcon,
    WarningAmber as WarningAmberIcon,
} from "@mui/icons-material";
import dayjs from "dayjs";
import DataTable from "@/components/common/DataTable.jsx";
import FeedbackSnackbar from "@/components/common/FeedbackSnackbar.jsx";
import PaginationWidget from "@/components/common/PaginationWidget.jsx";
import StatCardGrid from "@/components/common/StatCardGrid.jsx";
import SearchBarDebounced from "@/components/common/SearchBarDebounced.jsx";
import ConfirmDialog from "@/components/common/ConfirmDialog.jsx";
import KhoDialog from "./KhoDialog.jsx";
import useKhoList from "@/hooks/useKhoList.js";
import { ROWS_PER_PAGE } from "@/constants/khoConstant.js";
import IfRole from "@/components/common/IfRole.jsx";
import { ROLES } from "@/constants/roleConstants.js";

const STAT_ICONS = {
    inventory: <Inventory2Icon />,
    warning: <WarningAmberIcon />,
};

const columns = [
    { key: "ma_thuoc_vtyt", label: "Mã" },
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
        render: (row) => {
            const qty = row.so_luong ?? 0;
            return (
                <Typography
                    variant="body2"
                    sx={{
                        fontWeight: 600,
                        color:
                            qty <= 5
                                ? "error.main"
                                : qty <= 10
                                  ? "warning.dark"
                                  : "text.primary",
                    }}
                >
                    {qty}
                </Typography>
            );
        },
    },
    { key: "phan_loai", label: "Phân loại" },
    {
        key: "han_su_dung",
        label: "Hạn sử dụng",
        render: (row) =>
            row.han_su_dung ? dayjs(row.han_su_dung).format("DD/MM/YYYY") : "—",
    },
    {
        key: "actions",
        label: "Thao tác",
        render: (row, _idx, extra) => {
            const { onView, onEdit, onDelete } = extra || {};
            return (
                <Stack direction="row" spacing={0.5}>
                    <ActionIcon title="Xem" icon={<VisibilityIcon />} onClick={() => onView(row.ma_thuoc_vtyt)} />
                    <IfRole roles={[ROLES.ADMIN, ROLES.CNQY]}>
                        <ActionIcon title="Sửa" icon={<EditIcon />} onClick={() => onEdit(row.ma_thuoc_vtyt)} />
                        <ActionIcon title="Xoá" icon={<DeleteIcon />} color="error" onClick={() => onDelete(row.ma_thuoc_vtyt)} />
                    </IfRole>
                </Stack>
            );
        },
    },
];

export default function KhoList() {
    const hook = useKhoList();

    const statItems = hook.statItems.map((s) => ({
        ...s,
        icon: STAT_ICONS[s.icon] || null,
    }));

    return (
        <>
            <StatCardGrid items={statItems} loading={hook.loading} />

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
                                <TextField
                                    select
                                    size="small"
                                    label="Phân loại"
                                    value={hook.phanLoaiFilter}
                                    onChange={hook.handlePhanLoaiChange}
                                    sx={{ minWidth: 160 }}
                                >
                                    <MenuItem value="">Tất cả</MenuItem>
                                    {hook.phanLoaiOptions.map((o) => (
                                        <MenuItem key={o} value={o}>
                                            {o}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Stack>
                            <IfRole roles={[ROLES.ADMIN, ROLES.CNQY]}>
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
                            </IfRole>
                        </Stack>

                        <DataTable
                            columns={columns}
                            rows={hook.paginatedItems}
                            loading={hook.loading}
                            minWidth={800}
                            emptyMessage="Không có thuốc / vật tư y tế nào."
                            rowExtra={hook.rowExtra}
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

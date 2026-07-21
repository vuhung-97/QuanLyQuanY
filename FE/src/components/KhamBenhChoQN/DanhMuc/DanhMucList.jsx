import { useCallback, useMemo, useState } from "react";
import {
    Button,
    Card,
    CardContent,
    Stack,
} from "@mui/material";
import ActionIcon from "@/components/common/ActionIcon.jsx";
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Refresh as RefreshIcon,
} from "@mui/icons-material";
import DataTable from "@/components/common/DataTable.jsx";
import FeedbackSnackbar from "@/components/common/FeedbackSnackbar.jsx";
import PaginationWidget from "@/components/common/PaginationWidget.jsx";
import SearchBarDebounced from "@/components/common/SearchBarDebounced.jsx";
import ConfirmDialog from "@/components/common/ConfirmDialog.jsx";
import DanhMucDialog from "./DanhMucDialog.jsx";
import useStaticList, { invalidateCache } from "@/hooks/useStaticList.js";

const ROWS_PER_PAGE = 100;

export default function DanhMucList({ config }) {
    const [refreshKey, setRefreshKey] = useState(0);
    const allItems = useStaticList(config.url, { pageSize: 500, version: refreshKey });

    const [search, setSearch] = useState("");
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

    const filteredItems = useMemo(() => {
        let items = [...allItems].sort((a, b) =>
            (a[config.nameField] || "").localeCompare(b[config.nameField] || "", "vi")
        );
        if (search.trim()) {
            const q = search.trim().toLowerCase();
            items = items.filter((i) =>
                config.searchFields.some(
                    (field) =>
                        i[field] && i[field].toLowerCase().includes(q),
                ),
            );
        }
        return items;
    }, [allItems, search, config.searchFields, config.nameField]);

    const totalPages = Math.ceil(filteredItems.length / ROWS_PER_PAGE);

    const paginatedItems = useMemo(() => {
        const start = (page - 1) * ROWS_PER_PAGE;
        return filteredItems.slice(start, start + ROWS_PER_PAGE);
    }, [filteredItems, page]);

    const handleRefresh = useCallback(() => setRefreshKey((k) => k + 1), []);

    const handleSearchChange = useCallback((v) => {
        setSearch(v);
        setPage(1);
    }, []);

    const handleEdit = useCallback(
        (id) => setDialog({ open: true, id, mode: "edit" }),
        [],
    );
    const handleDelete = useCallback(
        (id) => setConfirm({ open: true, id }),
        [],
    );

    const handleSaved = useCallback(() => {
        invalidateCache(config.url);
        handleRefresh();
    }, [config.url, handleRefresh]);

    const confirmDelete = useCallback(async () => {
        if (!confirm.id) return;
        try {
            await config.service.delete(confirm.id);
            setSnackbar({
                open: true,
                message: "Xoá thành công",
                severity: "success",
            });
            setConfirm({ open: false, id: null });
            invalidateCache(config.url);
            handleRefresh();
        } catch (err) {
            const msg = err?.response?.data?.detail || "Lỗi xoá dữ liệu";
            setSnackbar({ open: true, message: msg, severity: "error" });
        }
    }, [confirm.id, config.service, config.url, handleRefresh]);

    const rowExtra = useMemo(
        () => ({
            onEdit: handleEdit,
            onDelete: handleDelete,
        }),
        [handleEdit, handleDelete],
    );

    const columns = [
        { key: config.idField, label: "Mã" },
        { key: config.nameField, label: "Tên" },
        { key: "mo_ta", label: "Mô tả" },
        {
            key: "actions",
            label: "Thao tác",
            render: (row, _idx, extra) => {
                const { onEdit, onDelete } = extra || {};
                return (
                    <Stack direction="row" spacing={0.5}>
                        <ActionIcon title="Sửa" icon={<EditIcon />} color="primary" onClick={() => onEdit(row[config.idField])} />
                        <ActionIcon title="Xoá" icon={<DeleteIcon />} color="error" onClick={() => onDelete(row[config.idField])} />
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
                        <Stack
                            direction="row"
                            spacing={2}
                            sx={{
                                justifyContent: "space-between",
                                alignItems: "center",
                                flexWrap: "wrap",
                            }}
                        >
                            <SearchBarDebounced
                                onSearch={handleSearchChange}
                                placeholder="Tìm kiếm..."
                            />
                            <Button
                                variant="outlined"
                                startIcon={<RefreshIcon />}
                                onClick={handleRefresh}
                            >
                                Refresh
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() =>
                                    setDialog({
                                        open: true,
                                        id: null,
                                        mode: "create",
                                    })
                                }
                            >
                                {config.addLabel}
                            </Button>
                        </Stack>

                        <DataTable
                            columns={columns}
                            rows={paginatedItems}
                            loading={false}
                            minWidth={600}
                            emptyMessage={config.emptyMessage}
                            rowExtra={rowExtra}
                        />

                        {totalPages > 1 && (
                            <PaginationWidget
                                page={page}
                                totalRecords={filteredItems.length}
                                rowsPerPage={ROWS_PER_PAGE}
                                onChange={setPage}
                            />
                        )}
                    </Stack>
                </CardContent>
            </Card>

            <DanhMucDialog
                open={dialog.open}
                itemId={dialog.id}
                mode={dialog.mode}
                onClose={() =>
                    setDialog({
                        open: false,
                        id: null,
                        mode: "create",
                    })
                }
                onSaved={handleSaved}
                config={config}
            />

            <ConfirmDialog
                open={confirm.open}
                title="Xác nhận xoá"
                message={config.deleteMessage}
                confirmLabel="Xoá"
                confirmColor="error"
                onConfirm={confirmDelete}
                onClose={() => setConfirm({ open: false, id: null })}
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

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import {
    Button,
    Card,
    CardContent,
    Chip,
    IconButton,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";
import { Visibility as VisibilityIcon } from "@mui/icons-material";
import DataTable from "@/components/common/DataTable.jsx";
import FeedbackSnackbar from "@/components/common/FeedbackSnackbar.jsx";
import FilterModeToggle from "@/components/common/FilterModeToggle.jsx";
import PaginationWidget from "@/components/common/PaginationWidget.jsx";
import { khoDuocService } from "@/services/khoDuocService.js";
import NhapKhoDialog from "./NhapKhoDialog.jsx";

const ROWS_PER_PAGE = 20;

const STATUS_CHIP = {
    da_duyet: { label: "Đã duyệt", color: "success" },
    da_nhap: { label: "Đã nhập", color: "info" },
};

export default function NhapKhoList() {
    const location = useLocation();
    const [filterMode, setFilterMode] = useState("chua_nhap");
    const [rows, setRows] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [selectedPhieuId, setSelectedPhieuId] = useState(
        location.state?.openNhapKhoPhieuId || null,
    );
    const [openDialog, setOpenDialog] = useState(
        !!location.state?.openNhapKhoPhieuId,
    );
    const [dialogMode, setDialogMode] = useState("create");
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "info",
    });

    const handleFilterModeChange = useCallback(() => {
        setFilterMode((prev) =>
            prev === "chua_nhap" ? "tat_ca" : "chua_nhap",
        );
        setPage(1);
    }, []);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const params = {
                limit: ROWS_PER_PAGE,
                offset: (page - 1) * ROWS_PER_PAGE,
            };
            if (filterMode === "chua_nhap") params.trang_thai = "da_duyet";
            const res = await khoDuocService.getDanhSachPhieuDuTru(params);
            const body = res.data || {};
            const allData = body.data || [];
            const filtered =
                filterMode === "chua_nhap"
                    ? allData
                    : allData.filter(
                          (p) =>
                              p.trang_thai === "da_duyet" ||
                              p.trang_thai === "da_nhap",
                      );
            setRows(filtered);
            setTotal(body.total ?? filtered.length);
        } catch {
            setRows([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    }, [page, filterMode]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const openNhapKho = (id, mode = "create") => {
        setSelectedPhieuId(id);
        setDialogMode(mode);
        setOpenDialog(true);
    };

    const columns = useMemo(
        () => [
            { key: "ma_phieu_du_tru", label: "Mã phiếu" },
            { key: "ngay_lap_phieu", label: "Ngày lập" },
            { key: "ma_don_vi", label: "Đơn vị" },
            {
                key: "trang_thai",
                label: "Trạng thái",
                render: (row) => {
                    const chip = STATUS_CHIP[row.trang_thai];
                    return chip ? (
                        <Chip
                            label={chip.label}
                            color={chip.color}
                            size="small"
                        />
                    ) : (
                        row.trang_thai
                    );
                },
            },
            { key: "nguoi_lap", label: "Người lập" },
            {
                key: "actions",
                label: "Thao tác",
                render: (row) =>
                    row.trang_thai === "da_duyet" ? (
                        <Button
                            size="small"
                            variant="contained"
                            onClick={() => openNhapKho(row.ma_phieu_du_tru, "create")}
                        >
                            Nhập kho
                        </Button>
                    ) : (
                        <Tooltip title="Xem">
                            <IconButton
                                size="small"
                                color="primary"
                                onClick={() => openNhapKho(row.ma_phieu_du_tru, "view")}
                            >
                                <VisibilityIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    ),
            },
        ],
        [],
    );

    const emptyMessage =
        filterMode === "chua_nhap"
            ? "Không có phiếu dự trù đã duyệt nào chờ nhập kho."
            : "Không có phiếu dự trù đã duyệt hoặc đã nhập kho.";

    return (
        <>
            <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                    <Stack
                        direction="row"
                        sx={{ mb: 2, justifyContent: "flex-start" }}
                    >
                        <FilterModeToggle
                            filterMode={filterMode}
                            onChange={handleFilterModeChange}
                            selectedDate={null}
                            onDateChange={() => {}}
                            labelLeft="Tất cả"
                            labelRight="Chưa nhập"
                        />
                    </Stack>
                    <Stack spacing={2.5}>
                        <DataTable
                            columns={columns}
                            rows={rows}
                            loading={loading}
                            minWidth={700}
                            emptyMessage={emptyMessage}
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

            {selectedPhieuId && (
                <NhapKhoDialog
                    open={openDialog}
                    onClose={() => {
                        setOpenDialog(false);
                        setSelectedPhieuId(null);
                    }}
                    phieuId={selectedPhieuId}
                    mode={dialogMode}
                    onSaved={() => {
                        fetchData();
                    }}
                />
            )}

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

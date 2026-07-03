import { useCallback, useEffect, useState } from "react";
import { Button, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import DataTable from "@/components/common/DataTable.jsx";
import FeedbackSnackbar from "@/components/common/FeedbackSnackbar.jsx";
import PaginationWidget from "@/components/common/PaginationWidget.jsx";
import { khoDuocService } from "@/services/khoDuocService.js";
import NhapKhoDialog from "./NhapKhoDialog.jsx";

const ROWS_PER_PAGE = 20;

export default function NhapKhoList() {
    const [rows, setRows] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [selectedPhieuId, setSelectedPhieuId] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await khoDuocService.listPhieuDuTru({
                limit: ROWS_PER_PAGE,
                offset: (page - 1) * ROWS_PER_PAGE,
            });
            const data = res.data || [];
            const allData = Array.isArray(data) ? data : data.items || data.data || [];
            const daDuyet = allData.filter((p) => p.trang_thai === "da_duyet");
            setRows(daDuyet);
            setTotal(daDuyet.length);
        } catch {
            setRows([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const openNhapKho = (id) => {
        setSelectedPhieuId(id);
        setOpenDialog(true);
    };

    const columns = [
        { key: "ma_phieu_du_tru", label: "Mã phiếu" },
        { key: "ngay_lap_phieu", label: "Ngày lập" },
        { key: "ma_don_vi", label: "Đơn vị" },
        {
            key: "trang_thai",
            label: "Trạng thái",
            render: (row) => <Chip label="Đã duyệt" color="success" size="small" />,
        },
        { key: "nguoi_lap", label: "Người lập" },
        {
            key: "actions",
            label: "Thao tác",
            render: (row) => (
                <Button
                    size="small"
                    variant="contained"
                    onClick={() => openNhapKho(row.ma_phieu_du_tru)}
                >
                    Nhập kho
                </Button>
            ),
        },
    ];

    return (
        <>
            <Card sx={{ borderRadius: 3 }}>
                {!loading && rows.length === 0 ? (
                    <CardContent>
                        <Stack spacing={2.5}>
                            <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
                                Không có phiếu dự trù đã duyệt nào chờ nhập kho.
                            </Typography>
                        </Stack>
                    </CardContent>
                ) : (
                    <CardContent>
                        <Stack spacing={2.5}>
                            <DataTable
                                columns={columns}
                                rows={rows}
                                loading={loading}
                                minWidth={700}
                                emptyMessage="Không có phiếu dự trù đã duyệt."
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
                )}
            </Card>

            {selectedPhieuId && (
                <NhapKhoDialog
                    open={openDialog}
                    onClose={() => { setOpenDialog(false); setSelectedPhieuId(null); }}
                    phieuId={selectedPhieuId}
                    onSaved={() => { fetchData(); }}
                />
            )}

            <FeedbackSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
            />
        </>
    );
}

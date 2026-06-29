import { useMemo } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Stack,
    Typography,
} from "@mui/material";
import {
    Bed as BedIcon,
    CheckCircle as CheckCircleIcon,
    HourglassEmpty as HourglassEmptyIcon,
    Refresh as RefreshIcon,
    Visibility as VisibilityIcon,
    ExitToApp as ExitToAppIcon,
} from "@mui/icons-material";
import FilterModeToggle from "@/components/common/FilterModeToggle.jsx";
import useDanhSachNoiTru from "@/hooks/useDanhSachNoiTru.jsx";
import DataTable from "@/components/common/DataTable.jsx";
import FeedbackSnackbar from "@/components/common/FeedbackSnackbar.jsx";
import PaginationWidget from "@/components/common/PaginationWidget.jsx";
import ConfirmDialog from "@/components/common/ConfirmDialog.jsx";
import SearchBar from "@/components/common/SearchBar.jsx";
import StatCardGrid from "@/components/common/StatCardGrid.jsx";
import ChiTietBenhAn from "./ChiTietBenhAn.jsx";
import RaVienDialog from "./RaVienDialog.jsx";

const STATUS_MAP = {
    đang_điều_trị: { label: "Đang điều trị", color: "info" },
    đã_ra_viện: { label: "Đã ra viện", color: "success" },
};

const columns = [
    {
        key: "stt",
        label: "STT",
        render: (row, idx, extra) => (extra?.offset || 0) + idx + 1,
    },
    {
        key: "ma_benh_an",
        label: "Mã BA",
        sx: { color: "primary.main" },
    },
    { key: "ho_ten", label: "Họ tên QN" },
    { key: "phong", label: "Phòng", render: (row) => row.ten_buong || "--" },
    {
        key: "ngay_nhap_vien",
        label: "Ngày nhập viện",
        render: (row) =>
            row.ngay_nhap_vien
                ? new Date(row.ngay_nhap_vien).toLocaleDateString("vi-VN")
                : "--",
    },
    {
        key: "chan_doan",
        label: "Chẩn đoán",
        sx: { maxWidth: { xs: 120, md: 250 } },
        render: (row) => (
            <Box sx={{ maxHeight: 100, overflow: "auto", whiteSpace: "normal", wordBreak: "break-word" }}>
                {row.chan_doan || "--"}
            </Box>
        ),
    },
    {
        key: "trang_thai",
        label: "Trạng thái",
        render: (row) => (
            <Chip
                label={STATUS_MAP[row.trang_thai]?.label || row.trang_thai}
                color={STATUS_MAP[row.trang_thai]?.color || "default"}
                size="small"
                sx={{ fontWeight: 600 }}
            />
        ),
    },
    {
        key: "thao_tac",
        label: "Thao tác",
        render: (row, _idx, { onChiTiet, onRaVien }) => (
            <Stack direction="row" spacing={0.5}>
                <Button
                    size="small"
                    variant="outlined"
                    startIcon={<VisibilityIcon />}
                    sx={{ textTransform: "none" }}
                    onClick={() => onChiTiet(row.ma_benh_an)}
                >
                    Chi tiết
                </Button>
                {row.trang_thai === "đang_điều_trị" && (
                    <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        startIcon={<ExitToAppIcon />}
                        sx={{ textTransform: "none" }}
                        onClick={() => onRaVien(row.ma_benh_an)}
                    >
                        Ra viện
                    </Button>
                )}
            </Stack>
        ),
    },
];

export default function DanhSachNoiTru() {
    const {
        initialLoading,
        refreshing,
        searchText,
        setSearchText,
        filtered,
        stats,
        snackbar,
        setSnackbar,
        confirmRaVien,
        handleRaVienClick,
        handleRaVienCancel,
        handleRaVienConfirm,
        handleOpenChiTiet,
        handleCloseChiTiet,
        openChiTiet,
        selectedBenhAnId,
        loadData,
        filterMode,
        handleFilterModeChange,
        page,
        setPage,
        totalRecords,
        ROWS_PER_PAGE,
        offset,
    } = useDanhSachNoiTru();

    const statItems = useMemo(() => {
        const items = [
            {
                label: "Chờ nhập viện",
                value: stats.choNhapVien,
                icon: <HourglassEmptyIcon />,
                color: "#F59E0B",
                bg: "#FEF3C7",
            },
            {
                label: "Đang điều trị",
                value: stats.dangDieuTri,
                icon: <BedIcon />,
                color: "#0B3B60",
                bg: "#DBEAFE",
            },
        ];
        if (filterMode === "tat_ca") {
            items.push({
                label: "Đã ra viện",
                value: stats.daRaVien,
                icon: <CheckCircleIcon />,
                color: "#10B981",
                bg: "#D1FAE5",
            });
        }
        return items;
    }, [stats, filterMode]);

    return (
        <>
            <StatCardGrid items={statItems} loading={initialLoading} />

            <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                    <Stack
                        direction={{ xs: "column", md: "row" }}
                        spacing={2}
                        sx={{
                            mb: 2,
                            justifyContent: "space-between",
                            alignItems: { md: "center" },
                        }}
                    >
                        <Stack
                            direction="row"
                            spacing={1}
                            sx={{ alignItems: "center" }}
                        >
                            <FilterModeToggle
                                filterMode={filterMode}
                                onChange={handleFilterModeChange}
                                selectedDate={null}
                                onDateChange={() => {}}
                                labelLeft="Tất cả"
                                labelRight="Đang điều trị"
                            />
                        </Stack>
                        <Button
                            variant="outlined"
                            startIcon={<RefreshIcon />}
                            onClick={loadData}
                            sx={{ textTransform: "none" }}
                        >
                            Refresh
                        </Button>
                    </Stack>
                    <SearchBar
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Tìm kiếm bệnh án..."
                    />
                    <DataTable
                        columns={columns}
                        rows={filtered}
                        loading={initialLoading || refreshing}
                        emptyMessage="Không có bệnh án nội trú nào."
                        rowExtra={{
                            onChiTiet: handleOpenChiTiet,
                            onRaVien: handleRaVienClick,
                            offset,
                        }}
                    />
                    {filterMode === "tat_ca" && totalRecords > 0 && (
                        <PaginationWidget
                            page={page}
                            totalRecords={totalRecords}
                            rowsPerPage={ROWS_PER_PAGE}
                            onChange={setPage}
                            sx={{ mt: 2 }}
                        />
                    )}
                </CardContent>
            </Card>

            <ChiTietBenhAn
                open={openChiTiet}
                benhAnId={selectedBenhAnId}
                onClose={handleCloseChiTiet}
            />

            <RaVienDialog
                open={confirmRaVien.open}
                benhAn={filtered.find(
                    (e) => e.ma_benh_an === confirmRaVien.benhAnId,
                )}
                saving={false}
                onConfirm={handleRaVienConfirm}
                onClose={handleRaVienCancel}
            />

            <FeedbackSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
            />
        </>
    );
}

import { useState } from "react";
import { Alert, Box, Button, Stack, Typography } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { khamSucKhoeService } from "../../services/khamSucKhoeService.js";
import useLichKhamData from "../../hooks/useLichKhamData";
import {
    getScheduleStatus,
    statusColor,
} from "../../components/KhamSucKhoe/KhamSucKhoeUtils.js";
import DanhSachLich from "../../components/KhamSucKhoe/LapLich/DanhSachLich.jsx";
import LapLichDialog from "../../components/KhamSucKhoe/LapLich/LapLichDialog.jsx";
import TongQuanDonVi from "../../components/KhamSucKhoe/LapLich/TongQuanDonVi.jsx";
import StatCardGrid from "../../components/common/StatCardGrid.jsx";
import ConfirmDialog from "../../components/common/ConfirmDialog.jsx";

export default function LapLichPage() {
    const {
        schedules,
        chiTietMap,
        unitStats,
        loading,
        error,
        setError,
        summaryItems,
        loadSchedules,
    } = useLichKhamData();

    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("Tất cả");
    const [dialog, setDialog] = useState({
        open: false,
        schedule: null,
        chiTietList: [],
    });
    const [deleteDialog, setDeleteDialog] = useState({
        open: false,
        schedule: null,
        detailInfo: null,
    });

    const filteredSchedules = schedules.filter((row) => {
        const currentStatus = getScheduleStatus(row);
        const keyword = query.trim().toLowerCase();
        const details = chiTietMap[row.ma_lich_kham] || [];
        const detailMatches = details.some(
            (d) =>
                (d.ma_don_vi && d.ma_don_vi.toLowerCase().includes(keyword)) ||
                (d.dia_diem && d.dia_diem.toLowerCase().includes(keyword)),
        );
        const masterMatch = [row.ma_lich_kham]
            .filter(Boolean)
            .some((v) => v.toLowerCase().includes(keyword));
        const matchedKeyword = !keyword || masterMatch || detailMatches;
        const matchedStatus =
            statusFilter === "Tất cả" || statusFilter === currentStatus;
        return matchedKeyword && matchedStatus;
    });

    const handleEdit = (schedule) => {
        setDialog({
            open: true,
            schedule,
            chiTietList: chiTietMap[schedule.ma_lich_kham] || [],
        });
    };

    const handleEditDetail = (schedule, detail) => {
        setDialog({
            open: true,
            schedule,
            chiTietList: chiTietMap[schedule.ma_lich_kham] || [],
        });
    };

    const handleDeleteClick = (schedule) => {
        setDeleteDialog({ open: true, schedule, detailInfo: null });
    };

    const handleDeleteDetail = (schedule, detail) => {
        setDeleteDialog({ open: true, schedule, detailInfo: detail });
    };

    const handleDeleteConfirm = async () => {
        try {
            if (deleteDialog.detailInfo) {
                await khamSucKhoeService.deleteScheduleDetail(
                    deleteDialog.schedule.ma_lich_kham,
                    deleteDialog.detailInfo.ma_don_vi,
                );
            } else {
                await khamSucKhoeService.deleteSchedule(deleteDialog.schedule.ma_lich_kham);
            }
            loadSchedules();
            setDeleteDialog({ open: false, schedule: null, detailInfo: null });
        } catch (err) {
            setError(err.response?.data?.detail || "Không thể xóa.");
        }
    };

    const handleDialogSaved = () => {
        loadSchedules();
    };

    return (
        <Stack spacing={3}>
            <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                sx={{
                    alignItems: { xs: "flex-start", md: "center" },
                    justifyContent: "space-between",
                }}
            >
                <Box>
                    <Typography variant="h1" sx={{ color: "text.primary" }}>
                        Lập lịch khám sức khỏe định kỳ
                    </Typography>
                    <Typography sx={{ mt: 0.75, color: "text.secondary" }}>
                        Quản lý kế hoạch khám sức khỏe năm, xem quân số đơn vị
                        và phân bổ lịch khám.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => {
                        setDialog({
                            open: true,
                            schedule: null,
                            chiTietList: [],
                        });
                    }}
                    sx={{ px: 2.5, py: 1.1, borderRadius: 2.5 }}
                >
                    Tạo lịch khám
                </Button>
            </Stack>

            {error && (
                <Alert severity="warning" onClose={() => setError("")}>
                    {error}
                </Alert>
            )}

            <StatCardGrid
                items={summaryItems}
                sizeOverrides={{ "Thời gian khám": { md: 6 } }}
            />

            <TongQuanDonVi chiTietMap={chiTietMap} />

            <DanhSachLich
                schedules={filteredSchedules}
                chiTietMap={chiTietMap}
                unitMap={unitStats}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                onEditDetail={handleEditDetail}
                onDeleteDetail={handleDeleteDetail}
                getScheduleStatus={getScheduleStatus}
                statusColor={statusColor}
            />

            <LapLichDialog
                open={dialog.open}
                onClose={() =>
                    setDialog({ open: false, schedule: null, chiTietList: [] })
                }
                onSaved={handleDialogSaved}
                schedule={dialog.schedule}
                chiTietList={dialog.chiTietList}
            />

            <ConfirmDialog
                open={deleteDialog.open}
                title="Xác nhận xóa"
                message={
                    deleteDialog.detailInfo
                        ? `Bạn có chắc muốn xóa đơn vị ${deleteDialog.detailInfo.ma_don_vi} khỏi lịch ${deleteDialog.schedule?.ma_lich_kham}?`
                        : `Bạn có chắc muốn xóa lịch khám ${deleteDialog.schedule?.ma_lich_kham}? Hành động này không thể hoàn tác.`
                }
                onConfirm={handleDeleteConfirm}
                onClose={() =>
                    setDeleteDialog({
                        open: false,
                        schedule: null,
                        detailInfo: null,
                    })
                }
            />
        </Stack>
    );
}

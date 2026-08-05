import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Alert, Box, Button, Stack, Typography } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { khamSucKhoeService } from "@/services/khamSucKhoeService.js";
import useLichKhamData from "@/hooks/useLichKhamData";
import {
    getScheduleStatus,
    statusColor,
} from "@/components/KhamSucKhoe/KhamSucKhoeUtils.js";
import DanhSachLich from "@/components/KhamSucKhoe/LapLich/DanhSachLich.jsx";
import LapLichDialog from "@/components/KhamSucKhoe/LapLich/LapLichDialog.jsx";
import TongQuanDonVi from "@/components/KhamSucKhoe/LapLich/TongQuanDonVi.jsx";
import PhanCongNhiemVu from "@/components/KhamSucKhoe/LapLich/PhanCongNhiemVu.jsx";
import ThoiGianKham from "@/components/KhamSucKhoe/LapLich/ThoiGianKham.jsx";
import ConfirmDialog from "@/components/common/ConfirmDialog.jsx";
import IfRole from "@/components/common/IfRole.jsx";
import { ROLES } from "@/constants/roleConstants.js";

export default function LapLichPage() {
    const {
        schedules,
        chiTietMap,
        unitStats,
        unitOptions,
        loading,
        error,
        setError,
        latestSchedule,
        latestStatus,
        loadSchedules,
        refreshCounter,
    } = useLichKhamData();

    const latestApprovedId = latestSchedule?.ma_lich_kham || null;

    const [query, setQuery] = useState("");
    const [searchParams] = useSearchParams();
    const [dialog, setDialog] = useState({
        open: false,
        schedule: null,
        chiTietList: [],
        readOnly: false,
    });
    const [deleteDialog, setDeleteDialog] = useState({
        open: false,
        schedule: null,
        detailInfo: null,
    });

    const filteredSchedules = schedules.filter((row) => {
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
        return matchedKeyword;
    });

    const handleEdit = (schedule) => {
        setDialog({
            open: true,
            schedule,
            chiTietList: chiTietMap[schedule.ma_lich_kham] || [],
            readOnly: false,
        });
    };

    const handleView = (schedule) => {
        setDialog({
            open: true,
            schedule,
            chiTietList: chiTietMap[schedule.ma_lich_kham] || [],
            readOnly: true,
        });
    };

    const handleDeleteClick = (schedule) => {
        setDeleteDialog({ open: true, schedule, detailInfo: null });
    };

    const handleDeleteConfirm = async () => {
        try {
            if (deleteDialog.detailInfo) {
                await khamSucKhoeService.deleteScheduleDetail(
                    deleteDialog.schedule.ma_lich_kham,
                    deleteDialog.detailInfo.ma_don_vi,
                );
            } else {
                await khamSucKhoeService.deleteSchedule(
                    deleteDialog.schedule.ma_lich_kham,
                );
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

    const handleApprove = async (schedule) => {
        try {
            await khamSucKhoeService.approveSchedule(schedule.ma_lich_kham);
            loadSchedules();
        } catch (err) {
            setError(err.response?.data?.detail || "Không thể duyệt lịch khám.");
        }
    };

    const handleSubmit = async (schedule) => {
        try {
            await khamSucKhoeService.submitSchedule(schedule.ma_lich_kham);
            loadSchedules();
        } catch (err) {
            setError(err.response?.data?.detail || "Không thể gửi duyệt lịch khám.");
        }
    };

    const handleReject = async (schedule) => {
        try {
            await khamSucKhoeService.rejectSchedule(schedule.ma_lich_kham);
            loadSchedules();
        } catch (err) {
            setError(err.response?.data?.detail || "Không thể từ chối lịch khám.");
        }
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
                <IfRole roles={[ROLES.ADMIN, ROLES.CNQY, ROLES.BACSI, ROLES.YSI]}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => {
                            setDialog({
                                open: true,
                                schedule: null,
                                chiTietList: [],
                                readOnly: false,
                            });
                        }}
                        sx={{ px: 2.5, py: 1.1, borderRadius: 2.5 }}
                    >
                        Tạo lịch khám
                    </Button>
                </IfRole>
            </Stack>

            {error && (
                <Alert severity="warning" onClose={() => setError("")}>
                    {error}
                </Alert>
            )}

            <DanhSachLich
                schedules={filteredSchedules}
                chiTietMap={chiTietMap}
                loading={loading}
                initialStatus={searchParams.get("filter") || ""}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                onSubmit={handleSubmit}
                onView={handleView}
                getScheduleStatus={getScheduleStatus}
                statusColor={statusColor}
            />

            <ThoiGianKham
                schedule={latestSchedule}
                latestStatus={latestStatus}
            />

            <TongQuanDonVi
                chiTietMap={chiTietMap}
                unitStats={unitStats}
                latestScheduleId={latestApprovedId}
                latestStatus={latestStatus}
            />

            <PhanCongNhiemVu
                latestScheduleId={latestApprovedId}
                latestStatus={latestStatus}
                refreshCounter={refreshCounter}
            />

            <LapLichDialog
                open={dialog.open}
                onClose={() =>
                    setDialog({ open: false, schedule: null, chiTietList: [], readOnly: false })
                }
                onSaved={handleDialogSaved}
                schedule={dialog.schedule}
                chiTietList={dialog.chiTietList}
                unitOptions={unitOptions}
                readOnly={dialog.readOnly}
                onApprove={handleApprove}
                onReject={handleReject}
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

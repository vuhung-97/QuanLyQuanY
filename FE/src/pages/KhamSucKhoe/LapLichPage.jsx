import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Alert, Box, Button, Stack, Typography } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { CheckCircle as CheckCircleIcon, DoDisturb as DoDisturbIcon } from "@mui/icons-material";
import { Update as UpdateIcon } from "@mui/icons-material";
import { khamSucKhoeService } from "@/services/khamSucKhoeService.js";
import useLichKhamData from "@/hooks/useLichKhamData";
import { getScheduleStatus } from "@/components/KhamSucKhoe/KhamSucKhoeUtils.js";
import DanhSachLich from "@/components/KhamSucKhoe/LapLich/DanhSachLich.jsx";
import LapLichDialog from "@/components/KhamSucKhoe/LapLich/LapLichDialog.jsx";
import LichKhamPrintDialog from "@/components/KhamSucKhoe/LapLich/LichKhamPrintDialog.jsx";
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
    const [confirmAction, setConfirmAction] = useState({
        open: false,
        type: null,
        schedule: null,
    });
    const [hoanDialog, setHoanDialog] = useState({
        open: false,
        schedule: null,
    });
    const [printDialog, setPrintDialog] = useState({
        open: false,
        schedule: null,
        chiTietList: [],
    });
    const [activeLichId, setActiveLichId] = useState(null);

    const displaySchedule =
        schedules.find((s) => s.ma_lich_kham === activeLichId) ||
        latestSchedule ||
        null;
    const displayScheduleId = displaySchedule?.ma_lich_kham || null;
    const displayStatus = displaySchedule
        ? getScheduleStatus(displaySchedule)
        : latestStatus;

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

    const handleActionConfirm = () => {
        const { type, schedule } = confirmAction;
        if (type === "approve") {
            handleApprove(schedule);
        } else if (type === "reject") {
            handleReject(schedule);
        }
        setConfirmAction({ open: false, type: null, schedule: null });
    };

    const handleResetDefault = () => {
        setActiveLichId(null);
    };

    const handleHoan = (schedule) => {
        setHoanDialog({ open: true, schedule });
    };

    const handleHoanConfirm = async () => {
        try {
            await khamSucKhoeService.hoanSchedule(
                hoanDialog.schedule.ma_lich_kham,
            );
            loadSchedules();
            setHoanDialog({ open: false, schedule: null });
        } catch (err) {
            setError(err.response?.data?.detail || "Không thể hoãn lịch khám.");
        }
    };

    const handleSelectRow = (maLichKham) => {
        setActiveLichId(maLichKham);
    };

    const handlePrint = (schedule) => {
        setPrintDialog({
            open: true,
            schedule,
            chiTietList: chiTietMap[schedule.ma_lich_kham] || [],
        });
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
                schedules={schedules}
                chiTietMap={chiTietMap}
                loading={loading}
                initialStatus={searchParams.get("filter") || ""}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                onApprove={(schedule) =>
                    setConfirmAction({
                        open: true,
                        type: "approve",
                        schedule,
                    })
                }
                onReject={(schedule) =>
                    setConfirmAction({
                        open: true,
                        type: "reject",
                        schedule,
                    })
                }
                onSubmit={handleSubmit}
                onView={handleView}
                onHoan={handleHoan}
                onPrint={handlePrint}
                activeLichId={activeLichId}
                onSelectRow={handleSelectRow}
                onResetDefault={handleResetDefault}
            />

            <ThoiGianKham
                schedule={displaySchedule}
                latestStatus={displayStatus}
            />

            <TongQuanDonVi
                chiTietMap={chiTietMap}
                unitStats={unitStats}
                latestScheduleId={displayScheduleId}
                latestStatus={displayStatus}
                schedule={displaySchedule}
            />

            <PhanCongNhiemVu
                latestScheduleId={displayScheduleId}
                latestStatus={displayStatus}
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
                schedules={schedules}
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

            <ConfirmDialog
                open={confirmAction.open}
                title={
                    confirmAction.type === "approve"
                        ? "Xác nhận duyệt"
                        : "Xác nhận từ chối"
                }
                message={`Bạn có chắc muốn ${confirmAction.type === "approve" ? "duyệt" : "từ chối"} lịch khám ${confirmAction.schedule?.ma_lich_kham || ""}?`}
                confirmLabel={
                    confirmAction.type === "approve" ? "Duyệt" : "Từ chối"
                }
                confirmColor={
                    confirmAction.type === "approve" ? "success" : "error"
                }
                confirmIcon={
                    confirmAction.type === "approve" ? (
                        <CheckCircleIcon />
                    ) : (
                        <DoDisturbIcon />
                    )
                }
                onConfirm={handleActionConfirm}
                onClose={() =>
                    setConfirmAction({ open: false, type: null, schedule: null })
                }
            />

            <ConfirmDialog
                open={hoanDialog.open}
                title="Xác nhận hoãn lịch khám"
                message={`Bạn có chắc muốn hoãn lịch khám ${hoanDialog.schedule?.ma_lich_kham || ""}? Lịch sẽ chuyển sang trạng thái tạm hoãn và có thể sửa thời gian sau đó.`}
                confirmLabel="Hoãn"
                confirmColor="warning"
                confirmIcon={<UpdateIcon />}
                onConfirm={handleHoanConfirm}
                onClose={() =>
                    setHoanDialog({ open: false, schedule: null })
                }
            />

            <LichKhamPrintDialog
                open={printDialog.open}
                onClose={() =>
                    setPrintDialog({
                        open: false,
                        schedule: null,
                        chiTietList: [],
                    })
                }
                schedule={printDialog.schedule}
                chiTietList={printDialog.chiTietList}
                unitOptions={unitOptions}
            />
        </Stack>
    );
}

import { useState } from "react";
import { Stack, Alert, Typography } from "@mui/material";
import useKhamSucKhoeMain from "@/hooks/useKhamSucKhoeMain.jsx";
import StatCardGrid from "@/components/common/StatCardGrid.jsx";
import FeedbackSnackbar from "@/components/common/FeedbackSnackbar.jsx";
import ConfirmDialog from "@/components/common/ConfirmDialog.jsx";
import BangQuanNhan from "./BangQuanNhan.jsx";
import KhamSucKhoeForm from "./KhamSucKhoeForm.jsx";
import DanhSachPhieuKhamFilterBar from "./DanhSachPhieuKhamFilterBar.jsx";
import LichSuKhamDialog from "./LichSuKhamDialog.jsx";
import KhamSucKhoePrint from "./KhamSucKhoePrint.jsx";
import PrintDialog from "@/components/common/print/PrintDialog.jsx";

function EmptyState({ show, message }) {
    if (!show) return null;
    return (
        <Typography color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
            {message}
        </Typography>
    );
}

export default function KhamSucKhoeMain() {
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });
    const [generatingCodes, setGeneratingCodes] = useState(new Set());
    const [confirmDrawQn, setConfirmDrawQn] = useState(null);
    const {
        soldiers,
        phieuMap,
        stats,
        loading,
        allUnitLookup,
        units,
        selectedSchedule,
        selectedUnit,
        selectedScheduleObj,
        filterModeLeft,
        filteredSchedules,
        handleFilterModeChange,
        handleScheduleChange,
        setSelectedUnit,
        filteredSoldiers,
        statsItems,
        formDialog,
        historyDialog,
        searchText,
        statusFilter,
        setStatusFilter,
        isXetNghiem,
        isLayMauWindow,
        isKhamWindow,
        allowedTabs,
        editableTabs,
        noRoleNotice,
        handleFormSaved,
        handlePrint,
        printDialog,
        closePrintDialog,
        handleEdit,
        handleViewHistory,
        handleViewPhieu,
        closeFormDialog,
        closeHistoryDialog,
        handleGenerateBloodCode,
        handleConfirmBloodDraw,
        handleSearchChange,
    } = useKhamSucKhoeMain();

    const onGenerateBloodCode = async (qn) => {
        setGeneratingCodes((prev) => new Set(prev).add(qn.ma_quan_nhan));
        try {
            await handleGenerateBloodCode(qn);
            setSnackbar({
                open: true,
                message: "Đã tạo mã lấy máu.",
                severity: "success",
            });
        } catch (err) {
            setSnackbar({
                open: true,
                message: err?.message || "Không thể tạo mã lấy máu.",
                severity: "error",
            });
        } finally {
            setGeneratingCodes((prev) => {
                const n = new Set(prev);
                n.delete(qn.ma_quan_nhan);
                return n;
            });
        }
    };

    const onConfirmBloodDraw = async (qn) => {
        setConfirmDrawQn(qn);
    };

    const handleConfirmDraw = async () => {
        const qn = confirmDrawQn;
        setConfirmDrawQn(null);
        if (!qn) return;
        try {
            await handleConfirmBloodDraw(qn);
            setSnackbar({
                open: true,
                message: "Đã xác nhận quân nhân lấy máu xong.",
                severity: "success",
            });
        } catch (err) {
            setSnackbar({
                open: true,
                message: err?.message || "Không thể xác nhận lấy máu.",
                severity: "error",
            });
        }
    };

    return (
        <Stack spacing={3}>
            <DanhSachPhieuKhamFilterBar
                filterModeLeft={filterModeLeft}
                onFilterModeChange={handleFilterModeChange}
                filteredSchedules={filteredSchedules}
                selectedSchedule={selectedSchedule}
                onScheduleChange={handleScheduleChange}
                units={units}
                selectedUnit={selectedUnit}
                onUnitChange={setSelectedUnit}
                exportEnabled={!!selectedSchedule}
                onExport={handlePrint}
            />

            {stats && (
                <StatCardGrid
                    items={statsItems}
                    onCardClick={(keys) => {
                        if (!keys) return;
                        setStatusFilter((prev) =>
                            Array.isArray(keys) &&
                            prev.length === keys.length &&
                            keys.every((k) => prev.includes(k))
                                ? []
                                : keys,
                        );
                    }}
                />
            )}

            {selectedUnit && (
                <BangQuanNhan
                    soldiers={filteredSoldiers}
                    phieuMap={phieuMap}
                    loading={loading}
                    allUnitLookup={allUnitLookup}
                    onSearch={handleSearchChange}
                    statusFilter={statusFilter}
                    onStatusFilterChange={setStatusFilter}
                    onEdit={handleEdit}
                    onViewHistory={handleViewHistory}
                    onGenerateBloodCode={onGenerateBloodCode}
                    onConfirmBloodDraw={onConfirmBloodDraw}
                    generatingCodes={generatingCodes}
                    isXetNghiem={isXetNghiem}
                    isLayMauWindow={isLayMauWindow}
                    isKhamWindow={isKhamWindow}
                />
            )}

            <EmptyState
                show={!selectedUnit && !!selectedSchedule}
                message="Vui lòng chọn đơn vị để xem danh sách quân nhân."
            />
            <EmptyState
                show={!selectedSchedule}
                message="Vui lòng chọn lịch khám để bắt đầu."
            />

            {noRoleNotice && (
                <Alert severity="warning">
                    Bạn chưa được phân công vai trò tạm thời cho lịch khám này,
                    nên chỉ có thể xem kết quả khám, không chỉnh sửa được.
                </Alert>
            )}

            <LichSuKhamDialog
                open={historyDialog.open}
                onClose={closeHistoryDialog}
                quanNhan={historyDialog.qn}
                onViewPhieu={handleViewPhieu}
            />

            {formDialog.open && formDialog.qn && (
                <KhamSucKhoeForm
                    open={formDialog.open}
                    onClose={closeFormDialog}
                    onSaved={handleFormSaved}
                    quanNhan={formDialog.qn}
                    existingPhieu={
                        formDialog.phieu ||
                        phieuMap[formDialog.qn.ma_quan_nhan] ||
                        null
                    }
                    unitLookup={allUnitLookup}
                    maLichKham={selectedSchedule}
                    nam={
                        selectedScheduleObj
                            ? new Date(
                                  selectedScheduleObj.thoi_gian_bat_dau,
                              ).getFullYear()
                            : null
                    }
                    readOnly={formDialog.readOnly || !!formDialog.phieu}
                    allowedTabs={allowedTabs}
                    editableTabs={editableTabs}
                />
            )}

            <PrintDialog
                open={printDialog.open}
                onClose={closePrintDialog}
                title="In danh sách"
                screenClass="kham-suc-khoe-print"
            >
                {printDialog.data && (
                    <KhamSucKhoePrint data={printDialog.data} />
                )}
            </PrintDialog>

            <FeedbackSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
            />

            <ConfirmDialog
                open={Boolean(confirmDrawQn)}
                title="Xác nhận đã lấy máu"
                message={`Xác nhận quân nhân ${confirmDrawQn?.ho_ten || ""} (${confirmDrawQn?.ma_quan_nhan || ""}) đã lấy máu xong?`}
                confirmLabel="Xác nhận"
                onConfirm={handleConfirmDraw}
                onClose={() => setConfirmDrawQn(null)}
            />
        </Stack>
    );
}

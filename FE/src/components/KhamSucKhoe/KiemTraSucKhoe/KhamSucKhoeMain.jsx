import { useState } from "react";
import { Stack, Typography } from "@mui/material";
import useKhamSucKhoeMain from "@/hooks/useKhamSucKhoeMain.jsx";
import StatCardGrid from "@/components/common/StatCardGrid.jsx";
import FeedbackSnackbar from "@/components/common/FeedbackSnackbar.jsx";
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
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const [generatingCodes, setGeneratingCodes] = useState(new Set());
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
        filterTab,
        allowedTabs,
        editableTabs,
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
        handleSearchChange,
        handleFilterTabChange,
        filterTabs,
    } = useKhamSucKhoeMain();

    const onGenerateBloodCode = async (qn) => {
        setGeneratingCodes((prev) => new Set(prev).add(qn.ma_quan_nhan));
        try {
            await handleGenerateBloodCode(qn);
            setSnackbar({ open: true, message: "Đã tạo mã lấy máu.", severity: "success" });
        } catch {
            setSnackbar({ open: true, message: "Không thể tạo mã lấy máu.", severity: "error" });
        } finally {
            setGeneratingCodes((prev) => {
                const n = new Set(prev);
                n.delete(qn.ma_quan_nhan);
                return n;
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

            {stats && <StatCardGrid items={statsItems} />}

            {selectedUnit && (
                <BangQuanNhan
                    soldiers={filteredSoldiers}
                    phieuMap={phieuMap}
                    loading={loading}
                    allUnitLookup={allUnitLookup}
                    onSearch={handleSearchChange}
                    filterTab={filterTab}
                    onFilterTabChange={handleFilterTabChange}
                    onEdit={handleEdit}
                    onViewHistory={handleViewHistory}
                    onGenerateBloodCode={onGenerateBloodCode}
                    generatingCodes={generatingCodes}
                    filterTabs={filterTabs}
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
                    readOnly={!!formDialog.phieu}
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
                {printDialog.data && <KhamSucKhoePrint data={printDialog.data} />}
            </PrintDialog>

            <FeedbackSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
            />
        </Stack>
    );
}

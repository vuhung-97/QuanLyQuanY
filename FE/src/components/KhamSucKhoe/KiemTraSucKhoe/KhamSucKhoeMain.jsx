import { Stack, Typography } from "@mui/material";
import useKhamSucKhoeMain from "@/hooks/useKhamSucKhoeMain.jsx";
import StatCardGrid from "@/components/common/StatCardGrid.jsx";
import BangQuanNhan from "./BangQuanNhan.jsx";
import KhamSucKhoeForm from "./KhamSucKhoeForm.jsx";
import DanhSachPhieuKhamFilterBar from "./DanhSachPhieuKhamFilterBar.jsx";
import LichSuKhamDialog from "./LichSuKhamDialog.jsx";

function EmptyState({ show, message }) {
    if (!show) return null;
    return (
        <Typography color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
            {message}
        </Typography>
    );
}

export default function KhamSucKhoeMain() {
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
        selectedYear,
        years,
        filteredSchedules,
        handleYearChange,
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
        handleExport,
        handleEdit,
        handleViewHistory,
        handleViewPhieu,
        closeFormDialog,
        closeHistoryDialog,
        handleSearchChange,
        handleFilterTabChange,
        filterTabs,
    } = useKhamSucKhoeMain();

    return (
        <Stack spacing={3}>
            <DanhSachPhieuKhamFilterBar
                years={years}
                selectedYear={selectedYear}
                onYearChange={handleYearChange}
                filteredSchedules={filteredSchedules}
                selectedSchedule={selectedSchedule}
                onScheduleChange={handleScheduleChange}
                units={units}
                selectedUnit={selectedUnit}
                onUnitChange={setSelectedUnit}
                exportEnabled={!!selectedSchedule}
                onExport={handleExport}
            />

            {stats && <StatCardGrid items={statsItems} />}

            {selectedUnit && (
                <BangQuanNhan
                    soldiers={filteredSoldiers}
                    phieuMap={phieuMap}
                    loading={loading}
                    allUnitLookup={allUnitLookup}
                    searchText={searchText}
                    onSearchChange={handleSearchChange}
                    filterTab={filterTab}
                    onFilterTabChange={handleFilterTabChange}
                    onEdit={handleEdit}
                    onViewHistory={handleViewHistory}
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
        </Stack>
    );
}

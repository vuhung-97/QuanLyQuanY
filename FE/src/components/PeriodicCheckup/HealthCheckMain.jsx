import { useCallback, useMemo, useState } from "react";
import { Stack, Typography } from "@mui/material";
import {
    CheckCircle as CheckCircleIcon,
    PendingActions as PendingActionsIcon,
    PersonAddAlt as PersonAddAltIcon,
} from "@mui/icons-material";
import useHealthCheckData from "../../hooks/useHealthCheckData";
import {
    filterSoldiers,
    filterTabs,
    getTrangThai,
    statusChipColor,
} from "./periodicUtils";
import { buildXlsContent, saveWorkbook } from "../../utils/xlsExport";
import SoldierFilterBar from "./SoldierFilterBar.jsx";
import SoldierTable from "./SoldierTable.jsx";
import StatsCards from "./StatsCards.jsx";
import HealthCheckForm from "./HealthCheckForm.jsx";
import ExamRecordHistoryDialog from "./ExamRecordHistoryDialog.jsx";

function EmptyState({ show, message }) {
    if (!show) return null;
    return (
        <Typography color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
            {message}
        </Typography>
    );
}

export default function HealthCheckMain() {
    const {
        soldiers,
        phieuMap,
        setPhieuMap,
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
    } = useHealthCheckData();

    const [filterTab, setFilterTab] = useState(0);
    const [searchText, setSearchText] = useState("");
    const [formDialog, setFormDialog] = useState({
        open: false,
        qn: null,
        phieu: null,
    });
    const [historyDialog, setHistoryDialog] = useState({
        open: false,
        qn: null,
    });

    const filteredSoldiers = useMemo(
        () => filterSoldiers(soldiers, phieuMap, filterTab, searchText, getTrangThai),
        [soldiers, phieuMap, filterTab, searchText],
    );

    const statsItems = useMemo(
        () =>
            stats
                ? [
                      {
                          label: "Đã khám",
                          value: stats.da_kham ?? 0,
                          color: "success.main",
                          bg: "rgba(16, 185, 129, 0.12)",
                          icon: <CheckCircleIcon />,
                      },
                      {
                          label: "Đang khám",
                          value: stats.dang_kham ?? 0,
                          color: "warning.main",
                          bg: "rgba(245, 158, 11, 0.14)",
                          icon: <PendingActionsIcon />,
                      },
                      {
                          label: "Còn lại",
                          value: stats.con_lai ?? 0,
                          color: "text.secondary",
                          bg: "rgba(100, 116, 139, 0.12)",
                          icon: <PersonAddAltIcon />,
                      },
                  ]
                : [],
        [stats],
    );

    const handleFormSaved = useCallback(
        (savedPhieu) => {
            if (formDialog.qn) {
                setPhieuMap((prev) => ({
                    ...prev,
                    [formDialog.qn.ma_quan_nhan]: savedPhieu,
                }));
            }
            setFormDialog({ open: false, qn: null, phieu: null });
        },
        [formDialog.qn, setPhieuMap],
    );

    const handleExport = useCallback(async () => {
        const nam = selectedScheduleObj?.thoi_gian_bat_dau
            ? new Date(selectedScheduleObj.thoi_gian_bat_dau).getFullYear()
            : "";
        const wb = buildXlsContent(
            soldiers,
            phieuMap,
            allUnitLookup,
            getTrangThai,
            nam,
        );
        await saveWorkbook(wb, "quan_nhan_chua_hoan_thanh.xlsx");
    }, [soldiers, phieuMap, allUnitLookup, selectedScheduleObj]);

    const handleEdit = useCallback((qn) => {
        document.activeElement?.blur();
        setFormDialog({ open: true, qn, phieu: null });
    }, []);

    const handleViewHistory = useCallback((qn) => {
        setHistoryDialog({ open: true, qn });
    }, []);

    const handleViewPhieu = useCallback(
        (phieu) => {
            setFormDialog({ open: true, qn: historyDialog.qn, phieu });
            setHistoryDialog({ open: false, qn: null });
        },
        [historyDialog.qn],
    );

    const closeFormDialog = useCallback(() => {
        setFormDialog({ open: false, qn: null, phieu: null });
    }, []);

    const closeHistoryDialog = useCallback(() => {
        setHistoryDialog({ open: false, qn: null });
    }, []);

    const handleSearchChange = useCallback((e) => {
        setSearchText(e.target.value);
    }, []);

    const handleFilterTabChange = useCallback((_, v) => {
        setFilterTab(v);
    }, []);

    return (
        <Stack spacing={3}>
            <SoldierFilterBar
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

            {stats && <StatsCards items={statsItems} />}

            {selectedUnit && (
                <SoldierTable
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
                    getTrangThai={getTrangThai}
                    statusChipColor={statusChipColor}
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

            <ExamRecordHistoryDialog
                open={historyDialog.open}
                onClose={closeHistoryDialog}
                quanNhan={historyDialog.qn}
                onViewPhieu={handleViewPhieu}
            />

            {formDialog.open && formDialog.qn && (
                <HealthCheckForm
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
                    nam={
                        selectedScheduleObj
                            ? new Date(
                                  selectedScheduleObj.thoi_gian_bat_dau,
                              ).getFullYear()
                            : null
                    }
                    readOnly={!!formDialog.phieu}
                />
            )}
        </Stack>
    );
}

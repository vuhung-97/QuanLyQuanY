import { useCallback, useEffect, useMemo, useState } from "react";
import {
    CheckCircle as CheckCircleIcon,
    PendingActions as PendingActionsIcon,
    PersonAddAlt as PersonAddAltIcon,
} from "@mui/icons-material";
import useDebounce from "@/hooks/useDebounce.jsx";
import useKhamSucKhoeData from "@/hooks/useKhamSucKhoeData";
import { khamSucKhoeService } from "@/services/khamSucKhoeService.js";
import {
    filterSoldiers,
    filterTabs,
} from "@/components/KhamSucKhoe/KhamSucKhoeUtils.js";
import { ALL_TABS, ROLE_TAB_ACCESS } from "@/components/KhamSucKhoe/KiemTraSucKhoe/KhamSucKhoeFormUtils.js";
import { buildXlsContent, saveWorkbook } from "@/utils/xlsExport";

export default function useKhamSucKhoeMain() {
    const {
        soldiers,
        phieuMap,
        setPhieuMap,
        setAllPhieuMap,
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
        refreshStats,
    } = useKhamSucKhoeData();

    const [filterTab, setFilterTab] = useState(0);
    const [searchText, setSearchText] = useState("");
    const [allowedTabs, setAllowedTabs] = useState(ALL_TABS);
    const [editableTabs, setEditableTabs] = useState(ALL_TABS);
    const debouncedSearchText = useDebounce(searchText);
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
        () =>
            filterSoldiers(
                soldiers,
                phieuMap,
                filterTab,
                debouncedSearchText,
            ),
        [soldiers, phieuMap, filterTab, debouncedSearchText],
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

    useEffect(() => {
        if (formDialog.open && selectedSchedule) {
            khamSucKhoeService.getMyAssignment(selectedSchedule)
                .then((res) => {
                    const data = res.data;
                    if (data && data.ma_vai_tro) {
                        const access = ROLE_TAB_ACCESS[data.ma_vai_tro];
                        if (access) {
                            setAllowedTabs(access.view);
                            setEditableTabs(access.edit);
                            return;
                        }
                    }
                    setAllowedTabs(ALL_TABS);
                    setEditableTabs(ALL_TABS);
                })
                .catch(() => {
                    setAllowedTabs(ALL_TABS);
                    setEditableTabs(ALL_TABS);
                });
        }
    }, [formDialog.open, selectedSchedule]);

    const handleFormSaved = useCallback(
        (savedPhieu) => {
            if (formDialog.qn) {
                const qn = formDialog.qn;
                setPhieuMap((prev) => ({ ...prev, [qn.ma_quan_nhan]: savedPhieu }));
                setAllPhieuMap((prev) => ({ ...prev, [qn.ma_quan_nhan]: savedPhieu }));
            }
            setFormDialog({ open: false, qn: null, phieu: null });
            refreshStats();
        },
        [formDialog.qn, setPhieuMap, setAllPhieuMap, refreshStats],
    );

    const handleExport = useCallback(async () => {
        if (!selectedSchedule) return;
        try {
            const [qnRes, pRes] = await Promise.all([
                khamSucKhoeService.getSoldiersBySchedule(selectedSchedule),
                khamSucKhoeService.getPhieuBySchedule(selectedSchedule),
            ]);
            const allSoldiers = Array.isArray(qnRes.data) ? qnRes.data : [];
            const allPhieuMap = (
                Array.isArray(pRes.data) ? pRes.data : []
            ).reduce((acc, p) => {
                acc[p.ma_quan_nhan] = p;
                return acc;
            }, {});
            const nam = selectedScheduleObj?.thoi_gian_bat_dau
                ? new Date(selectedScheduleObj.thoi_gian_bat_dau).getFullYear()
                : "";
            const wb = buildXlsContent(
                allSoldiers,
                allPhieuMap,
                allUnitLookup,
                nam,
            );
            await saveWorkbook(wb, "quan_nhan_chua_hoan_thanh.xlsx");
        } catch {}
    }, [selectedSchedule, allUnitLookup, selectedScheduleObj]);

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

    return {
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
    };
}

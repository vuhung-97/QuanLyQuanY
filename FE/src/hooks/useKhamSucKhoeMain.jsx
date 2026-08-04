import { useCallback, useEffect, useMemo, useState } from "react";
import {
    CheckCircle as CheckCircleIcon,
    PendingActions as PendingActionsIcon,
    PersonAddAlt as PersonAddAltIcon,
    Science as ScienceIcon,
} from "@mui/icons-material";
import useKhamSucKhoeData from "@/hooks/useKhamSucKhoeData";
import { khamSucKhoeService } from "@/services/khamSucKhoeService.js";
import { fetchAllPages } from "@/utils/fetchAll.js";
import { filterSoldiers } from "@/components/KhamSucKhoe/KhamSucKhoeUtils.js";
import { filterTabs } from "@/constants/khamSucKhoeConstants.js";
import { ALL_TABS, ROLE_TAB_ACCESS } from "@/constants/khamSucKhoeConstants.js";


export default function useKhamSucKhoeMain() {
    const {
        soldiers,
        phieuMap,
        allPhieuMap,
        setPhieuMap,
        setAllPhieuMap,
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
        refreshStats,
    } = useKhamSucKhoeData();

    const [filterTab, setFilterTab] = useState(0);
    const [searchText, setSearchText] = useState("");
    const [allowedTabs, setAllowedTabs] = useState(ALL_TABS);
    const [editableTabs, setEditableTabs] = useState(ALL_TABS);
    const [noRoleNotice, setNoRoleNotice] = useState(false);

    const [formDialog, setFormDialog] = useState({
        open: false,
        qn: null,
        phieu: null,
    });
    const [historyDialog, setHistoryDialog] = useState({
        open: false,
        qn: null,
    });
    const [printDialog, setPrintDialog] = useState({
        open: false,
        data: null,
    });

    const daTaoMa = useMemo(
        () => Object.values(allPhieuMap || {}).filter((p) => p.ma_lay_mau).length,
        [allPhieuMap],
    );

    const filteredSoldiers = useMemo(
        () =>
            filterSoldiers(
                soldiers,
                phieuMap,
                filterTab,
                searchText,
            ),
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
                          label: "Đã tạo mã",
                          value: daTaoMa,
                          color: "secondary.main",
                          bg: "rgba(0, 180, 216, 0.12)",
                          icon: <ScienceIcon />,
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
        [stats, daTaoMa],
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
                            setNoRoleNotice(false);
                            return;
                        }
                    }
                    setAllowedTabs(ALL_TABS);
                    setEditableTabs([]);
                    setNoRoleNotice(true);
                })
                .catch(() => {
                    setAllowedTabs(ALL_TABS);
                    setEditableTabs(ALL_TABS);
                    setNoRoleNotice(false);
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

    const handlePrint = useCallback(async (type = "chua_hoan_thanh") => {
        if (!selectedSchedule) return;
        try {
            const [allSoldiers, pList] = await Promise.all([
                fetchAllPages(`/quan_nhan/lich-kham/${selectedSchedule}`),
                fetchAllPages(`/phieu_kham_suc_khoe/lich-kham/${selectedSchedule}`),
            ]);
            const allPhieuMap = (
                Array.isArray(pList) ? pList : []
            ).reduce((acc, p) => {
                acc[p.ma_quan_nhan] = p;
                return acc;
            }, {});
            const nam = selectedScheduleObj?.thoi_gian_bat_dau
                ? new Date(selectedScheduleObj.thoi_gian_bat_dau).getFullYear()
                : "";
            const isChuaLayMau = type === "chua_lay_mau";
            const filtered = allSoldiers
                .filter((qn) => {
                    const p = allPhieuMap[qn.ma_quan_nhan];
                    if (isChuaLayMau) return !p || !p.ma_lay_mau || !p.xet_nghiem;
                    return !p || p.trang_thai === "chua_kham" || p.trang_thai === "dang_kham";
                })
                .sort((a, b) => {
                    const uA = a.ma_don_vi || "";
                    const uB = b.ma_don_vi || "";
                    if (uA < uB) return -1;
                    if (uA > uB) return 1;
                    return (a.ho_ten || "").localeCompare(b.ho_ten || "", "vi");
                });
            setPrintDialog({
                open: true,
                data: {
                    soldiers: filtered,
                    phieuMap: allPhieuMap,
                    type,
                    nam,
                    unitLookup: allUnitLookup,
                },
            });
        } catch {}
    }, [selectedSchedule, allUnitLookup, selectedScheduleObj]);

    const closePrintDialog = useCallback(() => {
        setPrintDialog({ open: false, data: null });
    }, []);

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

    const handleGenerateBloodCode = useCallback(async (qn) => {
        try {
            const nam = selectedScheduleObj
                ? new Date(selectedScheduleObj.thoi_gian_bat_dau).getFullYear()
                : null;
            const res = await khamSucKhoeService.taoMaLayMau({
                ma_quan_nhan: qn.ma_quan_nhan,
                ma_lich_kham: selectedSchedule,
                nam,
            });
            const saved = res.data;
            setPhieuMap((prev) => ({ ...prev, [qn.ma_quan_nhan]: saved }));
            setAllPhieuMap((prev) => ({ ...prev, [qn.ma_quan_nhan]: saved }));
        } catch {
            throw new Error("Không thể tạo mã lấy máu.");
        }
    }, [selectedSchedule, selectedScheduleObj, setPhieuMap, setAllPhieuMap]);

    const handleSearchChange = useCallback((v) => {
        setSearchText(v);
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
        handleSearchChange,
        handleFilterTabChange,
        filterTabs,
    };
}

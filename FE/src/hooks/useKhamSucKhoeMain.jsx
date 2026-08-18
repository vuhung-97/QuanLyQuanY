import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
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
import {
    isInKhamWindow,
    isInLayMauWindow,
    isScheduleActive,
} from "@/components/KhamSucKhoe/KhamSucKhoeUtils.js";
import { ALL_TABS, ROLE_TAB_ACCESS } from "@/constants/khamSucKhoeConstants.js";
import { getCurrentUser } from "@/services/api.js";
import { ROLES } from "@/constants/roleConstants.js";

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

    const [searchParams] = useSearchParams();
    const [statusFilter, setStatusFilter] = useState(
        searchParams.get("status") || "",
    );
    const [searchText, setSearchText] = useState("");
    const [myAssignment, setMyAssignment] = useState(null);
    const [allowedTabs, setAllowedTabs] = useState(ALL_TABS);
    const [editableTabs, setEditableTabs] = useState(ALL_TABS);
    const [noRoleNotice, setNoRoleNotice] = useState(false);

    const [formDialog, setFormDialog] = useState({
        open: false,
        qn: null,
        phieu: null,
        activeTab: undefined,
    });
    const [historyDialog, setHistoryDialog] = useState({
        open: false,
        qn: null,
    });
    const [printDialog, setPrintDialog] = useState({
        open: false,
        data: null,
    });

    const filteredSoldiers = useMemo(
        () => filterSoldiers(soldiers, phieuMap, statusFilter, searchText),
        [soldiers, phieuMap, statusFilter, searchText],
    );

    const isAdmin = useMemo(() => getCurrentUser()?.role === ROLES.ADMIN, []);

    const isXetNghiem = useMemo(() => {
        const currentUser = getCurrentUser();
        if (currentUser?.role === ROLES.ADMIN) return true;
        return myAssignment?.ma_vai_tro === "xet_nghiem";
    }, [myAssignment]);

    const isLayMauWindow = useMemo(
        () => isInLayMauWindow(selectedScheduleObj),
        [selectedScheduleObj],
    );

    const isKhamWindow = useMemo(
        () => isInKhamWindow(selectedScheduleObj),
        [selectedScheduleObj],
    );

    const scheduleActive = useMemo(
        () => isScheduleActive(selectedScheduleObj),
        [selectedScheduleObj],
    );

    const statsItems = useMemo(
        () =>
            stats
                ? [
                      {
                          label: "Chưa lấy máu xét nghiệm",
                          value:
                              (stats.tong_quan_so ?? 0) -
                              (stats.da_lay_mau ?? 0),
                          color: "secondary.main",
                          bg: "rgba(0, 180, 216, 0.12)",
                          icon: <ScienceIcon />,
                          filterKey: "chua_lay_mau",
                      },
                      {
                          label: "Chưa khám",
                          value: Math.max(
                              0,
                              (stats.da_lay_mau ?? 0) -
                                  (stats.dang_kham ?? 0) -
                                  (stats.da_kham ?? 0),
                          ),
                          color: "text.secondary",
                          bg: "rgba(100, 116, 139, 0.12)",
                          icon: <PersonAddAltIcon />,
                          filterKey: "da_lay_mau",
                      },
                      {
                          label: "Đang khám",
                          value: stats.dang_kham ?? 0,
                          color: "warning.main",
                          bg: "rgba(245, 158, 11, 0.14)",
                          icon: <PendingActionsIcon />,
                          filterKey: "dang_kham",
                      },
                      {
                          label: "Đã khám",
                          value: stats.da_kham ?? 0,
                          color: "success.main",
                          bg: "rgba(16, 185, 129, 0.12)",
                          icon: <CheckCircleIcon />,
                          filterKey: "da_kham",
                      },
                  ]
                : [],
        [stats],
    );

    useEffect(() => {
        if (!selectedSchedule) {
            setMyAssignment(null);
            return;
        }
        let ignore = false;
        khamSucKhoeService
            .getMyAssignment(selectedSchedule)
            .then((res) => {
                if (!ignore) setMyAssignment(res.data || null);
            })
            .catch(() => {
                if (!ignore) setMyAssignment(null);
            });
        return () => {
            ignore = true;
        };
    }, [selectedSchedule]);

    useEffect(() => {
        if (formDialog.open && selectedSchedule) {
            if (isAdmin) {
                setAllowedTabs(ALL_TABS);
                setEditableTabs(ALL_TABS);
                setNoRoleNotice(false);
                return;
            }
            khamSucKhoeService
                .getMyAssignment(selectedSchedule)
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
    }, [formDialog.open, selectedSchedule, isAdmin]);

    const handleFormSaved = useCallback(
        (savedPhieu) => {
            if (formDialog.qn) {
                const qn = formDialog.qn;
                setPhieuMap((prev) => ({
                    ...prev,
                    [qn.ma_quan_nhan]: savedPhieu,
                }));
                setAllPhieuMap((prev) => ({
                    ...prev,
                    [qn.ma_quan_nhan]: savedPhieu,
                }));
            }
            setFormDialog({
                open: false,
                qn: null,
                phieu: null,
                activeTab: undefined,
            });
            refreshStats();
        },
        [formDialog.qn, setPhieuMap, setAllPhieuMap, refreshStats],
    );

    const handlePrint = useCallback(
        async (type = "chua_hoan_thanh") => {
            if (!selectedSchedule) return;
            try {
                const [allSoldiers, pList] = await Promise.all([
                    fetchAllPages(`/quan_nhan/lich-kham/${selectedSchedule}`),
                    fetchAllPages(
                        `/phieu_kham_suc_khoe/lich-kham/${selectedSchedule}`,
                    ),
                ]);
                const allPhieuMap = (Array.isArray(pList) ? pList : []).reduce(
                    (acc, p) => {
                        acc[p.ma_quan_nhan] = p;
                        return acc;
                    },
                    {},
                );
                const nam = selectedScheduleObj?.thoi_gian_bat_dau
                    ? new Date(
                          selectedScheduleObj.thoi_gian_bat_dau,
                      ).getFullYear()
                    : "";
                const isChuaLayMau = type === "chua_lay_mau";
                const filtered = allSoldiers
                    .filter((qn) => {
                        const p = allPhieuMap[qn.ma_quan_nhan];
                        if (isChuaLayMau)
                            return !p || p.trang_thai === "chua_lay_mau";
                        return !p || p.trang_thai !== "da_kham";
                    })
                    .sort((a, b) => {
                        const uA = a.ma_don_vi || "";
                        const uB = b.ma_don_vi || "";
                        if (uA < uB) return -1;
                        if (uA > uB) return 1;
                        return (a.ho_ten || "").localeCompare(
                            b.ho_ten || "",
                            "vi",
                        );
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
        },
        [selectedSchedule, allUnitLookup, selectedScheduleObj],
    );

    const closePrintDialog = useCallback(() => {
        setPrintDialog({ open: false, data: null });
    }, []);

    const handleEdit = useCallback(
        (qn) => {
            document.activeElement?.blur();
            const canEdit = isKhamWindow || (isXetNghiem && scheduleActive);
            setFormDialog({
                open: true,
                qn,
                phieu: null,
                readOnly: isAdmin ? false : !canEdit,
                activeTab: undefined,
            });
        },
        [isKhamWindow, isXetNghiem, scheduleActive, isAdmin],
    );

    const handleViewHistory = useCallback((qn) => {
        setHistoryDialog({ open: true, qn });
    }, []);

    const handleViewPhieu = useCallback(
        (phieu) => {
            setFormDialog({
                open: true,
                qn: historyDialog.qn,
                phieu,
                activeTab: undefined,
            });
            setHistoryDialog({ open: false, qn: null });
        },
        [historyDialog.qn],
    );
    const closeFormDialog = useCallback(() => {
        setFormDialog({
            open: false,
            qn: null,
            phieu: null,
            activeTab: undefined,
        });
    }, []);
    const closeHistoryDialog = useCallback(() => {
        setHistoryDialog({ open: false, qn: null });
    }, []);

    const handleEditXetNghiem = useCallback(
        (item) => {
            document.activeElement?.blur();
            const phieu =
                allPhieuMap[item.ma_quan_nhan] ||
                phieuMap[item.ma_quan_nhan] ||
                null;
            const qn = soldiers.find(
                (s) => s.ma_quan_nhan === item.ma_quan_nhan,
            ) || {
                ma_quan_nhan: item.ma_quan_nhan,
                ho_ten: item.ho_ten,
            };
            setFormDialog({
                open: true,
                qn,
                phieu,
                readOnly: false,
                activeTab: 2,
            });
        },
        [allPhieuMap, phieuMap, soldiers],
    );

    const handleGenerateBloodCode = useCallback(
        async (qn) => {
            if (!isLayMauWindow) {
                throw new Error(
                    "Ngoài thời gian lấy máu, không thể tạo mã lấy máu.",
                );
            }
            try {
                const nam = selectedScheduleObj
                    ? new Date(
                          selectedScheduleObj.thoi_gian_bat_dau,
                      ).getFullYear()
                    : null;
                const res = await khamSucKhoeService.taoMaLayMau({
                    ma_quan_nhan: qn.ma_quan_nhan,
                    ma_lich_kham: selectedSchedule,
                    nam,
                });
                const saved = res.data;
                setPhieuMap((prev) => ({ ...prev, [qn.ma_quan_nhan]: saved }));
                setAllPhieuMap((prev) => ({
                    ...prev,
                    [qn.ma_quan_nhan]: saved,
                }));
                refreshStats();
            } catch (err) {
                const detail = err?.response?.data?.detail;
                throw new Error(detail || "Không thể tạo mã lấy máu.");
            }
        },
        [
            selectedSchedule,
            selectedScheduleObj,
            setPhieuMap,
            setAllPhieuMap,
            isLayMauWindow,
            refreshStats,
        ],
    );

    const handleConfirmBloodDraw = useCallback(
        async (qn) => {
            if (!isLayMauWindow) {
                throw new Error(
                    "Ngoài thời gian lấy máu, không thể xác nhận lấy máu.",
                );
            }
            try {
                const res = await khamSucKhoeService.xacNhanLayMau({
                    ma_quan_nhan: qn.ma_quan_nhan,
                    ma_lich_kham: selectedSchedule,
                });
                const saved = res.data;
                setPhieuMap((prev) => ({ ...prev, [qn.ma_quan_nhan]: saved }));
                setAllPhieuMap((prev) => ({
                    ...prev,
                    [qn.ma_quan_nhan]: saved,
                }));
                refreshStats();
            } catch (err) {
                const detail = err?.response?.data?.detail;
                throw new Error(detail || "Không thể xác nhận lấy máu.");
            }
        },
        [
            selectedSchedule,
            setPhieuMap,
            setAllPhieuMap,
            isLayMauWindow,
            refreshStats,
        ],
    );

    const handleOcrTrichXuat = useCallback(
        async (file) => {
            if (!selectedSchedule) {
                throw new Error("Chưa chọn lịch khám.");
            }
            const res = await khamSucKhoeService.dienKetQuaXetNghiem(
                selectedSchedule,
                file,
            );
            const pList = await fetchAllPages(
                `/phieu_kham_suc_khoe/lich-kham/${selectedSchedule}`,
            );
            const pm = (Array.isArray(pList) ? pList : []).reduce((acc, p) => {
                acc[p.ma_quan_nhan] = p;
                return acc;
            }, {});
            setAllPhieuMap(pm);
            refreshStats();
            return res;
        },
        [selectedSchedule, setAllPhieuMap, refreshStats],
    );

    const handleSearchChange = useCallback((v) => {
        setSearchText(v);
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
        statusFilter,
        setStatusFilter,
        isXetNghiem,
        isLayMauWindow,
        isKhamWindow,
        scheduleActive,
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
        handleEditXetNghiem,
        closeFormDialog,
        closeHistoryDialog,
        handleGenerateBloodCode,
        handleConfirmBloodDraw,
        handleOcrTrichXuat,
        handleSearchChange,
    };
}

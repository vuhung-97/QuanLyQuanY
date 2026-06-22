import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Button,
    Card,
    CardContent,
    Chip,
    Dialog,
    DialogContent,
    DialogTitle,
    List,
    ListItemButton,
    ListItemText,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import {
    CheckCircle as CheckCircleIcon,
    Download as DownloadIcon,
    PendingActions as PendingActionsIcon,
    PersonAddAlt as PersonAddAltIcon,
} from "@mui/icons-material";
import useDebounce from "../../../hooks/useDebounce.jsx";
import useKhamSucKhoeData from "../../../hooks/useKhamSucKhoeData";
import { khamSucKhoeService } from "../../../services/khamSucKhoeService.js";
import {
    filterSoldiers,
    filterTabs,
    getPhanLoai,
    getTrangThai,
    statusChipColor,
} from "../KhamSucKhoeUtils.js";
import { buildXlsContent, saveWorkbook } from "../../../utils/xlsExport";
import BangQuanNhan from "./BangQuanNhan.jsx";
import StatCardGrid from "../../common/StatCardGrid.jsx";
import KhamSucKhoeForm from "./KhamSucKhoeForm.jsx";

function EmptyState({ show, message }) {
    if (!show) return null;
    return (
        <Typography color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
            {message}
        </Typography>
    );
}

function SoldierFilterBar({
    years,
    selectedYear,
    onYearChange,
    filteredSchedules,
    selectedSchedule,
    onScheduleChange,
    units,
    selectedUnit,
    onUnitChange,
    exportEnabled,
    onExport,
}) {
    return (
        <Card sx={{ borderRadius: 3 }}>
            <CardContent>
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    sx={{ alignItems: { sm: "center" } }}
                >
                    <TextField
                        select
                        size="small"
                        label="Chọn năm"
                        value={selectedYear}
                        onChange={(e) => onYearChange(e.target.value)}
                        sx={{ minWidth: 120 }}
                    >
                        <MenuItem value="">-- Tất cả --</MenuItem>
                        {years.map((y) => (
                            <MenuItem key={y} value={y}>
                                {y}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        select
                        size="small"
                        label="Chọn lịch khám"
                        value={selectedSchedule}
                        onChange={(e) => onScheduleChange(e.target.value)}
                        sx={{ minWidth: 250 }}
                    >
                        <MenuItem value="">-- Chọn lịch --</MenuItem>
                        {filteredSchedules.map((s) => (
                            <MenuItem
                                key={s.ma_lich_kham}
                                value={s.ma_lich_kham}
                            >
                                {s.ma_lich_kham} ({s.thoi_gian_bat_dau || ""} -{" "}
                                {s.thoi_gian_ket_thuc || ""})
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        select
                        size="small"
                        label="Chọn đơn vị"
                        value={selectedUnit}
                        onChange={(e) => onUnitChange(e.target.value)}
                        sx={{ minWidth: 250 }}
                        disabled={!selectedSchedule}
                    >
                        <MenuItem value="__ALL__">-- Tất cả đơn vị --</MenuItem>
                        {units.map((u) => (
                            <MenuItem key={u.ma_don_vi} value={u.ma_don_vi}>
                                {u.ten_don_vi} ({u.tong_quan_so} QN)
                            </MenuItem>
                        ))}
                    </TextField>
                    {exportEnabled && (
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<DownloadIcon />}
                            onClick={onExport}
                            sx={{ whiteSpace: "nowrap" }}
                        >
                            Xuất Excel
                        </Button>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
}

function ExamRecordHistoryDialog({ open, onClose, quanNhan, onViewPhieu }) {
    const [phieuList, setPhieuList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open || !quanNhan) return;
        setLoading(true);
        khamSucKhoeService.getPhieuByMaQuanNhan(quanNhan.ma_quan_nhan)
            .then((res) =>
                setPhieuList(Array.isArray(res.data) ? res.data : []),
            )
            .catch(() => setPhieuList([]))
            .finally(() => setLoading(false));
    }, [open, quanNhan]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle
                component="div"
                sx={{ fontWeight: "bold", color: "primary.main" }}
            >
                Lịch sử khám sức khỏe — {quanNhan?.ho_ten} (
                {quanNhan?.ma_quan_nhan})
            </DialogTitle>
            <DialogContent>
                {loading && (
                    <Typography
                        color="text.secondary"
                        sx={{ py: 2, textAlign: "center" }}
                    >
                        Đang tải...
                    </Typography>
                )}
                {!loading && phieuList.length === 0 && (
                    <Typography
                        color="text.secondary"
                        sx={{ py: 2, textAlign: "center" }}
                    >
                        Chưa có phiếu khám nào.
                    </Typography>
                )}
                <List disablePadding>
                    {phieuList.map((phieu) => {
                        const tt = getTrangThai(phieu);
                        const pl = getPhanLoai(phieu);
                        return (
                            <ListItemButton
                                key={phieu.ma_phieu_kham}
                                onClick={() => onViewPhieu(phieu)}
                                sx={{
                                    borderRadius: 2,
                                    mb: 1,
                                    border: "1px solid",
                                    borderColor: "divider",
                                }}
                            >
                                <ListItemText
                                    primary={
                                        <Typography fontWeight="600">
                                            Phiếu {phieu.ma_phieu_kham}
                                            {phieu.nam && ` — Năm ${phieu.nam}`}
                                        </Typography>
                                    }
                                    secondary={pl && `Phân loại: ${pl}`}
                                />
                                <Chip
                                    size="small"
                                    label={tt}
                                    color={
                                        tt === "Đã khám" ? "success" : "warning"
                                    }
                                    sx={{ fontWeight: 600, ml: 1 }}
                                />
                            </ListItemButton>
                        );
                    })}
                </List>
            </DialogContent>
        </Dialog>
    );
}

export default function KhamSucKhoeMain() {
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
    } = useKhamSucKhoeData();

    const [filterTab, setFilterTab] = useState(0);
    const [searchText, setSearchText] = useState("");
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
                getTrangThai,
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
        if (!selectedSchedule) return;
        try {
            const [qnRes, pRes] = await Promise.all([
                khamSucKhoeService.getSoldiersBySchedule(selectedSchedule),
                khamSucKhoeService.getLatestPhieuBySchedule(selectedSchedule),
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
                getTrangThai,
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

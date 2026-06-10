import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Box, Button, Card, CardContent, Chip, LinearProgress, MenuItem,
    Stack, Tab, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Tabs, TextField, Typography,
} from "@mui/material";
import {
    CheckCircle as CheckCircleIcon,
    PendingActions as PendingActionsIcon,
    PersonAddAlt as PersonAddAltIcon,
    Visibility as VisibilityIcon,
} from "@mui/icons-material";
import api from "../../services/api.js";
import StatsCards from "./StatsCards.jsx";
import HealthCheckForm from "./HealthCheckForm.jsx";
import SearchBar from "../common/SearchBar.jsx";

const filterTabs = ["Tất cả", "Chưa khám", "Đang khám", "Đã khám"];

function getTrangThai(phieu) {
    if (!phieu) return "Chưa khám";
    if (!phieu.ket_luan) return "Đang khám";
    try {
        const parsed = JSON.parse(phieu.ket_luan);
        if (typeof parsed === "object" && parsed !== null) {
            const hasData = Object.values(parsed).some(v => v && v !== "Loại 1");
            if (!hasData) return "Đang khám";
        }
    } catch {}
    return "Đã khám";
}

function statusChipColor(tt) {
    if (tt === "Đã khám") return { bgcolor: "rgba(16, 185, 129, 0.12)", color: "success.main" };
    if (tt === "Đang khám") return { bgcolor: "rgba(245, 158, 11, 0.14)", color: "warning.main" };
    return { bgcolor: "rgba(100, 116, 139, 0.12)", color: "text.secondary" };
}

export default function HealthCheckMain() {
    const [schedules, setSchedules] = useState([]);
    const [selectedSchedule, setSelectedSchedule] = useState("");
    const [units, setUnits] = useState([]);
    const [selectedUnit, setSelectedUnit] = useState("");
    const [selectedScheduleObj, setSelectedScheduleObj] = useState(null);
    const [soldiers, setSoldiers] = useState([]);
    const [phieuMap, setPhieuMap] = useState({});
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [filterTab, setFilterTab] = useState(0);
    const [formOpen, setFormOpen] = useState(false);
    const [selectedQn, setSelectedQn] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [selectedYear, setSelectedYear] = useState("");
    const [allUnitLookup, setAllUnitLookup] = useState(new Map());

    useEffect(() => {
        api.get("/thong-ke/don-vi").then(res => {
            const list = Array.isArray(res.data) ? res.data : [];
            setAllUnitLookup(new Map(list.map(u => [u.ma_don_vi, u.ten_don_vi])));
        }).catch(() => {});
    }, []);

    useEffect(() => {
        let ignore = false;
        async function load() {
            try {
                const res = await api.get("/lich_kham_sk_nam", { params: { limit: 100 } });
                if (!ignore) {
                    const data = Array.isArray(res.data) ? res.data : [];
                    setSchedules(data);
                    const currentYear = String(new Date().getFullYear());
                    const hasCurrentYear = data.some(s =>
                        s.thoi_gian_bat_dau &&
                        new Date(s.thoi_gian_bat_dau).getFullYear() === Number(currentYear)
                    );
                    setSelectedYear(hasCurrentYear ? currentYear : "");
                }
            } catch {
            }
        }
        load();
        return () => { ignore = true; };
    }, []);

    useEffect(() => {
        if (!selectedSchedule) { setStats(null); return; }
        let ignore = false;
        async function load() {
            try {
                const res = await api.get(`/thong-ke/lich-kham/${selectedSchedule}`);
                if (!ignore) {
                    setStats(res.data);
                    setUnits(res.data.danh_sach_don_vi || []);
                }
            } catch {
                setStats(null);
            }
        }
        load();
        return () => { ignore = true; };
    }, [selectedSchedule]);

    useEffect(() => {
        setSelectedScheduleObj(schedules.find(s => s.ma_lich_kham === selectedSchedule) || null);
    }, [schedules, selectedSchedule]);

    useEffect(() => {
        if (!selectedUnit) { setSoldiers([]); setPhieuMap({}); return; }
        let ignore = false;
        async function load() {
            setLoading(true);
            try {
                const qnRes = await api.get(`/quan_nhan/by-don-vi/${selectedUnit}`);
                const qnList = Array.isArray(qnRes.data) ? qnRes.data : [];
                if (ignore) return;

                let phieuData = {};
                try {
                    const pRes = await api.get(`/phieu_kham_suc_khoe/latest-by-unit/${selectedUnit}`);
                    const list = Array.isArray(pRes.data) ? pRes.data : [];
                    phieuData = {};
                    for (const p of list) {
                        phieuData[p.ma_quan_nhan] = p;
                    }
                } catch {
                }
                if (!ignore) {
                    setSoldiers(qnList);
                    setPhieuMap(phieuData);
                }
            } catch {
            } finally {
                if (!ignore) setLoading(false);
            }
        }
        load();
        return () => { ignore = true; };
    }, [selectedUnit]);

    const years = [...new Set(
        schedules
            .map(s => s.thoi_gian_bat_dau ? new Date(s.thoi_gian_bat_dau).getFullYear() : null)
            .filter(Boolean)
    )].sort((a, b) => b - a);

    const filteredSchedules = selectedYear
        ? schedules.filter(s => {
            const y = s.thoi_gian_bat_dau ? new Date(s.thoi_gian_bat_dau).getFullYear() : null;
            return y === Number(selectedYear);
        })
        : schedules;

    const filteredSoldiers = useMemo(() => soldiers.filter((qn) => {
        const tt = getTrangThai(phieuMap[qn.ma_quan_nhan]);
        if (filterTab === 0) return true;
        if (filterTab === 1) return tt === "Chưa khám";
        if (filterTab === 2) return tt === "Đang khám";
        if (filterTab === 3) return tt === "Đã khám";
        return true;
    }).filter((qn) => {
        if (!searchText) return true;
        const keyword = searchText.toLowerCase().trim();
        return (
            qn.ho_ten?.toLowerCase().includes(keyword) ||
            qn.ma_quan_nhan?.toLowerCase().includes(keyword)
        );
    }).sort((a, b) => {
        const uA = a.ma_don_vi || "";
        const uB = b.ma_don_vi || "";
        if (uA < uB) return -1;
        if (uA > uB) return 1;
        return (a.ho_ten || "").localeCompare(b.ho_ten || "", "vi");
    }), [soldiers, phieuMap, filterTab, searchText]);

    const handleFormSaved = useCallback((savedPhieu) => {
        if (selectedQn) {
            setPhieuMap(prev => ({ ...prev, [selectedQn.ma_quan_nhan]: savedPhieu }));
        }
        setFormOpen(false);
        setSelectedQn(null);
    }, [selectedQn]);

    const statsItems = stats
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
        : [];

    return (
        <Stack spacing={3}>
            <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}
                        sx={{ alignItems: { sm: "center" } }}>
                        <TextField select size="small" label="Chọn năm"
                            value={selectedYear}
                            onChange={(e) => { setSelectedYear(e.target.value); setSelectedSchedule(""); setSelectedUnit(""); }}
                            sx={{ minWidth: 120 }}>
                            <MenuItem value="">-- Tất cả --</MenuItem>
                            {years.map((y) => (
                                <MenuItem key={y} value={y}>{y}</MenuItem>
                            ))}
                        </TextField>
                        <TextField select size="small" label="Chọn lịch khám"
                            value={selectedSchedule}
                            onChange={(e) => { setSelectedSchedule(e.target.value); setSelectedUnit(""); }}
                            sx={{ minWidth: 250 }}>
                            <MenuItem value="">-- Chọn lịch --</MenuItem>
                            {filteredSchedules.map((s) => (
                                <MenuItem key={s.ma_lich_kham} value={s.ma_lich_kham}>
                                    {s.ma_lich_kham} ({s.thoi_gian_bat_dau || ""} - {s.thoi_gian_ket_thuc || ""})
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField select size="small" label="Chọn đơn vị"
                            value={selectedUnit}
                            onChange={(e) => setSelectedUnit(e.target.value)}
                            sx={{ minWidth: 250 }}
                            disabled={!selectedSchedule}>
                            <MenuItem value="">-- Chọn đơn vị --</MenuItem>
                            {units.map((u) => (
                                <MenuItem key={u.ma_dv} value={u.ma_dv}>
                                    {u.ten_dv} ({u.tong_so} QN)
                                </MenuItem>
                            ))}
                        </TextField>
                    </Stack>
                </CardContent>
            </Card>

            {stats && <StatsCards items={statsItems} />}

            {selectedUnit && (
                <Card sx={{ borderRadius: 3 }}>
                    {loading && <LinearProgress />}
                    <CardContent sx={{ p: "24px !important" }}>
                        <Stack direction={{ xs: "column", md: "row" }} spacing={2}
                            sx={{ mb: 2, justifyContent: "space-between", alignItems: { md: "center" } }}>
                            <Typography variant="h2">Danh sách quân nhân</Typography>
                            <SearchBar
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                placeholder="Tìm kiếm quân nhân..."
                            />
                            <Tabs value={filterTab} onChange={(_, v) => setFilterTab(v)}
                                sx={{ minHeight: 36, "& .MuiTab-root": { minHeight: 36, py: 0.5 } }}>
                                {filterTabs.map((t) => (
                                    <Tab key={t} label={t}
                                        sx={{ textTransform: "none", fontSize: 14 }} />
                                ))}
                            </Tabs>
                        </Stack>
                        <TableContainer>
                            <Table sx={{ minWidth: 700 }}>
                                <TableHead>
                                    <TableRow>
                                        {["STT", "Mã QN", "Họ tên", "Đơn vị", "Cấp bậc", "Chức vụ", "Tình trạng khám", "Thao tác"].map((l) => (
                                            <TableCell key={l} sx={{ fontWeight: 700, color: "text.primary" }}>{l}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredSoldiers.map((qn, idx) => {
                                        const phieu = phieuMap[qn.ma_quan_nhan];
                                        const tt = getTrangThai(phieu);
                                        return (
                                            <TableRow key={qn.ma_quan_nhan} hover>
                                                <TableCell>{idx + 1}</TableCell>
                                                <TableCell sx={{ fontWeight: 700, color: "primary.main" }}>
                                                    {qn.ma_quan_nhan}
                                                </TableCell>
                                                <TableCell>{qn.ho_ten || "--"}</TableCell>
                                                <TableCell>{allUnitLookup.get(qn.ma_don_vi) || qn.ma_don_vi || "--"}</TableCell>
                                                <TableCell>{qn.cap_bac || "--"}</TableCell>
                                                <TableCell>{qn.chuc_vu || "--"}</TableCell>
                                                <TableCell>
                                                    <Chip size="small" label={tt}
                                                        sx={{ ...statusChipColor(tt), fontWeight: 700, minWidth: 90 }} />
                                                </TableCell>
                                                <TableCell>
                                                    {tt === "Chưa khám" && (
                                                         <Button size="small" variant="contained"
                                                             onClick={() => { document.activeElement?.blur(); setSelectedQn(qn); setFormOpen(true); }}>
                                                             Khám
                                                         </Button>
                                                     )}
                                                     {(tt === "Đang khám" || tt === "Đã khám") && (
                                                         <Button size="small" variant="outlined"
                                                             startIcon={<VisibilityIcon />}
                                                             onClick={() => { document.activeElement?.blur(); setSelectedQn(qn); setFormOpen(true); }}>
                                                             {tt === "Đã khám" ? "Xem" : "Tiếp tục"}
                                                         </Button>
                                                     )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    {!loading && filteredSoldiers.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={8} align="center" sx={{ py: 6, color: "text.secondary" }}>
                                                Không có quân nhân nào.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            )}

            {!selectedUnit && selectedSchedule && (
                <Typography color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
                    Vui lòng chọn đơn vị để xem danh sách quân nhân.
                </Typography>
            )}

            {!selectedSchedule && (
                <Typography color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
                    Vui lòng chọn lịch khám để bắt đầu.
                </Typography>
            )}

            {selectedQn && (
                <HealthCheckForm
                    open={formOpen}
                    onClose={() => { setFormOpen(false); setSelectedQn(null); }}
                    onSaved={handleFormSaved}
                    quanNhan={selectedQn}
                    existingPhieu={phieuMap[selectedQn.ma_quan_nhan] || null}
                    unitLookup={allUnitLookup}
                    nam={selectedScheduleObj ? new Date(selectedScheduleObj.thoi_gian_bat_dau).getFullYear() : null}
                />
            )}
        </Stack>
    );
}

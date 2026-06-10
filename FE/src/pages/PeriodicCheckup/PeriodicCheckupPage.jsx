import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Stack,
    Typography,
} from "@mui/material";
import {
    Add as AddIcon,
    CalendarMonth as CalendarIcon,
    EventAvailable as EventAvailableIcon,
    Groups as GroupsIcon,
} from "@mui/icons-material";
import api from "../../services/api.js";
import ScheduleList from "../../components/PeriodicCheckup/ScheduleList.jsx";
import ScheduleDialog from "../../components/PeriodicCheckup/ScheduleDialog.jsx";
import UnitOverview from "../../components/PeriodicCheckup/UnitOverview.jsx";

const fallbackSchedules = [
    {
        ma_lich_kham: "LK2026001",
        thoi_gian_bat_dau: "2026-06-10",
        thoi_gian_ket_thuc: "2026-06-18",
    },
    {
        ma_lich_kham: "LK2026002",
        thoi_gian_bat_dau: "2026-07-02",
        thoi_gian_ket_thuc: "2026-07-08",
    },
    {
        ma_lich_kham: "LK2026003",
        thoi_gian_bat_dau: "2026-05-12",
        thoi_gian_ket_thuc: "2026-05-20",
    },
];

function getScheduleStatus(row) {
    const now = new Date();
    const start = row.thoi_gian_bat_dau
        ? new Date(row.thoi_gian_bat_dau)
        : null;
    const end = row.thoi_gian_ket_thuc
        ? new Date(row.thoi_gian_ket_thuc)
        : null;
    if (end && end < now) return "Đã kết thúc";
    if (start && start > now) return "Sắp diễn ra";
    return "Đang thực hiện";
}

function formatDate(value) {
    if (!value) return "--";
    return new Intl.DateTimeFormat("vi-VN").format(new Date(value));
}

function formatDateTime(value) {
    if (!value) return "--";
    return new Intl.DateTimeFormat("vi-VN", {
        hour: "2-digit", minute: "2-digit",
        day: "2-digit", month: "2-digit", year: "numeric",
    }).format(new Date(value));
}

function statusColor(status) {
    if (status === "Đã kết thúc")
        return { bgcolor: "rgba(16, 185, 129, 0.12)", color: "success.main" };
    if (status === "Sắp diễn ra")
        return { bgcolor: "rgba(0, 180, 216, 0.12)", color: "secondary.main" };
    return { bgcolor: "rgba(245, 158, 11, 0.14)", color: "warning.main" };
}

export default function PeriodicCheckupPage() {
    const [schedules, setSchedules] = useState([]);
    const [chiTietMap, setChiTietMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("Tất cả");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState(null);
    const [editingChiTietList, setEditingChiTietList] = useState([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingSchedule, setDeletingSchedule] = useState(null);
    const [deleteDetailInfo, setDeleteDetailInfo] = useState(null);
    const [unitStats, setUnitStats] = useState(null);

    const loadSchedules = useCallback(() => {
        let ignore = false;
        async function load() {
            setLoading(true);
            setError("");
            try {
                const [schRes, uvRes] = await Promise.all([
                    api.get("/lich_kham_sk_nam", {
                        params: {
                            limit: 100,
                            offset: 0,
                            sort_by: "thoi_gian_bat_dau",
                        },
                    }),
                    api.get("/thong-ke/don-vi", { params: { limit: 100 } }),
                ]);
                if (ignore) return;
                const masterList = Array.isArray(schRes.data)
                    ? schRes.data
                    : [];
                setSchedules(masterList);
                setUnitStats(Array.isArray(uvRes.data) ? uvRes.data : []);

                // Load details for each master
                const ctMap = {};
                await Promise.all(
                    masterList.map(async (m) => {
                        try {
                            const ctRes = await api.get(
                                `/lich_kham_sk_nam/${m.ma_lich_kham}/chi-tiet`,
                            );
                            ctMap[m.ma_lich_kham] = Array.isArray(ctRes.data)
                                ? ctRes.data
                                : [];
                        } catch {
                            ctMap[m.ma_lich_kham] = [];
                        }
                    }),
                );
                if (!ignore) setChiTietMap(ctMap);
            } catch (err) {
                if (!ignore) {
                    setError(
                        err.response?.data?.detail ||
                            "Chưa tải được dữ liệu lịch khám từ API.",
                    );
                    setSchedules(fallbackSchedules);
                }
            } finally {
                if (!ignore) setLoading(false);
            }
        }
        load();
        return () => {
            ignore = true;
        };
    }, []);

    useEffect(loadSchedules, [loadSchedules]);

    const filteredSchedules = schedules.filter((row) => {
        const currentStatus = getScheduleStatus(row);
        const keyword = query.trim().toLowerCase();
        const details = chiTietMap[row.ma_lich_kham] || [];
        const detailMatches = details.some(
            (d) =>
                (d.ma_don_vi && d.ma_don_vi.toLowerCase().includes(keyword)) ||
                (d.dia_diem && d.dia_diem.toLowerCase().includes(keyword)),
        );
        const masterMatch = [row.ma_lich_kham]
            .filter(Boolean)
            .some((v) => v.toLowerCase().includes(keyword));
        const matchedKeyword = !keyword || masterMatch || detailMatches;
        const matchedStatus =
            statusFilter === "Tất cả" || statusFilter === currentStatus;
        return matchedKeyword && matchedStatus;
    });

    const allDetails = useMemo(
        () => Object.values(chiTietMap).flat(),
        [chiTietMap],
    );

    const nearestDetail = useMemo(() => {
        const items = Object.values(chiTietMap).flat().filter((d) => d.thoi_gian_bat_dau);
        if (items.length === 0) return null;
        const now = new Date();
        return items.reduce((a, b) =>
            Math.abs(new Date(b.thoi_gian_bat_dau) - now) < Math.abs(new Date(a.thoi_gian_bat_dau) - now) ? b : a
        );
    }, [chiTietMap]);

    const scheduleStats = useMemo(() => {
        const tong = schedules.length;
        const dangThucHien = schedules.filter(
            (s) => getScheduleStatus(s) === "Đang thực hiện",
        ).length;
        return { tong, dangThucHien };
    }, [schedules]);

    const summaryItems = useMemo(() => {
        const totalQn = unitStats
            ? unitStats.reduce((s, u) => s + (u.quan_so || 0), 0)
            : 0;
        const soDonVi = unitStats ? unitStats.length : 0;
        const tongDonViTrongLich = new Set(
            allDetails.map((d) => d.ma_don_vi).filter(Boolean),
        ).size;

        return [
            {
                label: "Tổng quân số",
                value: totalQn,
                note: "Toàn đơn vị",
                color: "primary.main",
                bg: "rgba(11, 59, 96, 0.1)",
                icon: <GroupsIcon />,
            },
            {
                label: "Đơn vị",
                value: soDonVi,
                note: `${tongDonViTrongLich} đã có lịch`,
                color: "secondary.main",
                bg: "rgba(0, 180, 216, 0.12)",
                icon: <EventAvailableIcon />,
            },
            {
                label: "Thời gian khám",
                value: nearestDetail
                    ? `${formatDate(nearestDetail.thoi_gian_bat_dau)} - ${formatDate(nearestDetail.thoi_gian_ket_thuc)}`
                    : "Chưa có",
                note: "",
                color: "success.main",
                bg: "rgba(16, 185, 129, 0.12)",
                icon: <CalendarIcon />,
            },
        ];
    }, [unitStats, allDetails, scheduleStats]);

    const handleEdit = (schedule) => {
        setEditingSchedule(schedule);
        setEditingChiTietList(chiTietMap[schedule.ma_lich_kham] || []);
        setDialogOpen(true);
    };

    const handleEditDetail = (schedule, detail) => {
        setEditingSchedule(schedule);
        setEditingChiTietList(chiTietMap[schedule.ma_lich_kham] || []);
        setDialogOpen(true);
    };

    const handleDeleteClick = (schedule) => {
        setDeletingSchedule(schedule);
        setDeleteDetailInfo(null);
        setDeleteDialogOpen(true);
    };

    const handleDeleteDetail = (schedule, detail) => {
        setDeletingSchedule(schedule);
        setDeleteDetailInfo(detail);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            if (deleteDetailInfo) {
                await api.delete(
                    `/lich_kham_sk_nam/${deletingSchedule.ma_lich_kham}/chi-tiet/${deleteDetailInfo.ma_don_vi}`,
                );
            } else {
                await api.delete(
                    `/lich_kham_sk_nam/${deletingSchedule.ma_lich_kham}`,
                );
            }
            loadSchedules();
            setDeleteDialogOpen(false);
            setDeletingSchedule(null);
            setDeleteDetailInfo(null);
        } catch (err) {
            setError(err.response?.data?.detail || "Không thể xóa.");
        }
    };

    const handleDialogSaved = () => {
        loadSchedules();
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
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => {
                        setEditingSchedule(null);
                        setEditingChiTietList([]);
                        setDialogOpen(true);
                    }}
                    sx={{ px: 2.5, py: 1.1, borderRadius: 2.5 }}
                >
                    Tạo lịch khám
                </Button>
            </Stack>

            {error && (
                <Alert severity="warning" onClose={() => setError("")}>
                    {error}
                </Alert>
            )}

            <Grid container spacing={2.5}>
                {summaryItems.map((item) => (
                    <Grid size={{ xs: 12, sm: 6, md: item.label === "Thời gian khám" ? 6 : 3 }} key={item.label}>
                        <Card sx={{ height: "100%", borderRadius: 3 }}>
                            <CardContent>
                                <Stack
                                    direction="row"
                                    spacing={2}
                                    sx={{ alignItems: "center" }}
                                >
                                    <Box
                                        sx={{
                                            width: 46,
                                            height: 46,
                                            display: "grid",
                                            placeItems: "center",
                                            borderRadius: 2.5,
                                            color: item.color,
                                            bgcolor: item.bg,
                                        }}
                                    >
                                        {item.icon}
                                    </Box>
                                    <Box>
                                        <Typography
                                            variant="h3"
                                            sx={{ color: "text.primary" }}
                                        >
                                            {item.value}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            {item.label}
                                        </Typography>
                                    </Box>
                                </Stack>
                                {item.note && (
                                    <Typography
                                        variant="caption"
                                        sx={{ mt: 2, display: "block" }}
                                    >
                                        {item.note}
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <UnitOverview chiTietMap={chiTietMap} />

            <ScheduleList
                schedules={filteredSchedules}
                chiTietMap={chiTietMap}
                unitMap={unitStats}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                onEditDetail={handleEditDetail}
                onDeleteDetail={handleDeleteDetail}
                query={query}
                onQueryChange={setQuery}
                status={statusFilter}
                onStatusChange={setStatusFilter}
                getScheduleStatus={getScheduleStatus}
                formatDate={formatDate}
                statusColor={statusColor}
            />

            <ScheduleDialog
                open={dialogOpen}
                onClose={() => {
                    setDialogOpen(false);
                    setEditingSchedule(null);
                    setEditingChiTietList([]);
                }}
                onSaved={handleDialogSaved}
                schedule={editingSchedule}
                chiTietList={editingChiTietList}
            />

            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>Xác nhận xóa</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {deleteDetailInfo
                            ? `Bạn có chắc muốn xóa đơn vị ${deleteDetailInfo.ma_don_vi} khỏi lịch ${deletingSchedule?.ma_lich_kham}?`
                            : `Bạn có chắc muốn xóa lịch khám ${deletingSchedule?.ma_lich_kham}? Hành động này không thể hoàn tác.`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5 }}>
                    <Button onClick={() => setDeleteDialogOpen(false)}>
                        Hủy
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        color="error"
                        variant="contained"
                    >
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
}

import { useEffect, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    LinearProgress,
    MenuItem,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import {
    Add as AddIcon,
    CalendarMonth as CalendarIcon,
    CheckCircle as CheckCircleIcon,
    EventAvailable as EventAvailableIcon,
    FactCheck as FactCheckIcon,
    PendingActions as PendingActionsIcon,
    Search as SearchIcon,
} from "@mui/icons-material";
import api from "../../services/api.js";

const statusOptions = ["Tất cả", "Sắp diễn ra", "Đang thực hiện", "Đã kết thúc"];

const summaryCards = [
    {
        label: "Lịch khám năm",
        value: "12",
        note: "Kế hoạch đã lập",
        color: "primary.main",
        bg: "rgba(11, 59, 96, 0.1)",
        icon: <CalendarIcon />,
    },
    {
        label: "Đang thực hiện",
        value: "03",
        note: "Đơn vị trong đợt khám",
        color: "secondary.main",
        bg: "rgba(0, 180, 216, 0.12)",
        icon: <PendingActionsIcon />,
    },
    {
        label: "Phiếu hoàn thành",
        value: "428",
        note: "Quân nhân đã khám",
        color: "success.main",
        bg: "rgba(16, 185, 129, 0.12)",
        icon: <CheckCircleIcon />,
    },
    {
        label: "Cần theo dõi",
        value: "27",
        note: "Có chỉ định bổ sung",
        color: "warning.main",
        bg: "rgba(245, 158, 11, 0.14)",
        icon: <FactCheckIcon />,
    },
];

const fallbackSchedules = [
    {
        ma_lich_kham: "LK2026001",
        ma_don_vi: "DV001",
        thoi_gian_bat_dau: "2026-06-10",
        thoi_gian_ket_thuc: "2026-06-18",
        dia_diem: "Bệnh xá Lữ đoàn",
    },
    {
        ma_lich_kham: "LK2026002",
        ma_don_vi: "DV002",
        thoi_gian_bat_dau: "2026-07-02",
        thoi_gian_ket_thuc: "2026-07-08",
        dia_diem: "Phòng khám Quân y",
    },
    {
        ma_lich_kham: "LK2026003",
        ma_don_vi: "DV003",
        thoi_gian_bat_dau: "2026-05-12",
        thoi_gian_ket_thuc: "2026-05-20",
        dia_diem: "Trạm quân y cơ động",
    },
];

const emptyForm = {
    ma_lich_kham: "",
    ma_don_vi: "",
    thoi_gian_bat_dau: "",
    thoi_gian_ket_thuc: "",
    dia_diem: "",
};

function getScheduleStatus(row) {
    const now = new Date();
    const start = row.thoi_gian_bat_dau ? new Date(row.thoi_gian_bat_dau) : null;
    const end = row.thoi_gian_ket_thuc ? new Date(row.thoi_gian_ket_thuc) : null;

    if (end && end < now) return "Đã kết thúc";
    if (start && start > now) return "Sắp diễn ra";
    return "Đang thực hiện";
}

function formatDate(value) {
    if (!value) return "--";
    return new Intl.DateTimeFormat("vi-VN").format(new Date(value));
}

function statusColor(status) {
    if (status === "Đã kết thúc") return { bgcolor: "rgba(16, 185, 129, 0.12)", color: "success.main" };
    if (status === "Sắp diễn ra") return { bgcolor: "rgba(0, 180, 216, 0.12)", color: "secondary.main" };
    return { bgcolor: "rgba(245, 158, 11, 0.14)", color: "warning.main" };
}

export default function PeriodicCheckupPage() {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState("Tất cả");
    const [openDialog, setOpenDialog] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        let ignore = false;

        async function loadSchedules() {
            setLoading(true);
            setError("");
            try {
                const res = await api.get("/lich_kham_sk_nam", {
                    params: { limit: 100, offset: 0, sort_by: "thoi_gian_bat_dau" },
                });
                if (!ignore) setSchedules(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                if (!ignore) {
                    setError(err.response?.data?.detail || "Chưa tải được dữ liệu lịch khám từ API.");
                    setSchedules(fallbackSchedules);
                }
            } finally {
                if (!ignore) setLoading(false);
            }
        }

        loadSchedules();
        return () => {
            ignore = true;
        };
    }, []);

    const filteredSchedules = schedules.filter((row) => {
        const currentStatus = getScheduleStatus(row);
        const keyword = query.trim().toLowerCase();
        const matchedKeyword = !keyword || [row.ma_lich_kham, row.ma_don_vi, row.dia_diem]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(keyword));
        const matchedStatus = status === "Tất cả" || status === currentStatus;
        return matchedKeyword && matchedStatus;
    });

    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSaving(true);
        try {
            const res = await api.post("/lich_kham_sk_nam", form, {
                headers: { "Content-Type": "application/json" },
            });
            setSchedules((current) => [res.data, ...current]);
            setForm(emptyForm);
            setOpenDialog(false);
        } catch (err) {
            setError(err.response?.data?.detail || "Không thể tạo lịch khám mới.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Stack spacing={3}>
            <Stack
                direction={{ xs: "column", md: "row" }}
                alignItems={{ xs: "flex-start", md: "center" }}
                justifyContent="space-between"
                spacing={2}
            >
                <Box>
                    <Typography variant="h1" sx={{ color: "text.primary" }}>
                        Khám sức khỏe định kỳ
                    </Typography>
                    <Typography sx={{ mt: 0.75, color: "text.secondary" }}>
                        Quản lý kế hoạch khám sức khỏe năm, theo dõi tiến độ và phiếu khám của quân nhân.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenDialog(true)}
                    sx={{ px: 2.5, py: 1.1, borderRadius: 2.5 }}
                >
                    Tạo lịch khám
                </Button>
            </Stack>

            {error && <Alert severity="warning">{error}</Alert>}

            <Grid container spacing={2.5}>
                {summaryCards.map((item) => (
                    <Grid item xs={12} sm={6} md={3} key={item.label}>
                        <Card sx={{ height: "100%", borderRadius: 3 }}>
                            <CardContent>
                                <Stack direction="row" spacing={2} alignItems="center">
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
                                        <Typography variant="h3" sx={{ color: "text.primary" }}>
                                            {item.value}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {item.label}
                                        </Typography>
                                    </Box>
                                </Stack>
                                <Typography variant="caption" sx={{ mt: 2, display: "block" }}>
                                    {item.note}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Card sx={{ borderRadius: 3 }}>
                {loading && <LinearProgress />}
                <CardContent sx={{ p: "24px !important" }}>
                    <Stack
                        direction={{ xs: "column", md: "row" }}
                        justifyContent="space-between"
                        spacing={2}
                        sx={{ mb: 2.5 }}
                    >
                        <Box>
                            <Typography variant="h2">Danh sách lịch khám</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                Dữ liệu theo resource /lich_kham_sk_nam
                            </Typography>
                        </Box>
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                            <TextField
                                size="small"
                                placeholder="Tìm mã lịch, đơn vị, địa điểm"
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: "text.secondary" }} /> }}
                                sx={{ minWidth: { xs: "100%", sm: 280 } }}
                            />
                            <TextField
                                select
                                size="small"
                                value={status}
                                onChange={(event) => setStatus(event.target.value)}
                                sx={{ minWidth: 170 }}
                            >
                                {statusOptions.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Stack>
                    </Stack>

                    <TableContainer>
                        <Table sx={{ minWidth: 760 }}>
                            <TableHead>
                                <TableRow>
                                    {["Mã lịch", "Đơn vị", "Thời gian", "Địa điểm", "Trạng thái", "Phiếu khám"].map((label) => (
                                        <TableCell key={label} sx={{ fontWeight: 700, color: "text.primary" }}>
                                            {label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredSchedules.map((row) => {
                                    const currentStatus = getScheduleStatus(row);
                                    return (
                                        <TableRow key={row.ma_lich_kham} hover>
                                            <TableCell sx={{ fontWeight: 700, color: "primary.main" }}>
                                                {row.ma_lich_kham}
                                            </TableCell>
                                            <TableCell>{row.ma_don_vi || "--"}</TableCell>
                                            <TableCell>
                                                {formatDate(row.thoi_gian_bat_dau)} - {formatDate(row.thoi_gian_ket_thuc)}
                                            </TableCell>
                                            <TableCell>{row.dia_diem || "--"}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    size="small"
                                                    label={currentStatus}
                                                    sx={{ ...statusColor(currentStatus), fontWeight: 700 }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Button size="small" startIcon={<EventAvailableIcon />}>
                                                    Xem phiếu
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                {!loading && filteredSchedules.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 6, color: "text.secondary" }}>
                                            Không có lịch khám phù hợp bộ lọc.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
                <Box component="form" onSubmit={handleSubmit}>
                    <DialogTitle>Tạo lịch khám sức khỏe định kỳ</DialogTitle>
                    <DialogContent>
                        <Stack spacing={2} sx={{ pt: 1 }}>
                            <TextField name="ma_lich_kham" label="Mã lịch khám" value={form.ma_lich_kham} onChange={handleFormChange} required inputProps={{ maxLength: 10 }} />
                            <TextField name="ma_don_vi" label="Mã đơn vị" value={form.ma_don_vi} onChange={handleFormChange} inputProps={{ maxLength: 10 }} />
                            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                <TextField name="thoi_gian_bat_dau" label="Ngày bắt đầu" type="date" value={form.thoi_gian_bat_dau} onChange={handleFormChange} fullWidth InputLabelProps={{ shrink: true }} />
                                <TextField name="thoi_gian_ket_thuc" label="Ngày kết thúc" type="date" value={form.thoi_gian_ket_thuc} onChange={handleFormChange} fullWidth InputLabelProps={{ shrink: true }} />
                            </Stack>
                            <TextField name="dia_diem" label="Địa điểm" value={form.dia_diem} onChange={handleFormChange} multiline minRows={2} />
                        </Stack>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2.5 }}>
                        <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
                        <Button type="submit" variant="contained" disabled={saving}>
                            {saving ? "Đang lưu..." : "Lưu lịch khám"}
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </Stack>
    );
}

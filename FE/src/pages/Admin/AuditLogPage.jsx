import { useEffect, useState } from "react";
import {
    Alert,
    Box,
    Card,
    CardContent,
    Chip,
    Dialog,
    DialogContent,
    DialogTitle,
    LinearProgress,
    Stack,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    Typography,
} from "@mui/material";
import { History as HistoryIcon } from "@mui/icons-material";
import api from "../../services/api.js";

const tabs = [
    { value: "login", label: "Đăng nhập", endpoint: "/nhat_ky_dang_nhap" },
    { value: "action", label: "Thao tác", endpoint: "/nhat_ky_thao_tac" },
    { value: "backup", label: "Backup", endpoint: "/nhat_ky_backup" },
];

const fallbackLogs = {
    login: [{ id: "LG001", id_nguoi_dung: "admin", thoi_gian: "2026-06-03T08:15:00", trang_thai_thanh_cong: true, thiet_bi: "Chrome / Windows" }],
    action: [{ id: "AC001", id_nguoi_dung: "admin", thoi_gian: "2026-06-03T08:20:00", hanh_dong: "CREATE", ten_bang: "nguoi_dung", du_lieu_cu: null, du_lieu_moi: { id: "bs001" }, dia_chi_ip: "127.0.0.1" }],
    backup: [{ id: "BK001", id_nguoi_dung: "admin", thoi_gian_backup: "2026-06-03T07:30:00", duong_dan: "D:/backup/datamed.sql" }],
};

function formatDateTime(value) {
    if (!value) return "--";
    return new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));
}

function asJson(value) {
    if (!value) return "--";
    if (typeof value === "string") return value;
    return JSON.stringify(value, null, 2);
}

export default function AuditLogPage() {
    const [tab, setTab] = useState("login");
    const [logs, setLogs] = useState({ login: [], action: [], backup: [] });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [detail, setDetail] = useState(null);

    useEffect(() => {
        let ignore = false;
        const activeTab = tabs.find((item) => item.value === tab);

        async function loadLogs() {
            setLoading(true);
            setError("");
            try {
                const res = await api.get(activeTab.endpoint, { params: { limit: 100, offset: 0 } });
                if (!ignore) setLogs((current) => ({ ...current, [tab]: Array.isArray(res.data) ? res.data : [] }));
            } catch (err) {
                if (!ignore) {
                    setError(err.response?.data?.detail || "Chưa tải được nhật ký từ API.");
                    setLogs((current) => ({ ...current, [tab]: fallbackLogs[tab] }));
                }
            } finally {
                if (!ignore) setLoading(false);
            }
        }

        loadLogs();
        return () => {
            ignore = true;
        };
    }, [tab]);

    const rows = logs[tab] || [];

    return (
        <Stack spacing={3}>
            <Box>
                <Typography variant="h1">Nhật ký hệ thống</Typography>
                <Typography color="text.secondary" sx={{ mt: 0.75 }}>
                    Theo dõi đăng nhập, thao tác dữ liệu và lịch sử backup của hệ thống.
                </Typography>
            </Box>

            {error && <Alert severity="warning">{error}</Alert>}

            <Card sx={{ borderRadius: 3 }}>
                {loading && <LinearProgress />}
                <CardContent sx={{ p: "24px !important" }}>
                    <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 2, justifyContent: "space-between" }}>
                        <Tabs value={tab} onChange={(_, value) => setTab(value)}>
                            {tabs.map((item) => <Tab key={item.value} value={item.value} label={item.label} />)}
                        </Tabs>
                        <Chip icon={<HistoryIcon />} label={`${rows.length} bản ghi`} color="secondary" variant="outlined" />
                    </Stack>

                    <TableContainer>
                        {tab === "login" && (
                            <Table sx={{ minWidth: 760 }}>
                                <TableHead><TableRow>{["ID", "Người dùng", "Thời gian", "Trạng thái", "Thiết bị"].map((label) => <TableCell key={label} sx={{ fontWeight: 700 }}>{label}</TableCell>)}</TableRow></TableHead>
                                <TableBody>
                                    {rows.map((row) => (
                                        <TableRow key={row.id} hover>
                                            <TableCell sx={{ fontWeight: 700 }}>{row.id}</TableCell>
                                            <TableCell>{row.id_nguoi_dung}</TableCell>
                                            <TableCell>{formatDateTime(row.thoi_gian)}</TableCell>
                                            <TableCell><Chip size="small" label={row.trang_thai_thanh_cong ? "Thành công" : "Thất bại"} color={row.trang_thai_thanh_cong ? "success" : "error"} /></TableCell>
                                            <TableCell>{row.thiet_bi || "--"}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}

                        {tab === "action" && (
                            <Table sx={{ minWidth: 880 }}>
                                <TableHead><TableRow>{["ID", "Người dùng", "Thời gian", "Hành động", "Bảng", "IP", "Chi tiết"].map((label) => <TableCell key={label} sx={{ fontWeight: 700 }}>{label}</TableCell>)}</TableRow></TableHead>
                                <TableBody>
                                    {rows.map((row) => (
                                        <TableRow key={row.id} hover>
                                            <TableCell sx={{ fontWeight: 700 }}>{row.id}</TableCell>
                                            <TableCell>{row.id_nguoi_dung}</TableCell>
                                            <TableCell>{formatDateTime(row.thoi_gian)}</TableCell>
                                            <TableCell><Chip size="small" label={row.hanh_dong || "--"} color="primary" /></TableCell>
                                            <TableCell>{row.ten_bang || "--"}</TableCell>
                                            <TableCell>{row.dia_chi_ip || "--"}</TableCell>
                                            <TableCell><Chip label="Xem" size="small" onClick={() => setDetail(row)} clickable /></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}

                        {tab === "backup" && (
                            <Table sx={{ minWidth: 720 }}>
                                <TableHead><TableRow>{["ID", "Người dùng", "Thời gian backup", "Đường dẫn"].map((label) => <TableCell key={label} sx={{ fontWeight: 700 }}>{label}</TableCell>)}</TableRow></TableHead>
                                <TableBody>
                                    {rows.map((row) => (
                                        <TableRow key={row.id} hover>
                                            <TableCell sx={{ fontWeight: 700 }}>{row.id}</TableCell>
                                            <TableCell>{row.id_nguoi_dung}</TableCell>
                                            <TableCell>{formatDateTime(row.thoi_gian_backup)}</TableCell>
                                            <TableCell>{row.duong_dan}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}

                        {!loading && rows.length === 0 && (
                            <Box sx={{ py: 6, textAlign: "center", color: "text.secondary" }}>Chưa có nhật ký.</Box>
                        )}
                    </TableContainer>
                </CardContent>
            </Card>

            <Dialog open={!!detail} onClose={() => setDetail(null)} fullWidth maxWidth="md">
                <DialogTitle>Chi tiết thao tác</DialogTitle>
                <DialogContent>
                    <Stack spacing={2}>
                        <Box>
                            <Typography fontWeight={700}>Dữ liệu cũ</Typography>
                            <Box component="pre" sx={{ p: 2, bgcolor: "background.default", borderRadius: 2, overflow: "auto" }}>{asJson(detail?.du_lieu_cu)}</Box>
                        </Box>
                        <Box>
                            <Typography fontWeight={700}>Dữ liệu mới</Typography>
                            <Box component="pre" sx={{ p: 2, bgcolor: "background.default", borderRadius: 2, overflow: "auto" }}>{asJson(detail?.du_lieu_moi)}</Box>
                        </Box>
                    </Stack>
                </DialogContent>
            </Dialog>
        </Stack>
    );
}

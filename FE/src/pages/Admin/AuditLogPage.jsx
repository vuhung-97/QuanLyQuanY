import { useEffect, useState } from "react";
import {
    Box,
    Chip,
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
import FeedbackSnackbar from "../../components/FeedbackSnackbar.jsx";
import PaginationWidget from "../../components/PaginationWidget.jsx";
import AdminPageHeader from "../../components/admin/AdminPageHeader.jsx";
import TableCard from "../../components/admin/TableCard.jsx";
import AuditDetailDialog from "../../components/admin/AuditDetailDialog.jsx";

const tabs = [
    { value: "login", label: "Đăng nhập", endpoint: "/nhat_ky_dang_nhap" },
    { value: "action", label: "Thao tác", endpoint: "/nhat_ky_thao_tac" },
    { value: "backup", label: "Backup", endpoint: "/nhat_ky_backup" },
];

function formatDateTime(value) {
    if (!value) return "--";
    return new Intl.DateTimeFormat("vi-VN", {
        dateStyle: "short",
        timeStyle: "short",
    }).format(new Date(value));
}

const ROWS_PER_PAGE = 100;

export default function AuditLogPage() {
    const [tab, setTab] = useState("login");
    const [logs, setLogs] = useState({ login: [], action: [], backup: [] });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [detail, setDetail] = useState(null);
    const [page, setPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    const activeTab = tabs.find((item) => item.value === tab);

    useEffect(() => {
        let ignore = false;

        async function loadLogs() {
            setLoading(true);
            setError("");
            try {
                const res = await api.get(activeTab.endpoint, {
                    params: {
                        limit: ROWS_PER_PAGE,
                        offset: (page - 1) * ROWS_PER_PAGE,
                        sort_by:
                            tab === "backup" ? "thoi_gian_backup" : "thoi_gian",
                        sort_desc: true,
                        include_total: true,
                    },
                });
                if (!ignore) {
                    const data = res.data;
                    setLogs((current) => ({
                        ...current,
                        [tab]: Array.isArray(data) ? data : data.items || [],
                    }));
                    if (data.total !== undefined) setTotalRecords(data.total);
                }
            } catch (err) {
                if (!ignore) {
                    setError(
                        err.response?.data?.detail ||
                            "Chưa tải được nhật ký từ API.",
                    );
                }
            } finally {
                if (!ignore) setLoading(false);
            }
        }

        loadLogs();
        return () => {
            ignore = true;
        };
    }, [tab, page, activeTab.endpoint]);

    const handleTabChange = (_, value) => {
        setTab(value);
        setPage(1);
    };

    const rows = logs[tab] || [];

    return (
        <Stack spacing={3}>
            <AdminPageHeader
                title="Nhật ký hệ thống"
                description="Theo dõi đăng nhập, thao tác dữ liệu và lịch sử backup của hệ thống."
            />

            <TableCard loading={loading}>
                    <Stack
                        direction={{ xs: "column", md: "row" }}
                        spacing={2}
                        sx={{ mb: 2, justifyContent: "space-between" }}
                    >
                        <Tabs value={tab} onChange={handleTabChange}>
                            {tabs.map((item) => (
                                <Tab
                                    key={item.value}
                                    value={item.value}
                                    label={item.label}
                                />
                            ))}
                        </Tabs>
                        <Chip
                            icon={<HistoryIcon />}
                            label={`${totalRecords} bản ghi`}
                            color="secondary"
                            variant="outlined"
                        />
                    </Stack>

                    <PaginationWidget
                        page={page}
                        totalRecords={totalRecords}
                        rowsPerPage={ROWS_PER_PAGE}
                        onChange={setPage}
                        sx={{ mb: 2 }}
                    />

                    <TableContainer>
                        {tab === "login" && (
                            <Table sx={{ minWidth: 760 }}>
                                <TableHead>
                                    <TableRow>
                                        {[
                                            "ID",
                                            "Họ tên",
                                            "ID người dùng",
                                            "Thời gian",
                                            "Trạng thái",
                                            "Thiết bị",
                                        ].map((label) => (
                                            <TableCell
                                                key={label}
                                                sx={{ fontWeight: 700 }}
                                            >
                                                {label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((row) => (
                                        <TableRow key={row.id} hover>
                                            <TableCell sx={{ fontWeight: 700 }}>
                                                {row.id}
                                            </TableCell>
                                            <TableCell>
                                                {row.ho_ten
                                                    ? `${row.ho_ten}`
                                                    : "--"}
                                            </TableCell>
                                            <TableCell>
                                                {row.id_nguoi_dung
                                                    ? `${row.id_nguoi_dung}`
                                                    : "--"}
                                            </TableCell>
                                            <TableCell>
                                                {formatDateTime(row.thoi_gian)}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    size="small"
                                                    label={
                                                        row.trang_thai_thanh_cong
                                                            ? "Thành công"
                                                            : "Thất bại"
                                                    }
                                                    color={
                                                        row.trang_thai_thanh_cong
                                                            ? "success"
                                                            : "error"
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {row.thiet_bi || "--"}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}

                        {tab === "action" && (
                            <Table sx={{ minWidth: 880 }}>
                                <TableHead>
                                    <TableRow>
                                        {[
                                            "ID",
                                            "Họ tên",
                                            "Thời gian",
                                            "Hành động",
                                            "Bảng",
                                            "IP",
                                            "Chi tiết",
                                        ].map((label) => (
                                            <TableCell
                                                key={label}
                                                sx={{ fontWeight: 700 }}
                                            >
                                                {label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((row) => (
                                        <TableRow key={row.id} hover>
                                            <TableCell sx={{ fontWeight: 700 }}>
                                                {row.id}
                                            </TableCell>
                                            <TableCell>
                                                {row.ho_ten
                                                    ? `${row.ho_ten} (${row.id_nguoi_dung})`
                                                    : row.id_nguoi_dung || "--"}
                                            </TableCell>
                                            <TableCell>
                                                {formatDateTime(row.thoi_gian)}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    size="small"
                                                    label={
                                                        row.hanh_dong || "--"
                                                    }
                                                    color="primary"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {row.ten_bang || "--"}
                                            </TableCell>
                                            <TableCell>
                                                {row.dia_chi_ip || "--"}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label="Xem"
                                                    size="small"
                                                    onClick={() =>
                                                        setDetail(row)
                                                    }
                                                    clickable
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}

                        {tab === "backup" && (
                            <Table sx={{ minWidth: 720 }}>
                                <TableHead>
                                    <TableRow>
                                        {[
                                            "ID",
                                            "Người dùng",
                                            "Thời gian backup",
                                            "Đường dẫn",
                                        ].map((label) => (
                                            <TableCell
                                                key={label}
                                                sx={{ fontWeight: 700 }}
                                            >
                                                {label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((row) => (
                                        <TableRow key={row.id} hover>
                                            <TableCell sx={{ fontWeight: 700 }}>
                                                {row.id}
                                            </TableCell>
                                            <TableCell>
                                                {row.ho_ten
                                                    ? `${row.ho_ten} (${row.id_nguoi_dung})`
                                                    : row.id_nguoi_dung || "--"}
                                            </TableCell>
                                            <TableCell>
                                                {formatDateTime(
                                                    row.thoi_gian_backup,
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {row.duong_dan}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}

                        {!loading && rows.length === 0 && (
                            <Box
                                sx={{
                                    py: 6,
                                    textAlign: "center",
                                    color: "text.secondary",
                                }}
                            >
                                Chưa có nhật ký.
                            </Box>
                        )}
                    </TableContainer>
            </TableCard>

            <AuditDetailDialog
                detail={detail}
                onClose={() => setDetail(null)}
            />

            <FeedbackSnackbar
                open={!!error}
                message={error}
                severity="error"
                onClose={() => setError("")}
            />
        </Stack>
    );
}

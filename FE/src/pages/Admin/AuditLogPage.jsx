import { useEffect, useMemo, useState } from "react";
import useDebounce from "../../hooks/useDebounce.jsx";
import { Box, Button, Chip, Stack, Tab, TableCell, TableRow, Tabs, Typography } from "@mui/material";
import {
    Backup as BackupIcon,
    Download as DownloadIcon,
    History as HistoryIcon,
} from "@mui/icons-material";
import SearchBar from "../../components/common/SearchBar.jsx";
import api from "../../services/api.js";
import FeedbackSnackbar from "../../components/common/FeedbackSnackbar.jsx";
import PaginationWidget from "../../components/common/PaginationWidget.jsx";
import DataTable from "../../components/common/DataTable.jsx";
import AdminPageHeader from "../../components/admin/AdminPageHeader.jsx";
import TableCard from "../../components/admin/TableCard.jsx";
import AuditDetailDialog from "../../components/admin/AuditDetailDialog.jsx";
import { formatDateTime } from "../../utils/date.js";

const tabs = [
    { value: "login", label: "Đăng nhập", endpoint: "/nhat_ky_dang_nhap" },
    { value: "action", label: "Thao tác", endpoint: "/nhat_ky_thao_tac" },
    { value: "backup", label: "Backup", endpoint: "/nhat_ky_backup" },
];

const ROWS_PER_PAGE = 100;

export default function AuditLogPage() {
    const [tab, setTab] = useState("login");
    const [logs, setLogs] = useState({ login: [], action: [], backup: [] });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [detail, setDetail] = useState(null);
    const [page, setPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebounce(query);
    const [backupFiles, setBackupFiles] = useState([]);
    const [creatingBackup, setCreatingBackup] = useState(false);

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
                        sort_by: "thoi_gian",
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

    useEffect(() => {
        if (tab !== "backup") return;
        let ignore = false;

        async function loadFiles() {
            try {
                const res = await api.get("/backup");
                if (!ignore)
                    setBackupFiles(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                if (!ignore)
                    setError(
                        err.response?.data?.detail ||
                            "Không thể tải danh sách file backup.",
                    );
            }
        }

        loadFiles();
        return () => {
            ignore = true;
        };
    }, [tab]);

    const handleDownload = async (filename) => {
        try {
            const res = await api.get(`/backup/download/${filename}`, {
                responseType: "blob",
            });
            const url = URL.createObjectURL(res.data);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            setError(err.response?.data?.detail || "Tải file thất bại.");
        }
    };

    const handleCreateBackup = async () => {
        setCreatingBackup(true);
        setError("");
        try {
            await api.post("/backup");
            setSuccess("Tạo backup thành công");
            const res = await api.get("/backup");
            setBackupFiles(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            setError(err.response?.data?.detail || "Không thể tạo backup.");
        } finally {
            setCreatingBackup(false);
        }
    };

    const handleTabChange = (_, value) => {
        setTab(value);
        setPage(1);
    };

    const rows = useMemo(
        () => (logs[tab] || []).filter((row) => {
            const keyword = debouncedQuery.trim().toLowerCase();
            if (!keyword) return true;
            const values = [
                row.id,
                row.ho_ten,
                row.id_nguoi_dung,
                row.hanh_dong,
                row.ten_bang,
                row.dia_chi_ip,
                row.thiet_bi,
                row.trang_thai_thanh_cong !== undefined
                    ? row.trang_thai_thanh_cong
                        ? "thành công"
                        : "thất bại"
                    : null,
            ];
            return values
                .filter(Boolean)
                .some((value) => String(value).toLowerCase().includes(keyword));
        }),
        [logs, tab, debouncedQuery],
    );

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
                    {tab === "backup" && (
                        <Button
                            variant="contained"
                            startIcon={<BackupIcon />}
                            disabled={creatingBackup}
                            onClick={handleCreateBackup}
                        >
                            {creatingBackup ? "Đang backup..." : "Tạo backup"}
                        </Button>
                    )}
                    <Chip
                        icon={<HistoryIcon />}
                        label={`${totalRecords} bản ghi`}
                        color="secondary"
                        variant="outlined"
                    />
                </Stack>

                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={2}
                    sx={{ mb: 2, justifyContent: "space-between" }}
                >
                    <SearchBar
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Tìm ID, họ tên, hành động, bảng, IP..."
                    />
                    <PaginationWidget
                        page={page}
                        totalRecords={totalRecords}
                        rowsPerPage={ROWS_PER_PAGE}
                        onChange={setPage}
                    />
                </Stack>

                {tab === "login" && (
                    <DataTable
                        columns={[
                            { key: "id", label: "ID" },
                            { key: "ho_ten", label: "Họ tên" },
                            { key: "id_nguoi_dung", label: "ID người dùng" },
                            { key: "thoi_gian", label: "Thời gian" },
                            { key: "trang_thai", label: "Trạng thái" },
                            { key: "thiet_bi", label: "Thiết bị" },
                        ]}
                        loading={loading}
                        emptyMessage="Chưa có nhật ký."
                        minWidth={760}
                    >
                        {rows.map((row) => (
                            <TableRow key={row.id} hover>
                                <TableCell sx={{ fontWeight: 700 }}>
                                    {row.id}
                                </TableCell>
                                <TableCell>{row.ho_ten || "--"}</TableCell>
                                <TableCell>
                                    {row.id_nguoi_dung || "--"}
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
                                <TableCell>{row.thiet_bi || "--"}</TableCell>
                            </TableRow>
                        ))}
                    </DataTable>
                )}

                {tab === "action" && (
                    <DataTable
                        columns={[
                            { key: "id", label: "ID" },
                            { key: "ho_ten", label: "Họ tên" },
                            { key: "id_nguoi_dung", label: "ID người dùng" },
                            { key: "thoi_gian", label: "Thời gian" },
                            { key: "hanh_dong", label: "Hành động" },
                            { key: "bang", label: "Bảng" },
                            { key: "ip", label: "IP" },
                            { key: "chi_tiet", label: "Chi tiết" },
                        ]}
                        loading={loading}
                        emptyMessage="Chưa có nhật ký."
                        minWidth={880}
                    >
                        {rows.map((row) => (
                            <TableRow key={row.id} hover>
                                <TableCell sx={{ fontWeight: 700 }}>
                                    {row.id}
                                </TableCell>
                                <TableCell>{row.ho_ten || "--"}</TableCell>
                                <TableCell>
                                    {row.id_nguoi_dung || "--"}
                                </TableCell>
                                <TableCell>
                                    {formatDateTime(row.thoi_gian)}
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        size="small"
                                        label={row.hanh_dong || "--"}
                                        color={
                                            row.hanh_dong === "CREATE"
                                                ? "success"
                                                : row.hanh_dong === "UPDATE"
                                                  ? "info"
                                                  : row.hanh_dong === "DELETE"
                                                    ? "error"
                                                    : "default"
                                        }
                                    />
                                </TableCell>
                                <TableCell>{row.ten_bang || "--"}</TableCell>
                                <TableCell>{row.dia_chi_ip || "--"}</TableCell>
                                <TableCell>
                                    <Chip
                                        label="Xem"
                                        size="small"
                                        onClick={() => setDetail(row)}
                                        clickable
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </DataTable>
                )}

                {tab === "backup" && (
                    <DataTable
                        columns={[
                            { key: "file_name", label: "File name" },
                            { key: "kich_thuoc", label: "Kích thước" },
                            { key: "ngay_tao", label: "Ngày tạo" },
                            { key: "hanh_dong", label: "Hành động" },
                        ]}
                        loading={loading}
                        emptyMessage="Chưa có file backup."
                        minWidth={720}
                    >
                        {backupFiles.map((file) => (
                            <TableRow key={file.filename} hover>
                                <TableCell sx={{ fontWeight: 700 }}>
                                    {file.filename}
                                </TableCell>
                                <TableCell>
                                    {(file.size / 1024).toFixed(1)} KB
                                </TableCell>
                                <TableCell>
                                    {formatDateTime(file.modified)}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        size="small"
                                        startIcon={<DownloadIcon />}
                                        onClick={() =>
                                            handleDownload(file.filename)
                                        }
                                    >
                                        Tải về
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </DataTable>
                )}
            </TableCard>

            <AuditDetailDialog
                detail={detail}
                onClose={() => setDetail(null)}
            />

            <FeedbackSnackbar
                open={!!success}
                message={success}
                severity="success"
                onClose={() => setSuccess("")}
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

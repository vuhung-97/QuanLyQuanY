import { useCallback, useEffect, useMemo, useState } from "react";
import useDebounce from "@/hooks/useDebounce.jsx";
import { Button, Chip, Stack, Tab, Tabs } from "@mui/material";
import {
    Backup as BackupIcon,
    History as HistoryIcon,
} from "@mui/icons-material";
import SearchBar from "@/components/common/SearchBar.jsx";
import { adminService } from "@/services/adminService.js";
import FeedbackSnackbar from "@/components/common/FeedbackSnackbar.jsx";
import PaginationWidget from "@/components/common/PaginationWidget.jsx";
import AdminPageHeader from "@/components/admin/AdminPageHeader.jsx";
import TableCard from "@/components/admin/TableCard.jsx";
import AuditDetailDialog from "@/components/admin/AuditLog/AuditDetailDialog.jsx";
import DangNhapTab from "@/components/admin/AuditLog/DangNhapTab.jsx";
import ThaoTacTab from "@/components/admin/AuditLog/ThaoTacTab.jsx";
import BackupTab from "@/components/admin/AuditLog/BackupTab.jsx";

const tabs = [
    { value: "login", label: "Đăng nhập", endpoint: "/nhat_ky_dang_nhap" },
    { value: "action", label: "Thao tác", endpoint: "/nhat_ky_thao_tac" },
    { value: "backup", label: "Backup", endpoint: "/nhat_ky_backup" },
];

const ROWS_PER_PAGE = 100;

function SearchBarWrapper({ onSearch, placeholder }) {
    const [value, setValue] = useState("");
    const debouncedValue = useDebounce(value, 300);
    useEffect(() => {
        onSearch(debouncedValue);
    }, [debouncedValue, onSearch]);
    return (
        <SearchBar
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
        />
    );
}

export default function AuditLogPage() {
    const [tab, setTab] = useState("login");
    const [logs, setLogs] = useState({ login: [], action: [], backup: [] });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [detail, setDetail] = useState(null);
    const [page, setPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const handleSearch = useCallback((term) => setSearchTerm(term), []);
    const [backupFiles, setBackupFiles] = useState([]);
    const [creatingBackup, setCreatingBackup] = useState(false);

    const activeTab = tabs.find((item) => item.value === tab);

    useEffect(() => {
        let ignore = false;

        async function loadLogs() {
            setLoading(true);
            setError("");
            try {
                const res = await adminService.getAuditLog(activeTab.endpoint, {
                    limit: ROWS_PER_PAGE,
                    offset: (page - 1) * ROWS_PER_PAGE,
                    sort_by: "thoi_gian",
                    sort_desc: true,
                    include_total: true,
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
                const res = await adminService.getBackupList();
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
            const res = await adminService.downloadBackup(filename);
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
            await adminService.createBackup();
            setSuccess("Tạo backup thành công");
            const res = await adminService.getBackupList();
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
        () =>
            (logs[tab] || []).filter((row) => {
                const keyword = searchTerm.trim().toLowerCase();
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
                    .some((value) =>
                        String(value).toLowerCase().includes(keyword),
                    );
            }),
        [logs, tab, searchTerm],
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
                    <SearchBarWrapper
                        onSearch={handleSearch}
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
                    <DangNhapTab rows={rows} loading={loading} />
                )}

                {tab === "action" && (
                    <ThaoTacTab
                        rows={rows}
                        loading={loading}
                        onViewDetail={setDetail}
                    />
                )}

                {tab === "backup" && (
                    <BackupTab
                        backupFiles={backupFiles}
                        loading={loading}
                        onDownload={handleDownload}
                    />
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

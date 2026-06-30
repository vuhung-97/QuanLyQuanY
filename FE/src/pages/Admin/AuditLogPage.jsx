import { useEffect, useState } from "react"
import useDebounce from "@/hooks/useDebounce"
import { Button, Chip, Stack, Tab, Tabs } from "@mui/material"
import { Backup as BackupIcon, History as HistoryIcon } from "@mui/icons-material"
import SearchBar from "@/components/common/SearchBar"
import FeedbackSnackbar from "@/components/common/FeedbackSnackbar"
import PaginationWidget from "@/components/common/PaginationWidget"
import AdminPageHeader from "@/components/admin/AdminPageHeader"
import TableCard from "@/components/admin/TableCard"
import AuditDetailDialog from "@/components/admin/AuditLog/AuditDetailDialog"
import DangNhapTab from "@/components/admin/AuditLog/DangNhapTab"
import ThaoTacTab from "@/components/admin/AuditLog/ThaoTacTab"
import BackupTab from "@/components/admin/AuditLog/BackupTab"
import { adminService } from "@/services/adminService"
import useAdminAuditLogs, { AUDIT_TABS, ROWS_PER_PAGE } from "@/hooks/useAdminAuditLogs"

function SearchBarWrapper({ onSearch, placeholder }) {
    const [value, setValue] = useState("")
    const debouncedValue = useDebounce(value, 300)
    useEffect(() => { onSearch(debouncedValue) }, [debouncedValue, onSearch])
    return (
        <SearchBar value={value} onChange={(e) => setValue(e.target.value)} placeholder={placeholder} />
    )
}

export default function AuditLogPage() {
    const {
        tab, loading, error, success, setError, setSuccess,
        detail, setDetail, page, setPage,
        totalRecords, searchTerm, backupFiles, creatingBackup,
        activeTab,
        handleSearch, handleTabChange,
        handleDownload, handleCreateBackup, rows,
    } = useAdminAuditLogs()

    return (
        <Stack spacing={3}>
            <AdminPageHeader
                title="Nhật ký hệ thống"
                description="Theo dõi đăng nhập, thao tác dữ liệu và lịch sử backup của hệ thống."
            />

            <TableCard loading={loading}>
                <Stack direction={{ xs: "column", md: "row" }} spacing={2}
                    sx={{ mb: 2, justifyContent: "space-between" }}>
                    <Tabs value={tab} onChange={handleTabChange}>
                        {AUDIT_TABS.map((item) => (
                            <Tab key={item.value} value={item.value} label={item.label} />
                        ))}
                    </Tabs>
                    {tab === "backup" && (
                        <Button variant="contained" startIcon={<BackupIcon />}
                            disabled={creatingBackup} onClick={handleCreateBackup}>
                            {creatingBackup ? "Đang backup..." : "Tạo backup"}
                        </Button>
                    )}
                    <Chip icon={<HistoryIcon />} label={`${totalRecords} bản ghi`}
                        color="secondary" variant="outlined" />
                </Stack>

                <Stack direction={{ xs: "column", md: "row" }} spacing={2}
                    sx={{ mb: 2, justifyContent: "space-between" }}>
                    <SearchBarWrapper onSearch={handleSearch} placeholder="Tìm ID, họ tên, hành động, bảng, IP..." />
                    <PaginationWidget page={page} totalRecords={totalRecords}
                        rowsPerPage={ROWS_PER_PAGE} onChange={setPage} />
                </Stack>

                {tab === "login" && <DangNhapTab rows={rows} loading={loading} />}
                {tab === "action" && <ThaoTacTab rows={rows} loading={loading} onViewDetail={setDetail} />}
                {tab === "backup" && <BackupTab backupFiles={backupFiles} loading={loading} onDownload={handleDownload} />}
            </TableCard>

            <AuditDetailDialog detail={detail} onClose={() => setDetail(null)} />

            <FeedbackSnackbar open={!!success} message={success} severity="success" onClose={() => setSuccess("")} />
            <FeedbackSnackbar open={!!error} message={error} severity="error" onClose={() => setError("")} />
        </Stack>
    )
}

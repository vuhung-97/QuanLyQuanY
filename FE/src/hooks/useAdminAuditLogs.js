import { useCallback, useEffect, useMemo, useState } from "react"
import useDebounce from "./useDebounce"
import { adminService } from "@/services/adminService"

export const AUDIT_TABS = [
    { value: "login", label: "Đăng nhập", endpoint: "/nhat_ky_dang_nhap" },
    { value: "action", label: "Thao tác", endpoint: "/nhat_ky_thao_tac" },
    { value: "backup", label: "Backup", endpoint: "/nhat_ky_backup" },
]

export const ROWS_PER_PAGE = 100

export default function useAdminAuditLogs() {
    const [tab, setTab] = useState("login")
    const [logs, setLogs] = useState({ login: [], action: [], backup: [] })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [detail, setDetail] = useState(null)
    const [page, setPage] = useState(1)
    const [totalRecords, setTotalRecords] = useState(0)
    const [searchTerm, setSearchTerm] = useState("")
    const debouncedSearch = useDebounce(searchTerm, 300)
    const [backupFiles, setBackupFiles] = useState([])
    const [creatingBackup, setCreatingBackup] = useState(false)

    const activeTab = AUDIT_TABS.find((item) => item.value === tab)

    const handleSearch = useCallback((term) => setSearchTerm(term), [])

    useEffect(() => {
        let ignore = false
        async function loadLogs() {
            setLoading(true)
            setError("")
            try {
                const res = await adminService.getAuditLog(activeTab.endpoint, {
                    limit: ROWS_PER_PAGE,
                    offset: (page - 1) * ROWS_PER_PAGE,
                    sort_by: "thoi_gian",
                    sort_desc: true,
                    include_total: true,
                })
                if (!ignore) {
                    const data = res.data
                    setLogs((current) => ({
                        ...current,
                        [tab]: Array.isArray(data) ? data : data.items || [],
                    }))
                    if (data.total !== undefined) setTotalRecords(data.total)
                }
            } catch (err) {
                if (!ignore) {
                    setError(err.response?.data?.detail || "Chưa tải được nhật ký từ API.")
                }
            } finally {
                if (!ignore) setLoading(false)
            }
        }
        loadLogs()
        return () => { ignore = true }
    }, [tab, page, activeTab.endpoint])

    useEffect(() => {
        if (tab !== "backup") return
        let ignore = false
        async function loadFiles() {
            try {
                const res = await adminService.getBackupList()
                if (!ignore) setBackupFiles(Array.isArray(res.data) ? res.data : [])
            } catch (err) {
                if (!ignore) setError(err.response?.data?.detail || "Không thể tải danh sách file backup.")
            }
        }
        loadFiles()
        return () => { ignore = true }
    }, [tab])

    const handleTabChange = useCallback((_, value) => {
        setTab(value)
        setPage(1)
    }, [])

    const handleDownload = useCallback(async (filename) => {
        try {
            const res = await adminService.downloadBackup(filename)
            const url = URL.createObjectURL(res.data)
            const a = document.createElement("a")
            a.href = url
            a.download = filename
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
        } catch (err) {
            setError(err.response?.data?.detail || "Tải file thất bại.")
        }
    }, [])

    const handleCreateBackup = useCallback(async () => {
        setCreatingBackup(true)
        setError("")
        try {
            await adminService.createBackup()
            setSuccess("Tạo backup thành công")
            const res = await adminService.getBackupList()
            setBackupFiles(Array.isArray(res.data) ? res.data : [])
        } catch (err) {
            setError(err.response?.data?.detail || "Không thể tạo backup.")
        } finally {
            setCreatingBackup(false)
        }
    }, [])

    const rows = useMemo(
        () => (logs[tab] || []).filter((row) => {
            const keyword = debouncedSearch.trim().toLowerCase()
            if (!keyword) return true
            const values = [
                row.id, row.ho_ten, row.id_nguoi_dung, row.hanh_dong,
                row.ten_bang, row.dia_chi_ip, row.thiet_bi,
                row.trang_thai_thanh_cong !== undefined
                    ? row.trang_thai_thanh_cong ? "thành công" : "thất bại"
                    : null,
            ]
            return values.filter(Boolean).some((value) =>
                String(value).toLowerCase().includes(keyword)
            )
        }),
        [logs, tab, debouncedSearch],
    )

    return {
        tab, logs, loading, error, success,
        setError, setSuccess,
        detail, setDetail, page, setPage,
        totalRecords, searchTerm, backupFiles, creatingBackup,
        activeTab,
        handleSearch, handleTabChange,
        handleDownload, handleCreateBackup, rows,
    }
}

import { useCallback, useEffect, useMemo, useState } from "react"
import { adminService } from "@/services/adminService"
import usePermissionDiff from "./usePermissionDiff"

const fallbackRoles = [
    { id: "ROLE_ADMIN", ten_vai_tro: "Quản trị viên", mo_ta: "Toàn quyền hệ thống" },
    { id: "ROLE_BAC_SI", ten_vai_tro: "Bác sĩ", mo_ta: "Thực hiện khám chữa bệnh" },
    { id: "ROLE_Y_SI", ten_vai_tro: "Y sĩ", mo_ta: "Hỗ trợ nghiệp vụ quân y" },
    { id: "ROLE_CNQY", ten_vai_tro: "Chủ nhiệm quân y", mo_ta: "Chủ nhiệm quản lý ban quân y" },
]

const fallbackPermissions = [
    { id: "nguoi_dung:read", ten_quyen: "Xem người dùng", mo_ta: "Đọc danh sách tài khoản" },
    { id: "nguoi_dung:create", ten_quyen: "Tạo người dùng", mo_ta: "Thêm tài khoản mới" },
    { id: "lich_kham_sk_nam:read", ten_quyen: "Xem lịch khám", mo_ta: "Đọc lịch khám sức khỏe năm" },
    { id: "phieu_kham_suc_khoe:create", ten_quyen: "Tạo phiếu khám", mo_ta: "Lập phiếu khám sức khỏe" },
]

export default function useAdminRoles() {
    const [roles, setRoles] = useState([])
    const [permissions, setPermissions] = useState([])
    const [rolePermissions, setRolePermissions] = useState([])
    const [selectedRoleId, setSelectedRoleId] = useState("")
    const [selectedPermissionIds, setSelectedPermissionIds] = useState(new Set())
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [permissionFilter, setPermissionFilter] = useState("all")
    const [openDialog, setOpenDialog] = useState(false)
    const [editingRole, setEditingRole] = useState(null)

    const actionTypes = useMemo(
        () => [...new Set(permissions.map((p) => p.id.split(":").at(1)).filter(Boolean))],
        [permissions],
    )

    const filteredPermissions = useMemo(
        () => permissionFilter === "all"
            ? permissions
            : permissions.filter((p) => p.id.endsWith(":" + permissionFilter)),
        [permissions, permissionFilter],
    )

    const allSelected = useMemo(
        () => selectedRoleId && filteredPermissions.length > 0 &&
            filteredPermissions.every((p) => selectedPermissionIds.has(p.id)),
        [selectedRoleId, filteredPermissions, selectedPermissionIds],
    )

    const selectedRole = useMemo(
        () => roles.find((role) => role.id === selectedRoleId),
        [roles, selectedRoleId],
    )

    useEffect(() => {
        let ignore = false
        async function loadData() {
            setLoading(true)
            setError("")
            try {
                const [rolesRes, permissionsRes, mappingRes] = await Promise.all([
                    adminService.getRoleList(),
                    adminService.getPermissionList(),
                    adminService.getRolePermissionMapping(),
                ])
                if (!ignore) {
                    const nextRoles = Array.isArray(rolesRes.data) ? rolesRes.data : []
                    setRoles(nextRoles)
                    setPermissions(Array.isArray(permissionsRes.data) ? permissionsRes.data : [])
                    setRolePermissions(Array.isArray(mappingRes.data) ? mappingRes.data : [])
                    setSelectedRoleId(nextRoles[0]?.id || "")
                }
            } catch (err) {
                if (!ignore) {
                    setError(err.response?.data?.detail || "Chưa tải được dữ liệu phân quyền từ API.")
                    setRoles(fallbackRoles)
                    setPermissions(fallbackPermissions)
                    setRolePermissions([{ id_vai_tro: "ROLE_ADMIN", id_quyen: "nguoi_dung:read" }])
                    setSelectedRoleId("ROLE_ADMIN")
                }
            } finally {
                if (!ignore) setLoading(false)
            }
        }
        loadData()
        return () => { ignore = true }
    }, [])

    useEffect(() => {
        const ids = rolePermissions
            .filter((item) => item.id_vai_tro === selectedRoleId)
            .map((item) => item.id_quyen)
        setSelectedPermissionIds(new Set(ids))
    }, [rolePermissions, selectedRoleId])

    const { savePermissions } = usePermissionDiff(
        rolePermissions, setRolePermissions, selectedRoleId, selectedPermissionIds,
    )

    const togglePermission = useCallback((permissionId) => {
        setSelectedPermissionIds((current) => {
            const next = new Set(current)
            if (next.has(permissionId)) next.delete(permissionId)
            else next.add(permissionId)
            return next
        })
    }, [])

    const handleToggleSelectAll = useCallback(() => {
        if (allSelected) {
            setSelectedPermissionIds((current) => {
                const filteredIds = new Set(filteredPermissions.map((p) => p.id))
                const next = new Set(current)
                for (const id of filteredIds) next.delete(id)
                return next
            })
        } else {
            setSelectedPermissionIds((current) => {
                const next = new Set(current)
                for (const p of filteredPermissions) next.add(p.id)
                return next
            })
        }
    }, [allSelected, filteredPermissions])

    const handleOpenEdit = useCallback((role) => {
        setEditingRole(role)
        setOpenDialog(true)
    }, [])

    const handleSubmitRole = useCallback(async (formData) => {
        if (!editingRole) return
        setSaving(true)
        setError("")
        try {
            const res = await adminService.updateRole(editingRole.id, formData)
            setRoles((current) => current.map((r) => r.id === editingRole.id ? res.data : r))
            setOpenDialog(false)
            setSuccess("Cập nhật vai trò thành công")
        } catch (err) {
            setError(err.response?.data?.detail || "Không thể lưu vai trò.")
        } finally {
            setSaving(false)
        }
    }, [editingRole])

    const handleSavePermissions = useCallback(async () => {
        if (!selectedRoleId) return
        setSaving(true)
        setError("")
        try {
            await savePermissions()
            setSuccess("Lưu phân quyền thành công")
        } catch (err) {
            setError(err.response?.data?.detail || "Không thể lưu phân quyền.")
        } finally {
            setSaving(false)
        }
    }, [selectedRoleId, savePermissions])

    return {
        roles, permissions, rolePermissions, selectedRoleId, setSelectedRoleId,
        selectedPermissionIds, loading, saving, error, success,
        setError, setSuccess,
        permissionFilter, setPermissionFilter,
        actionTypes, filteredPermissions, allSelected, selectedRole,
        openDialog, setOpenDialog, editingRole,
        togglePermission, handleToggleSelectAll,
        handleOpenEdit, handleSubmitRole, handleSavePermissions,
    }
}

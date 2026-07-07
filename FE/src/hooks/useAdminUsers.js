import { useCallback, useEffect, useMemo, useState } from "react"

import { adminService } from "@/services/adminService"

export default function useAdminUsers() {
    const [users, setUsers] = useState([])
    const [roles, setRoles] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [query, setQuery] = useState("")
    const [openDialog, setOpenDialog] = useState(false)
    const [editingUser, setEditingUser] = useState(null)
    const [deleteTarget, setDeleteTarget] = useState(null)
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        let ignore = false
        async function loadData() {
            setLoading(true)
            setError("")
            try {
                const [usersRes, rolesRes] = await Promise.all([
                    adminService.getUserList(),
                    adminService.getRoleList(),
                ])
                if (!ignore) {
                    setUsers(Array.isArray(usersRes.data) ? usersRes.data : [])
                    setRoles(Array.isArray(rolesRes.data) ? rolesRes.data : [])
                }
            } catch (err) {
                if (!ignore) {
                    setError(err.response?.data?.detail || "Chưa tải được dữ liệu quản trị từ API.")
                }
            } finally {
                if (!ignore) setLoading(false)
            }
        }
        loadData()
        return () => { ignore = true }
    }, [])

    const filteredUsers = useMemo(() => {
        const keyword = query.trim().toLowerCase()
        if (!keyword) return users
        return users.filter((user) =>
            [user.id, user.ten_dang_nhap, user.ho_ten, user.id_vai_tro, user.ten_vai_tro]
                .filter(Boolean)
                .some((value) => String(value).toLowerCase().includes(keyword))
        )
    }, [users, query])

    const activeCount = useMemo(() => users.filter((user) => user.trang_thai).length, [users])

    const handleOpenCreate = useCallback(() => {
        setEditingUser(null)
        setOpenDialog(true)
    }, [])

    const handleOpenEdit = useCallback((user) => {
        setEditingUser(user)
        setOpenDialog(true)
    }, [])

    const handleOpenDelete = useCallback((user) => {
        setDeleteTarget(user)
    }, [])

    const handleConfirmDelete = useCallback(async () => {
        if (!deleteTarget) return
        setDeleting(true)
        setError("")
        try {
            await adminService.deleteUser(deleteTarget.id)
            setUsers((current) => current.filter((user) => user.id !== deleteTarget.id))
            setSuccess("Xoá tài khoản thành công")
        } catch (err) {
            setError(err.response?.data?.detail || "Không thể xoá tài khoản.")
        } finally {
            setDeleting(false)
            setDeleteTarget(null)
        }
    }, [deleteTarget])

    const handleDialogSaved = useCallback((savedUser, isEdit) => {
        if (isEdit) {
            setUsers((current) =>
                current.map((user) => (user.id === savedUser.id ? savedUser : user))
            )
        } else {
            setUsers((current) => [savedUser, ...current])
        }
        setSuccess(isEdit ? "Cập nhật tài khoản thành công" : "Thêm tài khoản thành công")
    }, [])

    return {
        users, roles, loading, error, success,
        setError, setSuccess,
        query, setQuery,
        filteredUsers, activeCount,
        openDialog, setOpenDialog,
        editingUser, deleteTarget, deleting,
        handleOpenCreate, handleOpenEdit, handleOpenDelete,
        handleConfirmDelete, handleDialogSaved,
    }
}

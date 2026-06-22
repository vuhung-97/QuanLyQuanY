import { useEffect, useState } from "react";
import useDebounce from "@/hooks/useDebounce.jsx";
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    Stack,
    Typography,
} from "@mui/material";
import {
    Add as AddIcon,
    Delete as DeleteIcon,
} from "@mui/icons-material";
import UserFormDialog from "@/components/admin/UserManager/UserFormDialog.jsx";
import { adminService } from "@/services/adminService.js";
import SearchBar from "@/components/common/SearchBar.jsx";
import FeedbackSnackbar from "@/components/common/FeedbackSnackbar.jsx";
import DataTable from "@/components/common/DataTable.jsx";
import AdminPageHeader from "@/components/admin/AdminPageHeader.jsx";
import TableCard from "@/components/admin/TableCard.jsx";
import UserTableRow from "@/components/admin/UserManager/UserTableRow.jsx";
import ConfirmDialog from "@/components/common/ConfirmDialog.jsx";

export default function UserManagementPage() {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebounce(query);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        let ignore = false;

        async function loadData() {
            setLoading(true);
            setError("");
            try {
                const [usersRes, rolesRes] = await Promise.all([
                    adminService.getUserList(),
                    adminService.getRoleList(),
                ]);
                if (!ignore) {
                    setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
                    setRoles(Array.isArray(rolesRes.data) ? rolesRes.data : []);
                }
            } catch (err) {
                if (!ignore) {
                    setError(
                        err.response?.data?.detail ||
                            "Chưa tải được dữ liệu quản trị từ API.",
                    );
                }
            } finally {
                if (!ignore) setLoading(false);
            }
        }

        loadData();
        return () => {
            ignore = true;
        };
    }, []);

    const filteredUsers = users.filter((user) => {
        const keyword = debouncedQuery.trim().toLowerCase();
        if (!keyword) return true;
        return [
            user.id,
            user.ten_dang_nhap,
            user.ho_ten,
            user.id_vai_tro,
            user.ten_vai_tro,
        ]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(keyword));
    });

    const activeCount = users.filter((user) => user.trang_thai).length;

    const handleOpenCreate = () => {
        setEditingUser(null);
        setOpenDialog(true);
    };

    const handleOpenEdit = (user) => {
        setEditingUser(user);
        setOpenDialog(true);
    };

    const handleOpenDelete = (user) => {
        setDeleteTarget(user);
    };

    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        setError("");
        try {
            await adminService.deleteUser(deleteTarget.id);
            setUsers((current) =>
                current.filter((user) => user.id !== deleteTarget.id),
            );
            setSuccess("Xoá tài khoản thành công");
        } catch (err) {
            setError(err.response?.data?.detail || "Không thể xoá tài khoản.");
        } finally {
            setDeleting(false);
            setDeleteTarget(null);
        }
    };

    const handleDialogSaved = (savedUser, isEdit) => {
        if (isEdit) {
            setUsers((current) =>
                current.map((user) => (user.id === savedUser.id ? savedUser : user)),
            );
        } else {
            setUsers((current) => [savedUser, ...current]);
        }
        setSuccess(isEdit ? "Cập nhật tài khoản thành công" : "Thêm tài khoản thành công");
    };

    return (
        <Stack spacing={3}>
            <AdminPageHeader
                title="Tài khoản người dùng"
                description="Thêm tài khoản, đổi vai trò và quản lý trạng thái đăng nhập cho tài khoản."
                action={
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleOpenCreate}
                        sx={{ alignSelf: { xs: "stretch", md: "center" } }}
                    >
                        Thêm tài khoản
                    </Button>
                }
            />

            <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ borderRadius: 3 }}>
                        <CardContent>
                            <Typography variant="h3">{users.length}</Typography>
                            <Typography color="text.secondary">
                                Tổng tài khoản
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ borderRadius: 3 }}>
                        <CardContent>
                            <Typography variant="h3" color="success.main">
                                {activeCount}
                            </Typography>
                            <Typography color="text.secondary">
                                Đang hoạt động
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ borderRadius: 3 }}>
                        <CardContent>
                            <Typography variant="h3" color="primary.main">
                                {roles.length}
                            </Typography>
                            <Typography color="text.secondary">
                                Vai trò khả dụng
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <TableCard loading={loading}>
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={2}
                    sx={{ mb: 2.5, justifyContent: "space-between" }}
                >
                    <Box>
                        <Typography variant="h2">
                            Danh sách người dùng
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Resource /nguoi_dung
                        </Typography>
                    </Box>
                    <SearchBar
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Tìm tài khoản, họ tên, vai trò"
                    />
                </Stack>

                <DataTable
                    columns={[
                        { key: "id", label: "ID" },
                        { key: "ten_dang_nhap", label: "Tên đăng nhập" },
                        { key: "ho_ten", label: "Họ tên" },
                        { key: "vai_tro", label: "Vai trò" },
                        { key: "quan_nhan", label: "Quân nhân" },
                        { key: "trang_thai", label: "Trạng thái" },
                        { key: "thao_tac", label: "Thao tác" },
                    ]}
                    loading={false}
                    emptyMessage="Không có tài khoản phù hợp."
                    minWidth={760}
                >
                    {filteredUsers.map((user) => (
                        <UserTableRow
                            key={user.id}
                            user={user}
                            onEdit={handleOpenEdit}
                            onDelete={handleOpenDelete}
                        />
                    ))}
                </DataTable>
            </TableCard>

            <UserFormDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                editingUser={editingUser}
                roles={roles}
                onSaved={handleDialogSaved}
            />

            <ConfirmDialog
                open={!!deleteTarget}
                title="Xác nhận xoá tài khoản"
                message={
                    <>
                        Bạn có chắc muốn xoá tài khoản{" "}
                        <strong>{deleteTarget?.ho_ten}</strong> (
                        {deleteTarget?.ten_dang_nhap})? Hành động này không thể
                        hoàn tác.
                    </>
                }
                confirmLabel={deleting ? "Đang xoá..." : "Xoá"}
                confirmIcon={<DeleteIcon />}
                loading={deleting}
                onConfirm={handleConfirmDelete}
                onClose={() => setDeleteTarget(null)}
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

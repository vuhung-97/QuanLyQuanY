import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    Stack,
    Typography,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import TableCard from "@/components/admin/TableCard";
import UserFormDialog from "@/components/admin/UserManager/UserFormDialog";
import UserTableRow from "@/components/admin/UserManager/UserTableRow";
import DataTable from "@/components/common/DataTable";
import SearchBarDebounced from "@/components/common/SearchBarDebounced";
import StatusFilter from "@/components/common/StatusFilter";
import FeedbackSnackbar from "@/components/common/FeedbackSnackbar";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import useAdminUsers from "@/hooks/useAdminUsers";

export default function UserManagementPage() {
    const {
        users,
        roles,
        loading,
        error,
        success,
        setError,
        setSuccess,
        setQuery,
        roleFilter,
        setRoleFilter,
        filteredUsers,
        activeCount,
        openDialog,
        setOpenDialog,
        editingUser,
        deleteTarget,
        deleting,
        handleOpenCreate,
        handleOpenEdit,
        handleOpenDelete,
        handleConfirmDelete,
        handleDialogSaved,
    } = useAdminUsers();

    const roleOptions = roles.map((r) => ({ value: r.id, label: r.ten_vai_tro }))

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
                    </Box>
                    <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                        <StatusFilter
                            value={roleFilter}
                            onChange={setRoleFilter}
                            options={roleOptions}
                            label="Vai trò"
                            allLabel="Tất cả"
                        />
                        <SearchBarDebounced
                            onSearch={setQuery}
                            placeholder="Tìm tài khoản, họ tên, vai trò"
                        />
                    </Stack>
                </Stack>

                <DataTable
                    columns={[
                        { key: "id", label: "ID" },
                        { key: "ten_dang_nhap", label: "Tên đăng nhập" },
                        { key: "ho_ten", label: "Họ tên" },
                        { key: "vai_tro", label: "Vai trò" },
                        { key: "quan_nhan", label: "Mã quân nhân" },
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

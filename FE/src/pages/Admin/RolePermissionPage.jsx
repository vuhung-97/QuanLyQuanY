import { Grid, Stack } from "@mui/material";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import RoleListPanel from "@/components/admin/RolePermission/RoleListPanel";
import PermissionPanel from "@/components/admin/RolePermission/PermissionPanel";
import RoleFormDialog from "@/components/admin/RolePermission/RoleFormDialog";
import FeedbackSnackbar from "@/components/common/FeedbackSnackbar";
import useAdminRoles from "@/hooks/useAdminRoles";

export default function RolePermissionPage() {
    const {
        roles,
        permissions,
        selectedRoleId,
        setSelectedRoleId,
        loading,
        saving,
        error,
        success,
        setError,
        setSuccess,
        permissionFilter,
        setPermissionFilter,
        actionTypes,
        filteredPermissions,
        allSelected,
        selectedRole,
        selectedPermissionIds,
        openDialog,
        setOpenDialog,
        editingRole,
        togglePermission,
        handleToggleSelectAll,
        handleOpenEdit,
        handleSubmitRole,
        handleSavePermissions,
    } = useAdminRoles();

    return (
        <Stack spacing={3}>
            <AdminPageHeader
                title="Vai trò & phân quyền"
                description="Quản lý vai trò, quyền truy cập và gán quyền nghiệp vụ cho tài khoản."
            />

            <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <RoleListPanel
                        roles={roles}
                        selectedRoleId={selectedRoleId}
                        onSelectRole={setSelectedRoleId}
                        onEditRole={handleOpenEdit}
                        loading={loading}
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 8 }}>
                    <PermissionPanel
                        loading={loading}
                        selectedRole={selectedRole}
                        permissions={permissions}
                        filteredPermissions={filteredPermissions}
                        actionTypes={actionTypes}
                        permissionFilter={permissionFilter}
                        onFilterChange={setPermissionFilter}
                        allSelected={allSelected}
                        onToggleSelectAll={handleToggleSelectAll}
                        selectedPermissionIds={selectedPermissionIds}
                        onTogglePermission={togglePermission}
                        onSave={handleSavePermissions}
                        saving={saving}
                    />
                </Grid>
            </Grid>

            <RoleFormDialog
                open={openDialog}
                editingRole={editingRole}
                saving={saving}
                onSubmit={handleSubmitRole}
                onClose={() => setOpenDialog(false)}
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

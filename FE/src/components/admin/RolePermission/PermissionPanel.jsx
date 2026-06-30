import { Box, Button, Chip, Divider, Grid, Stack, Typography } from "@mui/material"
import { Save as SaveIcon } from "@mui/icons-material"
import TableCard from "@/components/admin/TableCard"
import PermissionCard from "@/components/admin/RolePermission/PermissionCard"

export default function PermissionPanel({
    loading, selectedRole, permissions = [], filteredPermissions, actionTypes,
    permissionFilter, onFilterChange, allSelected, onToggleSelectAll,
    selectedPermissionIds, onTogglePermission, onSave, saving,
}) {
    return (
        <TableCard loading={loading}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}
                sx={{ mb: 2, justifyContent: "space-between" }}>
                <Box>
                    <Typography variant="h2">Quyền của vai trò</Typography>
                    <Typography variant="body2" color="text.secondary">
                        {selectedRole
                            ? `${selectedRole.ten_vai_tro || selectedRole.id} - ${selectedRole.mo_ta || "Chưa có mô tả"}`
                            : "Chọn vai trò để phân quyền"}
                    </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                    <Button variant="outlined" onClick={onToggleSelectAll}
                        disabled={!selectedRole || filteredPermissions.length === 0}>
                        {allSelected ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                    </Button>
                    <Button variant="contained" startIcon={<SaveIcon />}
                        onClick={onSave} disabled={!selectedRole || saving}>
                        {saving ? "Đang lưu..." : "Lưu phân quyền"}
                    </Button>
                </Stack>
            </Stack>

            <Divider sx={{ mb: 2 }} />

            <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap" }}>
                <Chip label="Tất cả" size="small"
                    color={permissionFilter === "all" ? "primary" : "default"}
                    onClick={() => onFilterChange("all")} />
                {actionTypes.map((action) => (
                    <Chip key={action} label={action} size="small"
                        color={permissionFilter === action ? "primary" : "default"}
                        onClick={() => onFilterChange(action)} />
                ))}
            </Stack>

            <Grid container spacing={1.5}>
                {filteredPermissions.map((permission) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={permission.id}>
                        <PermissionCard
                            permission={permission}
                            checked={selectedPermissionIds.has(permission.id)}
                            onToggle={onTogglePermission}
                        />
                    </Grid>
                ))}
            </Grid>

            {!loading && filteredPermissions.length === 0 && (
                <Box sx={{ py: 6, textAlign: "center", color: "text.secondary" }}>
                    {filteredPermissions.length === 0
                        ? "Chưa có quyền trong hệ thống."
                        : "Không có quyền nào khớp với bộ lọc."}
                </Box>
            )}
        </TableCard>
    )
}

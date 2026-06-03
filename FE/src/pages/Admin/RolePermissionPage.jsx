import { useEffect, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    LinearProgress,
    List,
    ListItemButton,
    ListItemText,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { Add as AddIcon, Save as SaveIcon, Security as SecurityIcon } from "@mui/icons-material";
import api from "../../services/api.js";

const fallbackRoles = [
    { id: "ROLE_ADMIN", ten_vai_tro: "Quản trị viên", mo_ta: "Toàn quyền hệ thống" },
    { id: "ROLE_BAC_SI", ten_vai_tro: "Bác sĩ", mo_ta: "Thực hiện khám chữa bệnh" },
    { id: "ROLE_Y_SI", ten_vai_tro: "Y sĩ", mo_ta: "Hỗ trợ nghiệp vụ quân y" },
];

const fallbackPermissions = [
    { id: "nguoi_dung:read", ten_quyen: "Xem người dùng", mo_ta: "Đọc danh sách tài khoản" },
    { id: "nguoi_dung:create", ten_quyen: "Tạo người dùng", mo_ta: "Thêm tài khoản mới" },
    { id: "lich_kham_sk_nam:read", ten_quyen: "Xem lịch khám", mo_ta: "Đọc lịch khám sức khỏe năm" },
    { id: "phieu_kham_suc_khoe:create", ten_quyen: "Tạo phiếu khám", mo_ta: "Lập phiếu khám sức khỏe" },
];

const emptyRole = { id: "", ten_vai_tro: "", mo_ta: "" };

export default function RolePermissionPage() {
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [rolePermissions, setRolePermissions] = useState([]);
    const [selectedRoleId, setSelectedRoleId] = useState("");
    const [selectedPermissionIds, setSelectedPermissionIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [roleForm, setRoleForm] = useState(emptyRole);

    useEffect(() => {
        let ignore = false;

        async function loadData() {
            setLoading(true);
            setError("");
            try {
                const [rolesRes, permissionsRes, mappingRes] = await Promise.all([
                    api.get("/vai_tro", { params: { limit: 100, offset: 0 } }),
                    api.get("/quyen", { params: { limit: 500, offset: 0 } }),
                    api.get("/vai_tro_quyen", { params: { limit: 1000, offset: 0 } }),
                ]);
                if (!ignore) {
                    const nextRoles = Array.isArray(rolesRes.data) ? rolesRes.data : [];
                    setRoles(nextRoles);
                    setPermissions(Array.isArray(permissionsRes.data) ? permissionsRes.data : []);
                    setRolePermissions(Array.isArray(mappingRes.data) ? mappingRes.data : []);
                    setSelectedRoleId(nextRoles[0]?.id || "");
                }
            } catch (err) {
                if (!ignore) {
                    setError(err.response?.data?.detail || "Chưa tải được dữ liệu phân quyền từ API.");
                    setRoles(fallbackRoles);
                    setPermissions(fallbackPermissions);
                    setRolePermissions([{ id_vai_tro: "ROLE_ADMIN", id_quyen: "nguoi_dung:read" }]);
                    setSelectedRoleId("ROLE_ADMIN");
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

    useEffect(() => {
        const ids = rolePermissions
            .filter((item) => item.id_vai_tro === selectedRoleId)
            .map((item) => item.id_quyen);
        setSelectedPermissionIds(new Set(ids));
    }, [rolePermissions, selectedRoleId]);

    const selectedRole = roles.find((role) => role.id === selectedRoleId);

    const togglePermission = (permissionId) => {
        setSelectedPermissionIds((current) => {
            const next = new Set(current);
            if (next.has(permissionId)) next.delete(permissionId);
            else next.add(permissionId);
            return next;
        });
    };

    const handleRoleFormChange = (event) => {
        const { name, value } = event.target;
        setRoleForm((current) => ({ ...current, [name]: value }));
    };

    const handleCreateRole = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError("");
        try {
            const res = await api.post("/vai_tro", roleForm, { headers: { "Content-Type": "application/json" } });
            setRoles((current) => [res.data, ...current]);
            setSelectedRoleId(res.data.id);
            setRoleForm(emptyRole);
            setOpenDialog(false);
        } catch (err) {
            setError(err.response?.data?.detail || "Không thể tạo vai trò.");
        } finally {
            setSaving(false);
        }
    };

    const handleSavePermissions = async () => {
        if (!selectedRoleId) return;
        setSaving(true);
        setError("");
        try {
            const currentIds = rolePermissions
                .filter((item) => item.id_vai_tro === selectedRoleId)
                .map((item) => item.id_quyen);
            const selectedIds = Array.from(selectedPermissionIds);
            const toAdd = selectedIds.filter((id) => !currentIds.includes(id));
            const toRemove = currentIds.filter((id) => !selectedPermissionIds.has(id));

            await Promise.all([
                ...toAdd.map((id_quyen) => api.post("/vai_tro_quyen", { id_vai_tro: selectedRoleId, id_quyen }, { headers: { "Content-Type": "application/json" } })),
                ...toRemove.map((id_quyen) => api.delete(`/vai_tro_quyen/${selectedRoleId},${id_quyen}`)),
            ]);

            setRolePermissions((current) => [
                ...current.filter((item) => item.id_vai_tro !== selectedRoleId),
                ...selectedIds.map((id_quyen) => ({ id_vai_tro: selectedRoleId, id_quyen })),
            ]);
        } catch (err) {
            setError(err.response?.data?.detail || "Không thể lưu phân quyền.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Stack spacing={3}>
            <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={2}>
                <Box>
                    <Typography variant="h1">Vai trò & phân quyền</Typography>
                    <Typography color="text.secondary" sx={{ mt: 0.75 }}>
                        Quản lý vai trò, quyền truy cập và gán quyền nghiệp vụ cho tài khoản admin.
                    </Typography>
                </Box>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)} sx={{ alignSelf: { xs: "stretch", md: "center" } }}>
                    Thêm vai trò
                </Button>
            </Stack>

            {error && <Alert severity="warning">{error}</Alert>}

            <Grid container spacing={2.5}>
                <Grid item xs={12} md={4}>
                    <Card sx={{ borderRadius: 3, height: "100%" }}>
                        {loading && <LinearProgress />}
                        <CardContent sx={{ p: "22px !important" }}>
                            <Typography variant="h2" sx={{ mb: 2 }}>Vai trò</Typography>
                            <List disablePadding>
                                {roles.map((role) => (
                                    <ListItemButton
                                        key={role.id}
                                        selected={role.id === selectedRoleId}
                                        onClick={() => setSelectedRoleId(role.id)}
                                        sx={{ borderRadius: 2, mb: 1 }}
                                    >
                                        <ListItemText
                                            primary={role.ten_vai_tro || role.id}
                                            secondary={role.id}
                                            primaryTypographyProps={{ fontWeight: 700 }}
                                        />
                                    </ListItemButton>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Card sx={{ borderRadius: 3 }}>
                        {loading && <LinearProgress />}
                        <CardContent sx={{ p: "24px !important" }}>
                            <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={2} sx={{ mb: 2 }}>
                                <Box>
                                    <Typography variant="h2">Quyền của vai trò</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {selectedRole ? `${selectedRole.ten_vai_tro || selectedRole.id} - ${selectedRole.mo_ta || "Chưa có mô tả"}` : "Chọn vai trò để phân quyền"}
                                    </Typography>
                                </Box>
                                <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSavePermissions} disabled={!selectedRoleId || saving}>
                                    {saving ? "Đang lưu..." : "Lưu phân quyền"}
                                </Button>
                            </Stack>

                            <Divider sx={{ mb: 2 }} />

                            <Grid container spacing={1.5}>
                                {permissions.map((permission) => {
                                    const checked = selectedPermissionIds.has(permission.id);
                                    return (
                                        <Grid item xs={12} sm={6} key={permission.id}>
                                            <Card variant="outlined" sx={{ borderRadius: 2, borderColor: checked ? "secondary.main" : "divider" }}>
                                                <CardContent sx={{ p: "14px !important" }}>
                                                    <Stack direction="row" spacing={1.25} alignItems="flex-start">
                                                        <Checkbox checked={checked} onChange={() => togglePermission(permission.id)} />
                                                        <Box>
                                                            <Typography fontWeight={700}>{permission.ten_quyen || permission.id}</Typography>
                                                            <Typography variant="caption" sx={{ display: "block" }}>{permission.id}</Typography>
                                                            {permission.mo_ta && <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{permission.mo_ta}</Typography>}
                                                        </Box>
                                                    </Stack>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    );
                                })}
                            </Grid>

                            {!loading && permissions.length === 0 && (
                                <Box sx={{ py: 6, textAlign: "center", color: "text.secondary" }}>Chưa có quyền trong hệ thống.</Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
                <Box component="form" onSubmit={handleCreateRole}>
                    <DialogTitle>Thêm vai trò</DialogTitle>
                    <DialogContent>
                        <Stack spacing={2} sx={{ pt: 1 }}>
                            <TextField name="id" label="ID vai trò" value={roleForm.id} onChange={handleRoleFormChange} required inputProps={{ maxLength: 20 }} />
                            <TextField name="ten_vai_tro" label="Tên vai trò" value={roleForm.ten_vai_tro} onChange={handleRoleFormChange} required inputProps={{ maxLength: 100 }} />
                            <TextField name="mo_ta" label="Mô tả" value={roleForm.mo_ta} onChange={handleRoleFormChange} multiline minRows={3} />
                        </Stack>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2.5 }}>
                        <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
                        <Button type="submit" variant="contained" startIcon={<SecurityIcon />} disabled={saving}>{saving ? "Đang lưu..." : "Tạo vai trò"}</Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </Stack>
    );
}

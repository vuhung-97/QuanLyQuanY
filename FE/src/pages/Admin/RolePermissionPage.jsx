import { useEffect, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid,
    LinearProgress,
    List,
    ListItemButton,
    ListItemText,
    Stack,
    Typography,
} from "@mui/material";
import {
    Add as AddIcon,
    Edit as EditIcon,
    Save as SaveIcon,
} from "@mui/icons-material";
import api from "../../services/api.js";
import FeedbackSnackbar from "../../components/FeedbackSnackbar.jsx";
import AdminPageHeader from "../../components/admin/AdminPageHeader.jsx";
import TableCard from "../../components/admin/TableCard.jsx";
import PermissionCard from "../../components/admin/PermissionCard.jsx";
import usePermissionDiff from "../../components/admin/usePermissionDiff.js";
import RoleFormDialog from "./RoleFormDialog.jsx";

const fallbackRoles = [
    {
        id: "ROLE_ADMIN",
        ten_vai_tro: "Quản trị viên",
        mo_ta: "Toàn quyền hệ thống",
    },
    {
        id: "ROLE_BAC_SI",
        ten_vai_tro: "Bác sĩ",
        mo_ta: "Thực hiện khám chữa bệnh",
    },
    { id: "ROLE_Y_SI", ten_vai_tro: "Y sĩ", mo_ta: "Hỗ trợ nghiệp vụ quân y" },
];

const fallbackPermissions = [
    {
        id: "nguoi_dung:read",
        ten_quyen: "Xem người dùng",
        mo_ta: "Đọc danh sách tài khoản",
    },
    {
        id: "nguoi_dung:create",
        ten_quyen: "Tạo người dùng",
        mo_ta: "Thêm tài khoản mới",
    },
    {
        id: "lich_kham_sk_nam:read",
        ten_quyen: "Xem lịch khám",
        mo_ta: "Đọc lịch khám sức khỏe năm",
    },
    {
        id: "phieu_kham_suc_khoe:create",
        ten_quyen: "Tạo phiếu khám",
        mo_ta: "Lập phiếu khám sức khỏe",
    },
];

export default function RolePermissionPage() {
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [rolePermissions, setRolePermissions] = useState([]);
    const [selectedRoleId, setSelectedRoleId] = useState("");
    const [selectedPermissionIds, setSelectedPermissionIds] = useState(
        new Set(),
    );
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [editingRole, setEditingRole] = useState(null);
    const [permissionFilter, setPermissionFilter] = useState("all");

    const actionTypes = [
        ...new Set(
            permissions.map((p) => p.id.split(":").at(1)).filter(Boolean),
        ),
    ];

    const filteredPermissions =
        permissionFilter === "all"
            ? permissions
            : permissions.filter((p) => p.id.endsWith(":" + permissionFilter));

    const allSelected =
        selectedRoleId &&
        filteredPermissions.length > 0 &&
        filteredPermissions.every((p) => selectedPermissionIds.has(p.id));

    useEffect(() => {
        let ignore = false;

        async function loadData() {
            setLoading(true);
            setError("");
            try {
                const [rolesRes, permissionsRes, mappingRes] =
                    await Promise.all([
                        api.get("/vai_tro", {
                            params: { limit: 100, offset: 0 },
                        }),
                        api.get("/quyen", {
                            params: { limit: 200, offset: 0 },
                        }),
                        api.get("/vai_tro_quyen", {
                            params: { limit: 200, offset: 0 },
                        }),
                    ]);
                if (!ignore) {
                    const nextRoles = Array.isArray(rolesRes.data)
                        ? rolesRes.data
                        : [];
                    setRoles(nextRoles);
                    setPermissions(
                        Array.isArray(permissionsRes.data)
                            ? permissionsRes.data
                            : [],
                    );
                    setRolePermissions(
                        Array.isArray(mappingRes.data) ? mappingRes.data : [],
                    );
                    setSelectedRoleId(nextRoles[0]?.id || "");
                }
            } catch (err) {
                if (!ignore) {
                    setError(
                        err.response?.data?.detail ||
                            "Chưa tải được dữ liệu phân quyền từ API.",
                    );
                    setRoles(fallbackRoles);
                    setPermissions(fallbackPermissions);
                    setRolePermissions([
                        {
                            id_vai_tro: "ROLE_ADMIN",
                            id_quyen: "nguoi_dung:read",
                        },
                    ]);
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

    const { savePermissions } = usePermissionDiff(
        rolePermissions,
        setRolePermissions,
        selectedRoleId,
        selectedPermissionIds,
    );

    const selectedRole = roles.find((role) => role.id === selectedRoleId);

    const togglePermission = (permissionId) => {
        setSelectedPermissionIds((current) => {
            const next = new Set(current);
            if (next.has(permissionId)) next.delete(permissionId);
            else next.add(permissionId);
            return next;
        });
    };

    const handleToggleSelectAll = () => {
        if (allSelected) {
            setSelectedPermissionIds((current) => {
                const filteredIds = new Set(
                    filteredPermissions.map((p) => p.id),
                );
                const next = new Set(current);
                for (const id of filteredIds) next.delete(id);
                return next;
            });
        } else {
            setSelectedPermissionIds((current) => {
                const next = new Set(current);
                for (const p of filteredPermissions) next.add(p.id);
                return next;
            });
        }
    };

    const handleOpenEdit = (role) => {
        setEditingRole(role);
        setOpenDialog(true);
    };

    const handleOpenCreate = () => {
        setEditingRole(null);
        setOpenDialog(true);
    };

    const handleSubmitRole = async (formData) => {
        setSaving(true);
        setError("");
        try {
            if (editingRole) {
                const res = await api.patch(
                    `/vai_tro/${editingRole.id}`,
                    formData,
                    {
                        headers: { "Content-Type": "application/json" },
                    },
                );
                setRoles((current) =>
                    current.map((r) =>
                        r.id === editingRole.id ? res.data : r,
                    ),
                );
            } else {
                const res = await api.post("/vai_tro", formData, {
                    headers: { "Content-Type": "application/json" },
                });
                setRoles((current) => [res.data, ...current]);
                setSelectedRoleId(res.data.id);
            }
            setOpenDialog(false);
            setSuccess(
                editingRole
                    ? "Cập nhật vai trò thành công"
                    : "Tạo vai trò thành công",
            );
        } catch (err) {
            setError(err.response?.data?.detail || "Không thể lưu vai trò.");
        } finally {
            setSaving(false);
        }
    };

    const handleSavePermissions = async () => {
        if (!selectedRoleId) return;
        setSaving(true);
        setError("");
        try {
            await savePermissions();
            setSuccess("Lưu phân quyền thành công");
        } catch (err) {
            setError(err.response?.data?.detail || "Không thể lưu phân quyền.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Stack spacing={3}>
            <AdminPageHeader
                title="Vai trò & phân quyền"
                description="Quản lý vai trò, quyền truy cập và gán quyền nghiệp vụ cho tài khoản."
                action={
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleOpenCreate}
                        sx={{ alignSelf: { xs: "stretch", md: "center" } }}
                    >
                        Thêm vai trò
                    </Button>
                }
            />

            <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ borderRadius: 3, height: "100%" }}>
                        {loading && <LinearProgress />}
                        <CardContent sx={{ p: "22px !important" }}>
                            <Typography variant="h2" sx={{ mb: 2 }}>
                                Vai trò
                            </Typography>
                            <List disablePadding>
                                {roles.map((role) => (
                                    <ListItemButton
                                        key={role.id}
                                        selected={role.id === selectedRoleId}
                                        onClick={() =>
                                            setSelectedRoleId(role.id)
                                        }
                                        sx={{ borderRadius: 2, mb: 1 }}
                                    >
                                        <ListItemText
                                            primary={
                                                role.ten_vai_tro || role.id
                                            }
                                            secondary={role.id}
                                            slotProps={{
                                                primaryTypography: {
                                                    fontWeight: 700,
                                                },
                                            }}
                                            sx={{ flex: "1 1 auto" }}
                                        />
                                        <Button
                                            size="small"
                                            startIcon={<EditIcon />}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleOpenEdit(role);
                                            }}
                                        >
                                            Sửa
                                        </Button>
                                    </ListItemButton>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 8 }}>
                    <TableCard loading={loading}>
                            <Stack
                                direction={{ xs: "column", md: "row" }}
                                spacing={2}
                                sx={{ mb: 2, justifyContent: "space-between" }}
                            >
                                <Box>
                                    <Typography variant="h2">
                                        Quyền của vai trò
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {selectedRole
                                            ? `${selectedRole.ten_vai_tro || selectedRole.id} - ${selectedRole.mo_ta || "Chưa có mô tả"}`
                                            : "Chọn vai trò để phân quyền"}
                                    </Typography>
                                </Box>
                                <Stack direction="row" spacing={1}>
                                    <Button
                                        variant="outlined"
                                        onClick={handleToggleSelectAll}
                                        disabled={
                                            !selectedRoleId ||
                                            filteredPermissions.length === 0
                                        }
                                    >
                                        {allSelected
                                            ? "Bỏ chọn tất cả"
                                            : "Chọn tất cả"}
                                    </Button>
                                    <Button
                                        variant="contained"
                                        startIcon={<SaveIcon />}
                                        onClick={handleSavePermissions}
                                        disabled={!selectedRoleId || saving}
                                    >
                                        {saving
                                            ? "Đang lưu..."
                                            : "Lưu phân quyền"}
                                    </Button>
                                </Stack>
                            </Stack>

                            <Divider sx={{ mb: 2 }} />

                            <Stack
                                direction="row"
                                spacing={1}
                                sx={{ mb: 2, flexWrap: "wrap" }}
                            >
                                <Chip
                                    label="Tất cả"
                                    size="small"
                                    color={
                                        permissionFilter === "all"
                                            ? "primary"
                                            : "default"
                                    }
                                    onClick={() => setPermissionFilter("all")}
                                />
                                {actionTypes.map((action) => (
                                    <Chip
                                        key={action}
                                        label={action}
                                        size="small"
                                        color={
                                            permissionFilter === action
                                                ? "primary"
                                                : "default"
                                        }
                                        onClick={() =>
                                            setPermissionFilter(action)
                                        }
                                    />
                                ))}
                            </Stack>

                            <Grid container spacing={1.5}>
                                {filteredPermissions.map((permission) => (
                                    <Grid
                                        size={{ xs: 12, sm: 6 }}
                                        key={permission.id}
                                    >
                                        <PermissionCard
                                            permission={permission}
                                            checked={selectedPermissionIds.has(
                                                permission.id,
                                            )}
                                            onToggle={togglePermission}
                                        />
                                    </Grid>
                                ))}
                            </Grid>

                            {!loading && filteredPermissions.length === 0 && (
                                <Box
                                    sx={{
                                        py: 6,
                                        textAlign: "center",
                                        color: "text.secondary",
                                    }}
                                >
                                    {permissions.length === 0
                                        ? "Chưa có quyền trong hệ thống."
                                        : "Không có quyền nào khớp với bộ lọc."}
                                </Box>
                            )}
                        </TableCard>
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

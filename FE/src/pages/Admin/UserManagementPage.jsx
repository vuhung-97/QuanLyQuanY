import { useEffect, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Grid,
    LinearProgress,
    MenuItem,
    Stack,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import {
    Add as AddIcon,
    ManageAccounts as ManageAccountsIcon,
    Search as SearchIcon,
} from "@mui/icons-material";
import api from "../../services/api.js";

const emptyForm = {
    ten_dang_nhap: "",
    mat_khau: "",
    ho_ten: "",
    id_vai_tro: "",
    id_quan_nhan: "",
    trang_thai: true,
};

export default function UserManagementPage() {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [query, setQuery] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [form, setForm] = useState(emptyForm);

    useEffect(() => {
        let ignore = false;

        async function loadData() {
            setLoading(true);
            setError("");
            try {
                const [usersRes, rolesRes] = await Promise.all([
                    api.get("/nguoi_dung", {
                        params: { limit: 100, offset: 0 },
                    }),
                    api.get("/vai_tro", { params: { limit: 100, offset: 0 } }),
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
        const keyword = query.trim().toLowerCase();
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
        setForm(emptyForm);
        setOpenDialog(true);
    };

    const handleOpenEdit = (user) => {
        setEditingUser(user);
        setForm({ ...emptyForm, ...user, mat_khau: "" });
        setOpenDialog(true);
    };

    const handleChange = (event) => {
        const { name, value, checked, type } = event.target;
        setForm((current) => ({
            ...current,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError("");
        try {
            const payload = { ...form };
            if (!editingUser) delete payload.id;
            if (editingUser && !payload.mat_khau) delete payload.mat_khau;

            if (editingUser) {
                const res = await api.patch(
                    `/nguoi_dung/${editingUser.id}`,
                    payload,
                    { headers: { "Content-Type": "application/json" } },
                );
                setUsers((current) =>
                    current.map((user) =>
                        user.id === editingUser.id ? res.data : user,
                    ),
                );
            } else {
                const res = await api.post("/nguoi_dung", payload, {
                    headers: { "Content-Type": "application/json" },
                });
                setUsers((current) => [res.data, ...current]);
            }
            setOpenDialog(false);
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                    "Không thể lưu tài khoản người dùng.",
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <Stack spacing={3}>
            <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                sx={{ justifyContent: "space-between" }}
            >
                <Box>
                    <Typography variant="h1">Tài khoản người dùng</Typography>
                    <Typography color="text.secondary" sx={{ mt: 0.75 }}>
                        Thêm tài khoản, đổi vai trò và quản lý trạng thái đăng
                        nhập cho tài khoản admin.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenCreate}
                    sx={{ alignSelf: { xs: "stretch", md: "center" } }}
                >
                    Thêm tài khoản
                </Button>
            </Stack>

            {error && <Alert severity="warning">{error}</Alert>}

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

            <Card sx={{ borderRadius: 3 }}>
                {loading && <LinearProgress />}
                <CardContent sx={{ p: "24px !important" }}>
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
                        <TextField
                            size="small"
                            placeholder="Tìm tài khoản, họ tên, vai trò"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <SearchIcon
                                            sx={{
                                                mr: 1,
                                                color: "text.secondary",
                                            }}
                                        />
                                    ),
                                },
                            }}
                            sx={{ minWidth: { xs: "100%", md: 320 } }}
                        />
                    </Stack>

                    <TableContainer>
                        <Table sx={{ minWidth: 760 }}>
                            <TableHead>
                                <TableRow>
                                    {[
                                        "ID",
                                        "Tên đăng nhập",
                                        "Họ tên",
                                        "Vai trò",
                                        "Quân nhân",
                                        "Trạng thái",
                                        "Thao tác",
                                    ].map((label) => (
                                        <TableCell
                                            key={label}
                                            sx={{ fontWeight: 700 }}
                                        >
                                            {label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredUsers.map((user) => (
                                    <TableRow key={user.id} hover>
                                        <TableCell
                                            sx={{
                                                fontWeight: 700,
                                                color: "primary.main",
                                            }}
                                        >
                                            {user.id}
                                        </TableCell>
                                        <TableCell>
                                            {user.ten_dang_nhap}
                                        </TableCell>
                                        <TableCell>{user.ho_ten}</TableCell>
                                        <TableCell>
                                            <Chip
                                                size="small"
                                                label={
                                                    user.ten_vai_tro ||
                                                    user.id_vai_tro ||
                                                    "Chưa gán"
                                                }
                                                color={
                                                    user.id_vai_tro ===
                                                    "ROLE_ADMIN"
                                                        ? "secondary"
                                                        : "default"
                                                }
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {user.id_quan_nhan || "--"}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                size="small"
                                                label={
                                                    user.trang_thai
                                                        ? "Hoạt động"
                                                        : "Khóa"
                                                }
                                                color={
                                                    user.trang_thai
                                                        ? "success"
                                                        : "error"
                                                }
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                size="small"
                                                startIcon={
                                                    <ManageAccountsIcon />
                                                }
                                                onClick={() =>
                                                    handleOpenEdit(user)
                                                }
                                            >
                                                Sửa quyền
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {!loading && filteredUsers.length === 0 && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            align="center"
                                            sx={{
                                                py: 5,
                                                color: "text.secondary",
                                            }}
                                        >
                                            Không có tài khoản phù hợp.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>

            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                fullWidth
                maxWidth="sm"
            >
                <Box component="form" onSubmit={handleSubmit}>
                    <DialogTitle>
                        {editingUser
                            ? "Cập nhật tài khoản"
                            : "Thêm tài khoản người dùng"}
                    </DialogTitle>
                    <DialogContent>
                        <Stack spacing={2} sx={{ pt: 1 }}>
                            <TextField
                                name="ten_dang_nhap"
                                label="Tên đăng nhập"
                                value={form.ten_dang_nhap}
                                onChange={handleChange}
                                required
                                slotProps={{ htmlInput: { maxLength: 50 } }}
                            />
                            <TextField
                                name="mat_khau"
                                label={
                                    editingUser
                                        ? "Mật khẩu mới (nếu đổi)"
                                        : "Mật khẩu"
                                }
                                type="password"
                                value={form.mat_khau}
                                onChange={handleChange}
                                required={!editingUser}
                            />
                            <TextField
                                name="ho_ten"
                                label="Họ tên"
                                value={form.ho_ten}
                                onChange={handleChange}
                                required
                                slotProps={{ htmlInput: { maxLength: 100 } }}
                            />
                            <TextField
                                select
                                name="id_vai_tro"
                                label="Vai trò"
                                value={form.id_vai_tro || ""}
                                onChange={handleChange}
                            >
                                <MenuItem value="">Chưa gán</MenuItem>
                                {roles.map((role) => (
                                    <MenuItem key={role.id} value={role.id}>
                                        {role.ten_vai_tro || role.id}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                name="id_quan_nhan"
                                label="Mã quân nhân"
                                value={form.id_quan_nhan || ""}
                                onChange={handleChange}
                                slotProps={{ htmlInput: { maxLength: 20 } }}
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        name="trang_thai"
                                        checked={Boolean(form.trang_thai)}
                                        onChange={handleChange}
                                    />
                                }
                                label="Tài khoản đang hoạt động"
                            />
                        </Stack>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2.5 }}>
                        <Button onClick={() => setOpenDialog(false)}>
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={saving}
                        >
                            {saving ? "Đang lưu..." : "Lưu"}
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </Stack>
    );
}

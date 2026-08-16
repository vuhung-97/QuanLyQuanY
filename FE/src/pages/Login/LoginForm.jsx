import { useState } from "react";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import {
    alpha,
    Box,
    Button,
    Card,
    Checkbox,
    Divider,
    FormControlLabel,
    IconButton,
    InputAdornment,
    Stack,
    Tab,
    Tabs,
    TextField,
    Typography,
} from "@mui/material";
import FeedbackSnackbar from "@/components/common/FeedbackSnackbar.jsx";
import useRegister from "@/hooks/useRegister.js";

export default function LoginForm({
    showPassword,
    loading,
    error,
    onSubmit,
    onTogglePassword,
    onCloseError,
}) {
    const [tab, setTab] = useState(0);
    const [loginUsername, setLoginUsername] = useState("");

    const {
        loading: regLoading,
        error: regError,
        success: regSuccess,
        register,
        setError: setRegError,
        setSuccess: setRegSuccess,
    } = useRegister();

    const [regData, setRegData] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        maQuanNhan: "",
    });
    const [fieldErrors, setFieldErrors] = useState({});

    const handleTabChange = (_e, value) => setTab(value);

    const handleRegChange = (field) => (event) => {
        setRegData((prev) => ({ ...prev, [field]: event.target.value }));
        setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const handleRegisterSubmit = async (event) => {
        event.preventDefault();
        setRegError("");
        setRegSuccess("");

        const username = regData.username.trim();
        const password = regData.password;
        const confirmPassword = regData.confirmPassword;
        const maQuanNhan = regData.maQuanNhan.trim();

        const errors = {};
        if (!username) errors.username = "Vui lòng nhập tên đăng nhập";
        if (!password) {
            errors.password = "Vui lòng nhập mật khẩu";
        } else if (password.length < 8) {
            errors.password = "Mật khẩu tối thiểu 8 ký tự";
        }
        if (!confirmPassword) {
            errors.confirmPassword = "Vui lòng nhập lại mật khẩu";
        } else if (password !== confirmPassword) {
            errors.confirmPassword = "Mật khẩu không khớp";
        }
        if (!maQuanNhan) {
            errors.maQuanNhan = "Vui lòng nhập mã quân nhân";
        }
        setFieldErrors(errors);
        if (Object.keys(errors).length > 0) return;

        try {
            await register({ tenDangNhap: username, matKhau: password, maQuanNhan });
            setLoginUsername(username);
            setRegData({
                username: "",
                password: "",
                confirmPassword: "",
                maQuanNhan: "",
            });
            setTab(0);
        } catch {
            // lỗi đã được set trong useRegister
        }
    };

    const passwordInputProps = {
        input: {
            endAdornment: (
                <InputAdornment position="end">
                    <IconButton
                        aria-label={
                            showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                        }
                        onClick={onTogglePassword}
                        edge="end"
                    >
                        {showPassword ? (
                            <VisibilityOffIcon />
                        ) : (
                            <VisibilityIcon />
                        )}
                    </IconButton>
                </InputAdornment>
            ),
        },
    };

    return (
        <Box
            sx={(theme) => ({
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: { xs: 2.5, sm: 4, md: 6 },
                background: `radial-gradient(circle at 85% 15%, ${alpha(theme.palette.secondary.main, 0.14)}, transparent 30%), ${theme.palette.background.default}`,
            })}
        >
            <Card
                elevation={0}
                sx={(theme) => ({
                    width: "100%",
                    maxWidth: 460,
                    p: { xs: 3, sm: 4.5 },
                    borderRadius: 4,
                    boxShadow: `0 24px 70px ${alpha(theme.palette.primary.main, 0.14)}`,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
                })}
            >
                <Stack spacing={3}>
                    <Tabs
                        value={tab}
                        onChange={handleTabChange}
                        variant="fullWidth"
                        sx={(theme) => ({
                            minHeight: 40,
                            bgcolor: alpha(theme.palette.secondary.main, 0.08),
                            borderRadius: 3,
                            "& .MuiTabs-indicator": {
                                borderRadius: 3,
                                bgcolor: "primary.main",
                            },
                            "& .MuiTab-root": {
                                minHeight: 40,
                                py: 0,
                                fontWeight: 600,
                                textTransform: "none",
                            },
                        })}
                    >
                        <Tab
                            icon={<LockOutlinedIcon fontSize="small" />}
                            iconPosition="start"
                            label="Đăng nhập"
                        />
                        <Tab
                            icon={<PersonAddAlt1Icon fontSize="small" />}
                            iconPosition="start"
                            label="Đăng ký"
                        />
                    </Tabs>

                    {tab === 0 && (
                        <Stack spacing={2.5}>
                            <Stack
                                spacing={1.5}
                                sx={{
                                    alignItems: {
                                        xs: "center",
                                        sm: "flex-start",
                                    },
                                }}
                            >
                                <Box
                                    sx={(theme) => ({
                                        width: 58,
                                        height: 58,
                                        display: "grid",
                                        placeItems: "center",
                                        borderRadius: 3,
                                        color: "primary.main",
                                        bgcolor: alpha(
                                            theme.palette.secondary.main,
                                            0.12,
                                        ),
                                    })}
                                >
                                    <LocalHospitalIcon fontSize="large" />
                                </Box>
                                <Box
                                    sx={{
                                        textAlign: {
                                            xs: "center",
                                            sm: "left",
                                        },
                                    }}
                                >
                                    <Typography variant="h1">
                                        Đăng nhập hệ thống
                                    </Typography>
                                    <Typography
                                        sx={{
                                            mt: 0.75,
                                            color: "text.secondary",
                                        }}
                                    >
                                        Sử dụng tài khoản được cấp để truy cập
                                        phần mềm.
                                    </Typography>
                                </Box>
                            </Stack>

                            <Divider />

                            <Box component="form" onSubmit={onSubmit}>
                                <Stack spacing={2.25}>
                                    <TextField
                                        name="username"
                                        label="Tên đăng nhập"
                                        placeholder="Nhập mã quân nhân hoặc tài khoản"
                                        autoComplete="username"
                                        fullWidth
                                        required
                                        value={loginUsername}
                                        onChange={(e) =>
                                            setLoginUsername(e.target.value)
                                        }
                                    />
                                    <TextField
                                        name="password"
                                        label="Mật khẩu"
                                        placeholder="Nhập mật khẩu"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        autoComplete="current-password"
                                        fullWidth
                                        required
                                        slotProps={passwordInputProps}
                                    />

                                    <Stack
                                        direction={{
                                            xs: "column",
                                            sm: "row",
                                        }}
                                        spacing={1}
                                        sx={{
                                            alignItems: {
                                                xs: "flex-start",
                                                sm: "center",
                                            },
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    name="remember"
                                                    color="secondary"
                                                />
                                            }
                                            label="Ghi nhớ đăng nhập"
                                            sx={{ color: "text.secondary" }}
                                        />
                                        <Button
                                            variant="text"
                                            size="small"
                                        >
                                            Quên mật khẩu?
                                        </Button>
                                    </Stack>

                                    <Button
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        disabled={loading}
                                        startIcon={
                                            loading ? null : (
                                                <LockOutlinedIcon />
                                            )
                                        }
                                        sx={(theme) => ({
                                            py: 1.35,
                                            bgcolor: "primary.main",
                                            boxShadow: `0 14px 28px ${alpha(theme.palette.primary.main, 0.24)}`,
                                            "&:hover": {
                                                bgcolor: "primary.dark",
                                                boxShadow: `0 18px 34px ${alpha(theme.palette.primary.main, 0.3)}`,
                                            },
                                        })}
                                    >
                                        {loading
                                            ? "Đang đăng nhập..."
                                            : "Đăng nhập"}
                                    </Button>
                                </Stack>
                            </Box>
                        </Stack>
                    )}

                    {tab === 1 && (
                        <Stack spacing={2.5}>
                            <Stack
                                spacing={1.5}
                                sx={{
                                    alignItems: {
                                        xs: "center",
                                        sm: "flex-start",
                                    },
                                }}
                            >
                                <Box
                                    sx={(theme) => ({
                                        width: 58,
                                        height: 58,
                                        display: "grid",
                                        placeItems: "center",
                                        borderRadius: 3,
                                        color: "primary.main",
                                        bgcolor: alpha(
                                            theme.palette.secondary.main,
                                            0.12,
                                        ),
                                    })}
                                >
                                    <PersonAddAlt1Icon fontSize="large" />
                                </Box>
                                <Box
                                    sx={{
                                        textAlign: {
                                            xs: "center",
                                            sm: "left",
                                        },
                                    }}
                                >
                                    <Typography variant="h1">
                                        Đăng ký tài khoản
                                    </Typography>
                                    <Typography
                                        sx={{
                                            mt: 0.75,
                                            color: "text.secondary",
                                        }}
                                    >
                                        Đăng ký dành cho quân nhân. Tài khoản
                                        được kích hoạt ngay sau khi đăng ký.
                                    </Typography>
                                </Box>
                            </Stack>

                            <Divider />

                            <Box
                                component="form"
                                onSubmit={handleRegisterSubmit}
                            >
                                <Stack spacing={2.25}>
                                    <TextField
                                        name="reg-username"
                                        label="Tên đăng nhập"
                                        placeholder="Nhập tên đăng nhập"
                                        autoComplete="off"
                                        fullWidth
                                        required
                                        value={regData.username}
                                        onChange={handleRegChange("username")}
                                        error={Boolean(
                                            fieldErrors.username,
                                        )}
                                        helperText={fieldErrors.username}
                                    />
                                    <TextField
                                        name="reg-password"
                                        label="Mật khẩu"
                                        placeholder="Tối thiểu 8 ký tự"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        autoComplete="new-password"
                                        fullWidth
                                        required
                                        slotProps={passwordInputProps}
                                        value={regData.password}
                                        onChange={handleRegChange("password")}
                                        error={Boolean(
                                            fieldErrors.password,
                                        )}
                                        helperText={fieldErrors.password}
                                    />
                                    <TextField
                                        name="reg-confirm-password"
                                        label="Nhập lại mật khẩu"
                                        placeholder="Nhập lại mật khẩu"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        autoComplete="new-password"
                                        fullWidth
                                        required
                                        slotProps={passwordInputProps}
                                        value={regData.confirmPassword}
                                        onChange={handleRegChange(
                                            "confirmPassword",
                                        )}
                                        error={Boolean(
                                            fieldErrors.confirmPassword,
                                        )}
                                        helperText={fieldErrors.confirmPassword}
                                    />
                                    <TextField
                                        name="reg-ma-quan-nhan"
                                        label="Mã quân nhân"
                                        placeholder="Nhập mã quân nhân"
                                        autoComplete="off"
                                        fullWidth
                                        required
                                        value={regData.maQuanNhan}
                                        onChange={handleRegChange(
                                            "maQuanNhan",
                                        )}
                                        error={Boolean(
                                            fieldErrors.maQuanNhan,
                                        )}
                                        helperText={fieldErrors.maQuanNhan}
                                    />

                                    <Button
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        disabled={regLoading}
                                        startIcon={
                                            regLoading ? null : (
                                                <PersonAddAlt1Icon />
                                            )
                                        }
                                        sx={(theme) => ({
                                            py: 1.35,
                                            bgcolor: "primary.main",
                                            boxShadow: `0 14px 28px ${alpha(theme.palette.primary.main, 0.24)}`,
                                            "&:hover": {
                                                bgcolor: "primary.dark",
                                                boxShadow: `0 18px 34px ${alpha(theme.palette.primary.main, 0.3)}`,
                                            },
                                        })}
                                    >
                                        {regLoading
                                            ? "Đang đăng ký..."
                                            : "Đăng ký"}
                                    </Button>
                                </Stack>
                            </Box>
                        </Stack>
                    )}

                    <FeedbackSnackbar
                        open={!!error}
                        message={error}
                        severity="error"
                        onClose={onCloseError}
                    />

                    <FeedbackSnackbar
                        open={!!regError}
                        message={regError}
                        severity="error"
                        onClose={() => setRegError("")}
                    />

                    <FeedbackSnackbar
                        open={!!regSuccess}
                        message={regSuccess}
                        severity="success"
                        onClose={() => setRegSuccess("")}
                    />
                </Stack>
            </Card>
        </Box>
    );
}
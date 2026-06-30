import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
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
    TextField,
    Typography,
} from "@mui/material";
import FeedbackSnackbar from "@/components/common/FeedbackSnackbar.jsx";

export default function LoginForm({
    showPassword,
    loading,
    error,
    onSubmit,
    onTogglePassword,
    onCloseError,
}) {
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
                    <Stack
                        spacing={1.5}
                        sx={{
                            alignItems: { xs: "center", sm: "flex-start" },
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
                                bgcolor: alpha(theme.palette.secondary.main, 0.12),
                            })}
                        >
                            <LocalHospitalIcon fontSize="large" />
                        </Box>
                        <Box
                            sx={{ textAlign: { xs: "center", sm: "left" } }}
                        >
                            <Typography variant="h1">
                                Đăng nhập hệ thống
                            </Typography>
                            <Typography
                                sx={{ mt: 0.75, color: "text.secondary" }}
                            >
                                Sử dụng tài khoản được cấp để truy cập phần
                                mềm.
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
                            />
                            <TextField
                                name="password"
                                label="Mật khẩu"
                                placeholder="Nhập mật khẩu"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                fullWidth
                                required
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label={
                                                        showPassword
                                                            ? "An mat khau"
                                                            : "Hien mat khau"
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
                                }}
                            />

                            <Stack
                                direction={{ xs: "column", sm: "row" }}
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
                                <Button variant="text" size="small">
                                    Quên mật khẩu?
                                </Button>
                            </Stack>

                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={loading}
                                startIcon={
                                    loading ? null : <LockOutlinedIcon />
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

                    <FeedbackSnackbar
                        open={!!error}
                        message={error}
                        severity="error"
                        onClose={onCloseError}
                    />
                </Stack>
            </Card>
        </Box>
    );
}

import { useState } from "react";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
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
    Chip,
    Divider,
    FormControlLabel,
    IconButton,
    InputAdornment,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import api from "@/services/api";
import FeedbackSnackbar from "@/components/common/FeedbackSnackbar.jsx";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        const formData = new FormData(event.currentTarget);

        try {
            const params = new URLSearchParams();
            params.append("username", formData.get("username"));
            params.append("password", formData.get("password"));

            const res = await api.post("/auth/login", params, {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            });
            const token = res.data.access_token;
            localStorage.setItem("datamed_access_token", token);

            if (formData.get("remember") === "on") {
                localStorage.setItem(
                    "datamed_remember",
                    formData.get("username"),
                );
            }

            window.location.href = "/";
        } catch (err) {
            const detail = err.response?.data?.detail || "Đăng nhập thất bại";
            setError(detail);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1.05fr 0.95fr" },
                bgcolor: "background.default",
                overflow: "hidden",
            }}
        >
            <Box
                sx={(theme) => ({
                    position: "relative",
                    display: { xs: "none", md: "flex" },
                    flexDirection: "column",
                    justifyContent: "space-between",
                    p: { md: 5, lg: 7 },
                    color: "white",
                    background: `radial-gradient(circle at 18% 20%, ${alpha(theme.palette.secondary.main, 0.45)}, transparent 28%), linear-gradient(145deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 58%, ${theme.palette.primary.light} 100%)`,
                })}
            >
                <Box
                    sx={{
                        position: "absolute",
                        inset: 28,
                        border: "1px solid rgba(255,255,255,0.14)",
                        borderRadius: 6,
                        pointerEvents: "none",
                    }}
                />

                <Stack spacing={1.25} sx={{ position: "relative" }}>
                    <Stack
                        direction="row"
                        spacing={1.5}
                        sx={{ alignItems: "center" }}
                    >
                        <Box
                            sx={{
                                width: 100,
                                height: 100,
                                display: "grid",
                                placeItems: "center",
                                borderRadius: 3,
                                bgcolor: "rgba(255,255,255,0.12)",
                                backdropFilter: "blur(14px)",
                            }}
                        >
                            <HealthAndSafetyIcon sx={{ fontSize: 70 }} />
                        </Box>
                        <Box>
                            <Typography sx={{ fontSize: 40, fontWeight: 900 }}>
                                QUÂN CHỦNG HẢI QUÂN
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{
                                    color: "rgba(255,255,255,0.72)",
                                    fontSize: 24,
                                }}
                            >
                                -- Lữ đoàn 170 --
                            </Typography>
                        </Box>
                    </Stack>
                </Stack>

                <Stack spacing={3} sx={{ position: "relative", maxWidth: 760 }}>
                    <Chip
                        label="Quản lý nghiệp vụ Quân y"
                        sx={{
                            alignSelf: "flex-start",
                            color: "white",
                            bgcolor: "rgba(255,255,255,0.12)",
                            border: "1px solid rgba(255,255,255,0.18)",
                            backdropFilter: "blur(12px)",
                            fontSize: 24,
                        }}
                    />
                    <Typography
                        sx={{
                            fontSize: { md: 42, lg: 52 },
                            fontWeight: 1000,
                            lineHeight: 1.05,
                        }}
                    >
                        Hệ thống quản lý khám, chữa bệnh tập trung dành cho cán
                        bộ, chiến sĩ đơn vị.
                    </Typography>
                    <Typography
                        sx={{
                            maxWidth: 500,
                            color: "rgba(255,255,255,0.76)",
                            fontSize: 24,
                        }}
                    >
                        Giao diện trực quan, tinh gọn, giúp cán bộ quân y thao
                        tác nhanh chóng, chính xác trong mọi ca trực.
                    </Typography>
                </Stack>

                <Stack
                    direction="row"
                    spacing={2}
                    sx={{ position: "relative" }}
                >
                    {[
                        "Bảo mật quân sự",
                        "Theo dõi tồn kho",
                        "Hỗ trợ khám bệnh",
                    ].map((item) => (
                        <Box
                            key={item}
                            sx={{
                                px: 2,
                                py: 1.25,
                                borderRadius: 3,
                                bgcolor: "rgba(255,255,255,0.1)",
                                border: "1px solid rgba(255,255,255,0.12)",
                                fontSize: 18,
                            }}
                        >
                            <Typography
                                variant="caption"
                                sx={{
                                    color: "rgba(255,255,255,0.78)",
                                    fontSize: 20,
                                }}
                            >
                                {item}
                            </Typography>
                        </Box>
                    ))}
                </Stack>
            </Box>

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

                        <Box component="form" onSubmit={handleSubmit}>
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
                                                        onClick={() =>
                                                            setShowPassword(
                                                                (value) =>
                                                                    !value,
                                                            )
                                                        }
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
                            onClose={() => setError("")}
                        />
                    </Stack>
                </Card>
            </Box>
        </Box>
    );
}

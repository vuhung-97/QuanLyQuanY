import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import { alpha, Box, Chip, Stack, Typography } from "@mui/material";
import { UNIT_NAME } from "@/components/layout/common/constants.js";

export default function LoginHero() {
    return (
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
                            Vùng I Hải quân
                        </Typography>
                    </Box>
                </Stack>
            </Stack>

            <Stack spacing={3} sx={{ position: "relative", maxWidth: 760 }}>
                <Chip
                    label={`-- ${UNIT_NAME} --`}
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
                    HỆ THỐNG QUẢN LÝ QUÂN Y LỮ ĐOÀN HẢI QUÂN.
                </Typography>
                <Typography
                    sx={{
                        maxWidth: 500,
                        color: "rgba(255,255,255,0.76)",
                        fontSize: 24,
                    }}
                >
                    Giao diện trực quan, tinh gọn, giúp cán bộ quân y thao tác
                    nhanh chóng, chính xác trong mọi ca trực.
                </Typography>
            </Stack>

            <Stack direction="row" spacing={2} sx={{ position: "relative" }}>
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
    );
}

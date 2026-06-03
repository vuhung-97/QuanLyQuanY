import { Box, Stack, Avatar, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";

export default function SidebarProfile({ user, open = true, sx }) {
    const theme = useTheme();
    if (!user || !open) return null;

    return (
        <Stack
            direction="row"
            spacing={2}
            sx={{ mb: 3, px: 1, alignItems: "center", ...sx }}
        >
            <Avatar src={user.avatar} sx={{ width: 40, height: 40 }} />
            <Box sx={{ overflow: "hidden" }}>
                <Typography
                    variant="subtitle2"
                    sx={{
                        fontWeight: 600,
                        color: theme.palette.common.white,
                        whiteSpace: "nowrap",
                    }}
                >
                    {user.name}
                </Typography>
                {user.role && (
                    <Typography
                        variant="caption"
                        sx={{
                            color: alpha(theme.palette.common.white, 0.6),
                            display: "block",
                            whiteSpace: "normal",
                            lineHeight: 1.2,
                        }}
                    >
                        {user.role}
                    </Typography>
                )}
            </Box>
        </Stack>
    );
}

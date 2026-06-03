import { Box, Stack, Avatar, Typography } from "@mui/material";

export default function SidebarProfile({ user, open = true, sx }) {
    if (!user || !open) return null;

    return (
        <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ mb: 3, px: 1, ...sx }}
        >
            <Avatar src={user.avatar} sx={{ width: 40, height: 40 }} />
            <Box sx={{ overflow: "hidden" }}>
                <Typography
                    variant="subtitle2"
                    sx={{
                        fontWeight: 600,
                        color: "#FFFFFF",
                        whiteSpace: "nowrap",
                    }}
                >
                    {user.name}
                </Typography>
                {user.role && (
                    <Typography
                        variant="caption"
                        sx={{
                            color: "rgba(255,255,255,0.6)",
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

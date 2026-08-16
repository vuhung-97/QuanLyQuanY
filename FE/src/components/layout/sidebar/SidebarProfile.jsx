import { useState } from "react";
import {
    Box,
    Stack,
    Avatar,
    Typography,
    Popover,
    Badge,
    useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { NotificationsActive as NotificationsActiveIcon } from "@mui/icons-material";
import useMyTemporaryRole from "@/hooks/useMyTemporaryRole.jsx";

export default function SidebarProfile({ user, open = true, sx }) {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState(null);
    const { assignment } = useMyTemporaryRole();

    if (!user || !open) return null;

    const hasTemporaryRole = Boolean(assignment?.ten_vai_tro);

    const handleToggle = (event) => {
        setAnchorEl((prev) => (prev ? null : event.currentTarget));
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Stack
            direction="row"
            spacing={2}
            sx={{ mb: 3, px: 1, alignItems: "center", ...sx }}
        >
            <Avatar src={user.avatar} sx={{ width: 40, height: 40 }} />
            <Box sx={{ overflow: "hidden", minWidth: 0, flexGrow: 1 }}>
                <Typography
                    variant="subtitle2"
                    sx={{
                        fontWeight: 600,
                        color: theme.palette.common.white,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
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

            {hasTemporaryRole && (
                <Box
                    aria-label="Thông báo vai trò tạm thời"
                    onClick={handleToggle}
                    sx={{
                        display: "inline-flex",
                        flexShrink: 0,
                        cursor: "pointer",
                        color: theme.palette.common.white,
                        "&:hover": {
                            color: theme.palette.warning.light,
                        },
                    }}
                >
                    <Badge
                        variant="dot"
                        color="warning"
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "center",
                        }}
                        overlap="circular"
                    >
                        <NotificationsActiveIcon fontSize="medium" />
                    </Badge>
                </Box>
            )}

            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
            >
                <Box sx={{ p: 2, maxWidth: 280 }}>
                    <Typography variant="body2">
                        Bạn đang có vai trò{" "}
                        {assignment?.ten_vai_tro?.toUpperCase()} trong đợt
                        khám hiện tại
                    </Typography>
                </Box>
            </Popover>
        </Stack>
    );
}

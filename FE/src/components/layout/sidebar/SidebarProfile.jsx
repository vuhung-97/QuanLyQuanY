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

    if (!user) return null;

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
            spacing={open ? 2 : 0}
            sx={{
                mb: 3,
                px: 2.5,
                alignItems: "center",
                ...sx,
            }}
        >
            <Avatar
                alt={user.name}
                sx={{
                    width: 40,
                    height: 40,
                    bgcolor: "secondary.main",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: 18,
                }}
            >
                {user.name?.trim().charAt(0).toUpperCase() || "?"}
            </Avatar>
            <Box
                sx={{
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    minWidth: 0,
                    flexGrow: 1,
                    opacity: open ? 1 : 0,
                    maxWidth: open ? 220 : 0,
                    transition: (t) =>
                        t.transitions.create(["opacity", "max-width"], {
                            easing: t.transitions.easing.easeInOut,
                            duration: open ? 300 : 280,
                        }),
                }}
            >
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
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
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
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        overflow: "hidden",
                        cursor: "pointer",
                        color: theme.palette.common.white,
                        opacity: open ? 1 : 0,
                        width: 44,
                        maxWidth: open ? 44 : 0,
                        transition: (t) =>
                            t.transitions.create(["opacity", "max-width"], {
                                easing: t.transitions.easing.easeInOut,
                                duration: open ? 300 : 280,
                            }),
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

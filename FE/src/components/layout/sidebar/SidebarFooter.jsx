import {
    Box,
    Divider,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
    SettingsOutlined as SettingsIcon,
    Logout as LogoutIcon,
} from "@mui/icons-material";
import { FONT_SIZE_SM } from "@/components/layout/common/constants.js";

function ActionItem({ icon, label, open, onClick }) {
    const theme = useTheme();
    return (
        <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
                onClick={onClick}
                sx={{
                    borderRadius: 2,
                    color: alpha(theme.palette.common.white, 0.7),
                    "&:hover": {
                        color: theme.palette.common.white,
                        bgcolor: alpha(theme.palette.common.white, 0.08),
                    },
                }}
            >
                <ListItemIcon
                    sx={{
                        minWidth: 0,
                        mr: open ? 2 : 0,
                        color: "inherit",
                        justifyContent: "center",
                    }}
                >
                    {icon}
                </ListItemIcon>
                {open && (
                    <ListItemText
                        primary={label}
                        slotProps={{ primaryTypography: { fontSize: FONT_SIZE_SM } }}
                    />
                )}
            </ListItemButton>
        </ListItem>
    );
}

export default function SidebarFooter({
    open = true,
    onSettings,
    onLogout,
    settingsLabel = "Cài đặt",
    logoutLabel = "Đăng xuất",
    showDivider = true,
    extraItems = [],
}) {
    const theme = useTheme();
    return (
        <Box sx={{ px: 2, pb: 3 }}>
            {showDivider && (
                <Divider sx={{ borderColor: alpha(theme.palette.common.white, 0.1), mb: 2 }} />
            )}

            <List disablePadding>
                {extraItems.map((it) => (
                    <ActionItem
                        key={it.id || it.title}
                        icon={it.icon}
                        label={it.title}
                        open={open}
                        onClick={() => it.onClick?.(it)}
                    />
                ))}

                {onSettings && (
                    <ActionItem
                        icon={<SettingsIcon fontSize="small" />}
                        label={settingsLabel}
                        open={open}
                        onClick={onSettings}
                    />
                )}

                {onLogout && (
                    <ActionItem
                        icon={<LogoutIcon fontSize="small" />}
                        label={logoutLabel}
                        open={open}
                        onClick={onLogout}
                    />
                )}
            </List>
        </Box>
    );
}

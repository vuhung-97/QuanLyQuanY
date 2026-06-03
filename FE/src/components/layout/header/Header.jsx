import { useState } from "react";
import {
    AppBar,
    Toolbar,
    Box,
    Typography,
    IconButton,
    Avatar,
    Badge,
    Stack,
    Menu,
    MenuItem,
    Divider,
} from "@mui/material";
import {
    Menu as MenuIcon,
    NotificationsNone as NotificationsIcon,
    Search as SearchIcon,
    SettingsOutlined as SettingsIcon,
    Logout as LogoutIcon,
    MedicalInformation as MedicalInformationIcon,
} from "@mui/icons-material";
import {
    APP_NAME,
    DRAWER_WIDTH,
    COLLAPSED_DRAWER_WIDTH,
    HEADER_HEIGHT,
    DEFAULT_USER,
} from "../common/constants.js";
import { Search, SearchIconWrapper, StyledInputBase } from "./Header.styles.js";

export default function Header({
    open = true,
    sidebarCollapsible = true,
    onToggleSidebar,
    appName = APP_NAME,
    logoIcon = <MedicalInformationIcon sx={{ color: "#FFFFFF", fontSize: 32 }} />,
    user = DEFAULT_USER,
    notificationsCount = 0,
    onNotificationsClick,
    showSearch = true,
    searchPlaceholder = "Tìm kiếm quân nhân, thuốc...",
    onSearch,
    onSettings,
    onLogout,
    showMenuButton = false,
}) {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleSettings = () => {
        handleMenuClose();
        if (onSettings) onSettings();
    };

    const handleLogout = () => {
        handleMenuClose();
        if (onLogout) onLogout();
    };

    const logoWidth = open ? DRAWER_WIDTH : COLLAPSED_DRAWER_WIDTH;

    return (
        <AppBar
            position="fixed"
            elevation={0}
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                bgcolor: "primary.main",
                color: "#FFFFFF",
                borderBottom: "none",
            }}
        >
            <Toolbar sx={{ pl: "0 !important" }}>
                {showMenuButton && (
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={onToggleSidebar}
                        sx={{ mr: 1, ml: 1 }}
                    >
                        <MenuIcon />
                    </IconButton>
                )}

                <Box
                    onClick={onToggleSidebar}
                    sx={{
                        width: sidebarCollapsible ? logoWidth : DRAWER_WIDTH,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "secondary.main",
                        height: HEADER_HEIGHT,
                        cursor: sidebarCollapsible ? "pointer" : "default",
                        transition: (theme) =>
                            theme.transitions.create("width", {
                                easing: theme.transitions.easing.sharp,
                                duration: open
                                    ? theme.transitions.duration.enteringScreen
                                    : theme.transitions.duration.leavingScreen,
                            }),
                    }}
                >
                    {logoIcon}
                </Box>

                <Typography
                    variant="h6"
                    noWrap
                    sx={{
                        ml: 3,
                        flexGrow: 1,
                        fontWeight: 600,
                        fontSize: "1.2rem",
                        display: { xs: "none", sm: "block" },
                    }}
                >
                    {appName}
                </Typography>

                {showSearch && (
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon fontSize="small" />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder={searchPlaceholder}
                            inputProps={{ "aria-label": "search" }}
                            onChange={(e) => onSearch?.(e.target.value)}
                        />
                    </Search>
                )}
                {!showSearch && <Box sx={{ flexGrow: 1 }} />}

                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mr: 2 }}>
                    <IconButton
                        color="inherit"
                        size="large"
                        onClick={onNotificationsClick}
                    >
                        <Badge badgeContent={notificationsCount} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>

                    <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                        <Avatar
                            alt={user?.name}
                            src={user?.avatar}
                            sx={{
                                width: 36,
                                height: 36,
                                border: "2px solid rgba(255,255,255,0.2)",
                            }}
                        />
                    </IconButton>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        transformOrigin={{ vertical: "top", horizontal: "right" }}
                        slotProps={{
                            paper: { sx: { mt: 1, minWidth: 200, borderRadius: 2 } },
                        }}
                    >
                        {user?.name && (
                            <Box sx={{ px: 2, py: 1 }}>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    {user.name}
                                </Typography>
                                {user?.role && (
                                    <Typography variant="caption" color="text.secondary">
                                        {user.role}
                                    </Typography>
                                )}
                            </Box>
                        )}
                        {user?.name && <Divider />}
                        <MenuItem onClick={handleSettings}>
                            <SettingsIcon fontSize="small" sx={{ mr: 1.5 }} />
                            Cài đặt
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>
                            <LogoutIcon fontSize="small" sx={{ mr: 1.5 }} />
                            Đăng xuất
                        </MenuItem>
                    </Menu>
                </Stack>
            </Toolbar>
        </AppBar>
    );
}

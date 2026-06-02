import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Avatar,
    Badge,
    InputBase,
    Stack,
    Menu,
    MenuItem,
} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import {
    Menu as MenuIcon,
    ChevronLeft as ChevronLeftIcon,
    Dashboard as DashboardIcon,
    HealthAndSafety as HealthAndSafetyIcon,
    Person as PersonIcon,
    Bed as BedIcon,
    MedicalServices as MedicalServicesIcon,
    Inventory2 as InventoryIcon,
    Assessment as AssessmentIcon,
    NotificationsNone as NotificationsIcon,
    Search as SearchIcon,
    SettingsOutlined as SettingsIcon,
    Logout as LogoutIcon,
    MedicalInformation as MedicalInformationIcon,
} from "@mui/icons-material";

const drawerWidth = 260;
const collapsedDrawerWidth = 80;

const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius * 2,
    backgroundColor: alpha(theme.palette.common.white, 0.1),
    "&:hover": {
        backgroundColor: alpha(theme.palette.common.white, 0.15),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(3),
        width: "auto",
    },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: alpha(theme.palette.common.white, 0.6),
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
        padding: theme.spacing(1.25, 1, 1.25, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create("width"),
        width: "100%",
        fontSize: "0.9rem",
        [theme.breakpoints.up("md")]: {
            width: "30ch",
        },
        "&::placeholder": {
            color: alpha(theme.palette.common.white, 0.5),
            opacity: 1,
        },
    },
}));

export default function MainLayout() {
    const [open, setOpen] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleLogout = () => {
        localStorage.removeItem("datamed_access_token");
        navigate("/login");
    };

    const menuItems = [
        { title: "Tổng quan", path: "/", icon: <DashboardIcon /> },
        { title: "Khám sức khỏe định kỳ", path: "/kham-dinh-ky", icon: <HealthAndSafetyIcon /> },
        { title: "Hồ sơ quân nhân", path: "/ho-so", icon: <PersonIcon /> },
        { title: "Quản lý nội trú", path: "/noi-tru", icon: <BedIcon /> },
        { title: "Khám bệnh", path: "/kham-benh", icon: <MedicalServicesIcon /> },
        { title: "Kho dược", path: "/kho-duoc", icon: <InventoryIcon /> },
        { title: "Báo cáo", path: "/bao-cao", icon: <AssessmentIcon /> },
    ];

    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            {/* Header / AppBar */}
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    bgcolor: "#0B3B60", // Dark Navy
                    color: "#FFFFFF",
                    borderBottom: "none",
                }}
            >
                <Toolbar sx={{ pl: "0 !important" }}>
                    {/* Logo Area matches sidebar width */}
                    <Box
                        sx={{
                            width: open ? drawerWidth : collapsedDrawerWidth,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "#00B4D8", // Teal
                            height: 64, // Toolbar height
                            transition: (theme) =>
                                theme.transitions.create("width", {
                                    easing: theme.transitions.easing.sharp,
                                    duration: open
                                        ? theme.transitions.duration.enteringScreen
                                        : theme.transitions.duration.leavingScreen,
                                }),
                        }}
                    >
                        <MedicalInformationIcon sx={{ color: "#FFFFFF", fontSize: 32 }} />
                    </Box>

                    {/* App Title */}
                    <Typography
                        variant="h6"
                        noWrap
                        sx={{ ml: 3, flexGrow: 1, fontWeight: 600, fontSize: "1.2rem", display: { xs: "none", sm: "block" } }}
                    >
                        Quản lý Quân y Lữ đoàn Hải quân
                    </Typography>

                    {/* Search Bar */}
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon fontSize="small" />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Tìm kiếm quân nhân, thuốc..."
                            inputProps={{ "aria-label": "search" }}
                        />
                    </Search>

                    {/* Right Toolbar Actions */}
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mr: 2 }}>
                        <IconButton color="inherit" size="large">
                            <NotificationsIcon />
                        </IconButton>
                        <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                            <Avatar
                                alt="Nguyễn Văn An"
                                src="https://i.pravatar.cc/150?img=11"
                                sx={{ width: 36, height: 36, border: "2px solid rgba(255,255,255,0.2)" }}
                            />
                        </IconButton>
                    </Stack>
                </Toolbar>
            </AppBar>

            {/* Sidebar / Drawer */}
            <Drawer
                variant="permanent"
                open={open}
                sx={{
                    width: open ? drawerWidth : collapsedDrawerWidth,
                    flexShrink: 0,
                    whiteSpace: "nowrap",
                    boxSizing: "border-box",
                    "& .MuiDrawer-paper": {
                        width: open ? drawerWidth : collapsedDrawerWidth,
                        overflowX: "hidden",
                        bgcolor: "#0B3B60",
                        color: "#FFFFFF",
                        borderRight: "none",
                        mt: "64px", // Push down below appbar
                        height: "calc(100% - 64px)",
                        display: "flex",
                        flexDirection: "column",
                        transition: (theme) =>
                            theme.transitions.create("width", {
                                easing: theme.transitions.easing.sharp,
                                duration: open
                                    ? theme.transitions.duration.enteringScreen
                                    : theme.transitions.duration.leavingScreen,
                            }),
                    },
                }}
            >
                <List sx={{ px: 2, pt: 3, flexGrow: 1 }}>
                    {menuItems.map((item) => {
                        const active = location.pathname === item.path;
                        return (
                            <ListItem key={item.title} disablePadding sx={{ display: "block", mb: 1 }}>
                                <ListItemButton
                                    onClick={() => navigate(item.path)}
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: open ? "initial" : "center",
                                        px: 2,
                                        borderRadius: 2.5,
                                        bgcolor: active ? "#00B4D8" : "transparent",
                                        color: active ? "#FFFFFF" : "rgba(255,255,255,0.7)",
                                        "&:hover": {
                                            bgcolor: active ? "#00B4D8" : "rgba(255, 255, 255, 0.08)",
                                            color: "#FFFFFF",
                                            "& .MuiListItemIcon-root": {
                                                color: "#FFFFFF",
                                            },
                                        },
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 2 : 0,
                                            justifyContent: "center",
                                            color: active ? "#FFFFFF" : "rgba(255,255,255,0.7)",
                                        }}
                                    >
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.title}
                                        sx={{
                                            opacity: open ? 1 : 0,
                                            "& .MuiTypography-root": {
                                                fontWeight: active ? 600 : 400,
                                                fontSize: "0.95rem",
                                            },
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>

                {/* Bottom Sidebar Profile & Actions */}
                <Box sx={{ px: 2, pb: 3 }}>
                    <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", mb: 2 }} />
                    
                    {open && (
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3, px: 1 }}>
                            <Avatar src="https://i.pravatar.cc/150?img=11" sx={{ width: 40, height: 40 }} />
                            <Box sx={{ overflow: "hidden" }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#FFFFFF", whiteSpace: "nowrap" }}>
                                    Nguyễn Văn An
                                </Typography>
                                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)", display: "block", whiteSpace: "normal", lineHeight: 1.2 }}>
                                    Chủ nhiệm Quân y - Lữ đoàn Hải quân
                                </Typography>
                            </Box>
                        </Stack>
                    )}

                    <List disablePadding>
                        <ListItem disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton sx={{ borderRadius: 2, color: "rgba(255,255,255,0.7)", "&:hover": { color: "#FFFFFF", bgcolor: "rgba(255,255,255,0.08)" } }}>
                                <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : 0, color: "inherit", justifyContent: "center" }}>
                                    <SettingsIcon fontSize="small" />
                                </ListItemIcon>
                                {open && <ListItemText primary="Cài đặt" primaryTypographyProps={{ fontSize: "0.9rem" }} />}
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2, color: "rgba(255,255,255,0.7)", "&:hover": { color: "#FFFFFF", bgcolor: "rgba(255,255,255,0.08)" } }}>
                                <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : 0, color: "inherit", justifyContent: "center" }}>
                                    <LogoutIcon fontSize="small" />
                                </ListItemIcon>
                                {open && <ListItemText primary="Đăng xuất" primaryTypographyProps={{ fontSize: "0.9rem" }} />}
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Box>
            </Drawer>

            {/* Main Content Area */}
            <Box component="main" sx={{ flexGrow: 1, p: 4, pt: 12, bgcolor: "#F4F7F9", minHeight: "100vh" }}>
                <Outlet />
            </Box>
        </Box>
    );
}

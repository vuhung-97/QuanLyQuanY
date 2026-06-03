import { Outlet, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import Header from "./header/Header.jsx";
import Sidebar from "./sidebar/Sidebar.jsx";
import Footer from "./footer/Footer.jsx";
import { useSidebarState } from "./common/hooks.js";
import { defaultMenuItems } from "./common/menuConfig.jsx";
import {
    DEFAULT_USER,
    STORAGE_KEYS,
    APP_NAME,
} from "./common/constants.js";

export default function MainLayout({
    menuItems = defaultMenuItems,
    user = DEFAULT_USER,
    appName = APP_NAME,
    showFooter = true,
    sidebarCollapsible = true,
    initialSidebarOpen = true,
    onSettings,
    onLogout,
    notificationsCount = 0,
    showSearch = true,
    searchPlaceholder,
    onSearch,
    onNotificationsClick,
    sidebarSx,
    contentSx,
    footerProps,
}) {
    const { open, toggle } = useSidebarState(initialSidebarOpen);
    const navigate = useNavigate();

    const handleLogout = () => {
        if (onLogout) {
            onLogout();
            return;
        }
        try {
            localStorage.removeItem(STORAGE_KEYS.token);
        } catch {
        }
        navigate("/login");
    };

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", flexDirection: "column" }}>
            <Box sx={{ display: "flex", flex: 1 }}>
                <Header
                    open={open}
                    sidebarCollapsible={sidebarCollapsible}
                    onToggleSidebar={sidebarCollapsible ? toggle : undefined}
                    appName={appName}
                    user={user}
                    notificationsCount={notificationsCount}
                    onNotificationsClick={onNotificationsClick}
                    showSearch={showSearch}
                    searchPlaceholder={searchPlaceholder}
                    onSearch={onSearch}
                    onLogout={handleLogout}
                    onSettings={onSettings}
                />

                <Sidebar
                    open={open}
                    menuItems={menuItems}
                    user={user}
                    onLogout={handleLogout}
                    onSettings={onSettings}
                    sx={sidebarSx}
                />

                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: 4,
                        pt: 12,
                        bgcolor: "background.default",
                        minHeight: "100vh",
                        display: "flex",
                        flexDirection: "column",
                        ...contentSx,
                    }}
                >
                    <Box sx={{ flexGrow: 1 }}>
                        <Outlet />
                    </Box>
                    {showFooter && <Footer {...footerProps} />}
                </Box>
            </Box>
        </Box>
    );
}

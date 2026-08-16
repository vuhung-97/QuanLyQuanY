import { useMemo, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import Header from "./header/Header.jsx";
import Sidebar from "./sidebar/Sidebar.jsx";
import Footer from "./footer/Footer.jsx";
import { useSidebarState } from "./common/hooks.js";
import AccountSettingsDialog from "./accountSetting/AccountSettingsDialog.jsx";
import { getCurrentUser } from "@/services/api.js";
import { defaultMenuItems, adminMenuItems, filterMenuByRole } from "./common/menuConfig.jsx";
import {
    DEFAULT_USER,
    STORAGE_KEYS,
    APP_NAME,
    ROLE_NAME_MAP,
} from "./common/constants.js";
import { ROLES, MENU_ROLE_MAP } from "@/constants/roleConstants.js";

export default function MainLayout({
    menuItems = defaultMenuItems,
    adminItems = adminMenuItems,
    user: propUser,
    appName = APP_NAME,
    showFooter = true,
    sidebarCollapsible = true,
    initialSidebarOpen = true,
    onSettings,
    onLogout,
    showSearch = true,
    searchPlaceholder,
    onSearch,
    sidebarSx,
    contentSx,
    footerProps,
}) {
    const { open, toggle } = useSidebarState(initialSidebarOpen);
    const navigate = useNavigate();
    const [openAccountSettings, setOpenAccountSettings] = useState(false);

    const handleSettings = onSettings || (() => setOpenAccountSettings(true));

    const jwtPayload = useMemo(() => getCurrentUser(), []);

    const role = jwtPayload?.role || ROLES.QN;

    const filteredMenuItems = useMemo(() => {
        const items = MENU_ROLE_MAP["quan-tri"].includes(role) ? adminItems : menuItems;
        return filterMenuByRole(items, role);
    }, [role]);

    const user = useMemo(() => {
        if (propUser) return propUser;
        return {
            name: jwtPayload?.ho_ten || jwtPayload?.sub || DEFAULT_USER.name,
            role: jwtPayload?.role
                ? ROLE_NAME_MAP[jwtPayload.role] || jwtPayload.role
                : DEFAULT_USER.role,
            avatar: DEFAULT_USER.avatar,
        };
    }, [propUser, jwtPayload]);

    const handleLogout = () => {
        if (onLogout) {
            onLogout();
            return;
        }
        try {
            localStorage.removeItem(STORAGE_KEYS.token);
        } catch {}
        navigate("/login");
    };

    return (
        <Box
            sx={{
                display: "flex",
                minHeight: "100vh",
                flexDirection: "column",
            }}
        >
            <Box sx={{ display: "flex", flex: 1 }}>
                <Header
                    open={open}
                    sidebarCollapsible={sidebarCollapsible}
                    onToggleSidebar={sidebarCollapsible ? toggle : undefined}
                    appName={appName}
                    user={user}
                    showSearch={showSearch}
                    searchPlaceholder={searchPlaceholder}
                    onSearch={onSearch}
                    onLogout={handleLogout}
                    onSettings={handleSettings}
                />

                <Sidebar
                    open={open}
                    menuItems={filteredMenuItems}
                    user={user}
                    onLogout={handleLogout}
                    onSettings={handleSettings}
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

            <AccountSettingsDialog
                open={openAccountSettings}
                onClose={() => setOpenAccountSettings(false)}
            />
        </Box>
    );
}

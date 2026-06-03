import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Drawer, List, useTheme } from "@mui/material";
import {
    DRAWER_WIDTH,
    COLLAPSED_DRAWER_WIDTH,
    HEADER_HEIGHT,
} from "../common/constants.js";
import SidebarItem from "./SidebarItem.jsx";
import SidebarProfile from "./SidebarProfile.jsx";
import SidebarFooter from "./SidebarFooter.jsx";

export default function Sidebar({
    open = true,
    menuItems = [],
    user,
    onSettings,
    onLogout,
    width = DRAWER_WIDTH,
    collapsedWidth = COLLAPSED_DRAWER_WIDTH,
    headerHeight = HEADER_HEIGHT,
    matchExact = false,
    sx,
}) {
    const location = useLocation();
    const navigate = useNavigate();
    const theme = useTheme();

    const isActive = (path) => {
        if (matchExact) return location.pathname === path;
        if (path === "/") return location.pathname === "/";
        return location.pathname === path || location.pathname.startsWith(path + "/");
    };

    const paperSx = useMemo(
        () => ({
            width: open ? width : collapsedWidth,
            overflowX: "hidden",
            bgcolor: theme.palette.primary.main,
            color: "#FFFFFF",
            borderRight: "none",
            mt: `${headerHeight}px`,
            height: `calc(100% - ${headerHeight}px)`,
            display: "flex",
            flexDirection: "column",
            transition: (t) =>
                t.transitions.create("width", {
                    easing: t.transitions.easing.sharp,
                    duration: open
                        ? t.transitions.duration.enteringScreen
                        : t.transitions.duration.leavingScreen,
                }),
        }),
        [open, width, collapsedWidth, headerHeight, theme.palette.primary.main],
    );

    return (
        <Drawer
            variant="permanent"
            open={open}
            sx={{
                width: open ? width : collapsedWidth,
                flexShrink: 0,
                whiteSpace: "nowrap",
                boxSizing: "border-box",
                "& .MuiDrawer-paper": paperSx,
                ...sx,
            }}
        >
            <List sx={{ px: 2, pt: 3, flexGrow: 1 }}>
                {menuItems.map((item) => (
                    <SidebarItem
                        key={item.id || item.path || item.title}
                        item={item}
                        open={open}
                        active={isActive(item.path)}
                        onClick={() => navigate(item.path)}
                    />
                ))}
            </List>

            <SidebarProfile user={user} open={open} />
            <SidebarFooter
                open={open}
                onSettings={onSettings}
                onLogout={onLogout}
            />
        </Drawer>
    );
}

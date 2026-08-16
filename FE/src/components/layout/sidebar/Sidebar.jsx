import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Collapse, Drawer, List, useTheme } from "@mui/material";
import {
    DRAWER_WIDTH,
    COLLAPSED_DRAWER_WIDTH,
    HEADER_HEIGHT,
} from "@/components/layout/common/constants.js";
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

    const hasActiveChild = (item) => item.children?.some((child) => isActive(child.path));

    const handleItemClick = (item) => {
        navigate(item.children?.[0]?.path || item.path);
    };

    const paperSx = useMemo(
        () => ({
            width: open ? width : collapsedWidth,
            overflowX: "hidden",
            bgcolor: theme.palette.primary.main,
            color: theme.palette.common.white,
            borderRight: "none",
            mt: `${headerHeight}px`,
            height: `calc(100% - ${headerHeight}px)`,
            display: "flex",
            flexDirection: "column",
            transition: (t) =>
                t.transitions.create("width", {
                    easing: t.transitions.easing.easeInOut,
                    duration: open ? 300 : 280,
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
                {menuItems.map((item) => {
                    const childActive = hasActiveChild(item);
                    const parentActive = isActive(item.path) || childActive;
                    const expanded = open && parentActive && item.children?.length > 0;

                    return (
                        <div key={item.id || item.path || item.title}>
                            <SidebarItem
                                item={item}
                                open={open}
                                active={parentActive}
                                expanded={expanded}
                                hasChildren={item.children?.length > 0}
                                onClick={() => handleItemClick(item)}
                            />

                            {item.children?.length > 0 && (
                                <Collapse in={expanded} timeout={250}>
                                    {item.children.map((child) => (
                                        <SidebarItem
                                            key={child.id || child.path || child.title}
                                            item={child}
                                            open={open}
                                            depth={1}
                                            active={isActive(child.path)}
                                            onClick={() => navigate(child.path)}
                                        />
                                    ))}
                                </Collapse>
                            )}
                        </div>
                    );
                })}
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

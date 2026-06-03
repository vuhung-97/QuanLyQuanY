import { FONT_SIZE_MD, FONT_SIZE_SM } from "../common/constants.js";
import { useTheme } from "@mui/material";
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

export default function SidebarItem({
    item,
    open = true,
    active = false,
    depth = 0,
    expanded = false,
    hasChildren = false,
    onClick,
    sx,
}) {
    if (!item) return null;
    const theme = useTheme();
    const activeBg = theme.palette.secondary.main;

    const handleClick = (event) => {
        if (onClick) onClick(item, event);
    };

    return (
        <ListItem disablePadding sx={{ display: "block", mb: 1, ...sx?.listItem }}>
            <ListItemButton
                onClick={handleClick}
                sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2,
                    pl: open ? 2 + depth * 2 : 2,
                    borderRadius: 2.5,
                    bgcolor: active ? activeBg : "transparent",
                    color: active ? "#FFFFFF" : "rgba(255,255,255,0.7)",
                    "&:hover": {
                        bgcolor: active ? activeBg : "rgba(255, 255, 255, 0.08)",
                        color: "#FFFFFF",
                        "& .MuiListItemIcon-root": {
                            color: "#FFFFFF",
                        },
                    },
                    ...sx?.button,
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
                            fontSize: depth > 0 ? FONT_SIZE_SM : FONT_SIZE_MD,
                        },
                    }}
                />
                {open && hasChildren && (expanded ? <ExpandLess /> : <ExpandMore />)}
            </ListItemButton>
        </ListItem>
    );
}

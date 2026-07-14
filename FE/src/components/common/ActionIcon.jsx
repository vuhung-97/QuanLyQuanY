import { IconButton, Tooltip } from "@mui/material";
import { cloneElement } from "react";

export default function ActionIcon({ title, icon, color = "primary", size = "small", onClick, ...rest }) {
    return (
        <Tooltip title={title}>
            <IconButton size={size} color={color} onClick={onClick} {...rest}>
                {cloneElement(icon, { fontSize: icon.props?.fontSize || size })}
            </IconButton>
        </Tooltip>
    );
}

import { Typography } from "@mui/material";

export default function SectionHeading({ children, sx, ...props }) {
    return (
        <Typography
            variant="h4"
            sx={{ mb: 1, fontWeight: 600, color: "text.primary", ...sx }}
            {...props}
        >
            {children}
        </Typography>
    );
}

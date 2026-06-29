import { Typography } from "@mui/material";

export default function SectionTitle({ children }) {
    return (
        <Typography
            variant="subtitle1"
            fontWeight="bold"
            color="primary"
            sx={{ mb: 2 }}
        >
            {children}
        </Typography>
    );
}

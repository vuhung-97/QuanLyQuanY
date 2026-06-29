import { Box } from "@mui/material";

export default function InfoItem({ label, value }) {
    return (
        <Box>
            <Box variant="caption" sx={{ fontSize: 12, color: "text.secondary" }}>
                {label}
            </Box>
            <Box variant="body1" sx={{ fontWeight: 500 }}>
                {value ?? "--"}
            </Box>
        </Box>
    );
}

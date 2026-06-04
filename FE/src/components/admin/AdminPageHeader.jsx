import { Box, Button, Stack, Typography } from "@mui/material";

export default function AdminPageHeader({ title, description, action }) {
    if (!action) {
        return (
            <Box>
                <Typography variant="h1">{title}</Typography>
                {description && (
                    <Typography color="text.secondary" sx={{ mt: 0.75 }}>
                        {description}
                    </Typography>
                )}
            </Box>
        );
    }

    return (
        <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            sx={{ justifyContent: "space-between" }}
        >
            <Box>
                <Typography variant="h1">{title}</Typography>
                {description && (
                    <Typography color="text.secondary" sx={{ mt: 0.75 }}>
                        {description}
                    </Typography>
                )}
            </Box>
            {action}
        </Stack>
    );
}

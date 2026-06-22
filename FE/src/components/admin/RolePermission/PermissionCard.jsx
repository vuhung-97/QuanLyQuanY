import {
    Box,
    Card,
    CardContent,
    Checkbox,
    Stack,
    Typography,
} from "@mui/material";

export default function PermissionCard({ permission, checked, onToggle }) {
    return (
        <Card
            variant="outlined"
            sx={{
                borderRadius: 2,
                borderColor: checked ? "secondary.main" : "divider",
            }}
        >
            <CardContent sx={{ p: "14px !important" }}>
                <Stack
                    direction="row"
                    spacing={1.25}
                    sx={{ alignItems: "flex-start" }}
                >
                    <Checkbox
                        checked={checked}
                        onChange={() => onToggle(permission.id)}
                    />
                    <Box>
                        <Typography fontWeight={700}>
                            {permission.ten_quyen || permission.id}
                        </Typography>
                        <Typography variant="caption" sx={{ display: "block" }}>
                            {permission.id}
                        </Typography>
                        {permission.mo_ta && (
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mt: 0.5 }}
                            >
                                {permission.mo_ta}
                            </Typography>
                        )}
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
}

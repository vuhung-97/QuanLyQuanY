import { Box, Typography, CircularProgress, Alert } from "@mui/material";

export default function LoadingAlert({ loading, error, empty, emptyMessage }) {
    if (loading)
        return (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
            </Box>
        );
    if (error) return <Alert severity="error">{error}</Alert>;
    if (empty)
        return (
            <Alert severity="info">
                {emptyMessage || "Không có dữ liệu."}
            </Alert>
        );
    return null;
}

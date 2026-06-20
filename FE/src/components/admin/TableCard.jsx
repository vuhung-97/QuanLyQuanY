import { Card, CardContent, LinearProgress } from "@mui/material";

export default function TableCard({ loading, children, sx }) {
    return (
        <Card sx={{ borderRadius: 3, ...sx }}>
            {loading && <LinearProgress />}
            <CardContent>{children}</CardContent>
        </Card>
    );
}

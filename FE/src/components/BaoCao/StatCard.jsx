import { Card, CardContent, Typography } from "@mui/material";

export default function StatCard({ label, value }) {
    return (
        <Card sx={{ borderRadius: 3, boxShadow: "0px 4px 12px rgba(0,0,0,0.03)" }}>
            <CardContent sx={{ p: "16px !important", textAlign: "center" }}>
                <Typography variant="h4" fontWeight={700} sx={{ color: "#0B3B60" }}>
                    {value}
                </Typography>
                <Typography color="text.secondary" variant="body2" fontWeight={500}>
                    {label}
                </Typography>
            </CardContent>
        </Card>
    );
}

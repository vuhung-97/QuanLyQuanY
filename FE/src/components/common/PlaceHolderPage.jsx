import { Card, CardContent, Stack, Typography } from "@mui/material";
import { Construction as ConstructionIcon } from "@mui/icons-material";

export default function PlaceHolderPage({ title, description, icon: Icon }) {
    const IconComponent = Icon || ConstructionIcon;

    return (
        <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: "28px !important" }}>
                <Stack spacing={1.5} sx={{ alignItems: "center", textAlign: "center" }}>
                    <IconComponent sx={{ fontSize: 48, color: "secondary.main" }} />
                    <Typography variant="h1">{title}</Typography>
                    <Typography color="text.secondary">
                        {description || "Chức năng này sẽ được triển khai ở bước tiếp theo."}
                    </Typography>
                </Stack>
            </CardContent>
        </Card>
    );
}

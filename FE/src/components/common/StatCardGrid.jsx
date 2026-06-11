import { Box, Card, CardContent, Grid, Stack, Typography } from "@mui/material";

export default function StatCardGrid({ items, loading, sizeOverrides }) {
    if (loading) return null;
    return (
        <Grid container spacing={2.5}>
            {items.map((item) => (
                <Grid
                    size={{
                        xs: 12,
                        sm: 6,
                        md: sizeOverrides?.[item.label]?.md ?? 3,
                    }}
                    key={item.label}
                >
                    <Card sx={{ height: "100%", borderRadius: 3 }}>
                        <CardContent>
                            <Stack
                                direction="row"
                                spacing={2}
                                sx={{ alignItems: "center" }}
                            >
                                <Box
                                    sx={{
                                        width: 46,
                                        height: 46,
                                        display: "grid",
                                        placeItems: "center",
                                        borderRadius: 2.5,
                                        color: item.color,
                                        bgcolor: item.bg,
                                    }}
                                >
                                    {item.icon}
                                </Box>
                                <Box>
                                    <Typography
                                        variant="h3"
                                        sx={{ color: "text.primary" }}
                                    >
                                        {item.value}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {item.label}
                                    </Typography>
                                </Box>
                            </Stack>
                            {item.note && (
                                <Typography
                                    variant="caption"
                                    sx={{ mt: 2, display: "block" }}
                                >
                                    {item.note}
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}

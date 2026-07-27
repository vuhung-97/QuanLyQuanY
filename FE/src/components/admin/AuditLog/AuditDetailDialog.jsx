import { Box, Dialog, DialogContent, Stack, Typography } from "@mui/material";
import DialogTitleWrapper from "@/components/common/DialogTitleWrapper.jsx";
function asJson(value) {
    if (!value) return "--";
    if (typeof value === "string") return value;
    return JSON.stringify(value, null, 2);
}

export default function AuditDetailDialog({ detail, onClose }) {
    return (
        <Dialog open={!!detail} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitleWrapper>Chi tiết thao tác</DialogTitleWrapper>
            <DialogContent dividers>
                <Stack spacing={2}>
                    <Box>
                        <Typography fontWeight={700}>Dữ liệu cũ</Typography>
                        <Box
                            component="pre"
                            sx={{
                                p: 2,
                                bgcolor: "background.default",
                                borderRadius: 2,
                                overflow: "auto",
                            }}
                        >
                            {asJson(detail?.du_lieu_cu)}
                        </Box>
                    </Box>
                    <Box>
                        <Typography fontWeight={700}>Dữ liệu mới</Typography>
                        <Box
                            component="pre"
                            sx={{
                                p: 2,
                                bgcolor: "background.default",
                                borderRadius: 2,
                                overflow: "auto",
                            }}
                        >
                            {asJson(detail?.du_lieu_moi)}
                        </Box>
                    </Box>
                </Stack>
            </DialogContent>
        </Dialog>
    );
}

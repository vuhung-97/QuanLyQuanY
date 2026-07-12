import { Box, Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import { Print as PrintIcon } from "@mui/icons-material";
import DialogTitleWrapper from "@/components/common/DialogTitleWrapper.jsx";
import { PRINT_STYLES, PRINT_DIALOG_CONTENT_SX, triggerPrint } from "@/utils/printUtils.js";

export default function PrintDialog({ open, onClose, title, children, maxWidth = "md", screenClass }) {
    return (
        <>
            {screenClass && (
                <style>{`@media screen { .${screenClass} { display: block !important; } }`}</style>
            )}
            <style>{PRINT_STYLES}</style>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth={maxWidth}>
                <DialogTitleWrapper sx={{ "@media print": { display: "none" } }}>
                    {title}
                </DialogTitleWrapper>
                <DialogContent
                    sx={{
                        height: 500,
                        overflow: "auto",
                        ...PRINT_DIALOG_CONTENT_SX,
                    }}
                >
                    <Box sx={{ "@media print": { display: "contents !important" } }}>
                        {children}
                    </Box>
                </DialogContent>
                <Box sx={{ "@media print": { display: "none" } }}>
                    <DialogActions sx={{ p: 2 }}>
                        <Button onClick={onClose}>Đóng</Button>
                        <Button
                            variant="contained"
                            startIcon={<PrintIcon />}
                            onClick={triggerPrint}
                        >
                            In
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </>
    );
}

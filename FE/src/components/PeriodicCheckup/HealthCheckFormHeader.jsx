import { DialogTitle, Typography } from "@mui/material";

export default function HealthCheckFormHeader({ quanNhan }) {
    return (
        <DialogTitle
            component="div"
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
            }}
        >
            <Typography
                fontWeight="bold"
                color="#0B3B60"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
                Phiếu khám sức khỏe định kỳ (MB02)
            </Typography>
            <Typography
                variant="body2"
                color="text.secondary"
                fontWeight="600"
            >
                {quanNhan?.ho_ten} ({quanNhan?.ma_quan_nhan})
            </Typography>
        </DialogTitle>
    );
}

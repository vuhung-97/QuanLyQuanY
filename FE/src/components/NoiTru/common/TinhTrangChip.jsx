import { Box } from "@mui/material";
import { BENH_AN_STATUS_MAP, STATUS_COLORS } from "@/constants/noiTruConstants.js";

export default function TinhTrangChip({ trangThai }) {
    const status = BENH_AN_STATUS_MAP[trangThai];
    const colorKey = status?.color || "info";
    const colors = STATUS_COLORS[colorKey] || STATUS_COLORS.info;
    return (
        <Box
            sx={{
                display: "inline-block",
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                bgcolor: colors.bg,
                color: colors.text,
                fontWeight: 600,
                fontSize: "0.8125rem",
            }}
        >
            {status?.label || trangThai}
        </Box>
    );
}

import { memo } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";

const ChonNgayGio = memo(function ChonNgayGio({ label, value, onChange, minDate, helperText }) {
    const dv = value ? dayjs(value) : null;
    const minDv = minDate ? dayjs(minDate.split("T")[0]) : null;

    const slotStyles = {
        textField: {
            size: "small",
            sx: {
                minWidth: 0,
                "& .MuiInputBase-root": { fontSize: "0.8rem", py: 0.5, px: 0.75 },
                "& .MuiInputAdornment-root": { ml: 0, mr: 0.25 },
                "& .MuiSvgIcon-root": { fontSize: "1rem" },
            },
        },
    };

    return (
        <Box>
            <Typography
                variant="caption"
                sx={{ mb: 0.25, display: "block", color: "text.secondary", fontSize: "0.7rem" }}
            >
                {label}
            </Typography>
            <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                <DatePicker
                    value={dv}
                    onChange={(nv) => {
                        if (!nv) { onChange(""); return; }
                        const time = value?.split("T")[1] || "00:00";
                        onChange(`${nv.format("YYYY-MM-DD")}T${time}`);
                    }}
                    minDate={minDv}
                    format="DD/MM/YYYY"
                    reduceAnimations
                    slotProps={slotStyles}
                    sx={{ flex: 1, minWidth: 0 }}
                />
                <TimePicker
                    value={dv}
                    onChange={(nv) => {
                        if (!nv) { onChange(""); return; }
                        const date = value?.split("T")[0] || dayjs().format("YYYY-MM-DD");
                        onChange(`${date}T${nv.format("HH:mm")}`);
                    }}
                    format="HH:mm"
                    ampm={false}
                    reduceAnimations
                    slotProps={slotStyles}
                    sx={{ flex: 1, minWidth: 0 }}
                />
            </Stack>
            {helperText && (
                <Typography variant="caption" color="text.secondary">
                    {helperText}
                </Typography>
            )}
        </Box>
    );
});

export default ChonNgayGio;

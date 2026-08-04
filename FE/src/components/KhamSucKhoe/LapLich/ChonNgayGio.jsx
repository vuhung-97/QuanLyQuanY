import { memo } from "react";
import { Box, Stack, Tooltip, Typography } from "@mui/material";
import { WarningAmber as WarningAmberIcon } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";

const ChonNgayGio = memo(function ChonNgayGio({
    label,
    value,
    onChange,
    minDate,
    helperText,
    column,
    disabled = false,
    defaultTime = "00:00",
    error = false,
    errorMessage = "",
}) {
    const dv = value ? dayjs(value) : null;
    const minDv = minDate ? dayjs(minDate.split("T")[0]) : null;

    const slotStyles = {
        textField: {
            size: "small",
            disabled,
            error,
            sx: {
                minWidth: 0,
                "& .MuiInputBase-root": {
                    fontSize: "0.8rem",
                    py: 0.5,
                    px: 0.75,
                },
                "& .MuiInputAdornment-root": { ml: 0, mr: 0.25 },
                "& .MuiSvgIcon-root": { fontSize: "1rem" },
            },
        },
    };

    return (
        <Box>
            <Typography
                variant="caption"
                sx={{
                    mb: 0.25,
                    display: "block",
                    color: "text.secondary",
                    fontSize: "0.7rem",
                }}
            >
                {label}
            </Typography>
            <Stack
                direction={column ? "column" : "row"}
                spacing={column ? 0.5 : 0.5}
                sx={{ alignItems: column ? undefined : "center" }}
            >
                <DatePicker
                    value={dv}
                    onChange={(nv) => {
                        if (!nv) {
                            onChange("");
                            return;
                        }
                        const time = value?.split("T")[1] || defaultTime;
                        onChange(`${nv.format("YYYY-MM-DD")}T${time}`);
                    }}
                    minDate={minDv}
                    format="DD/MM/YYYY"
                    reduceAnimations
                    slotProps={slotStyles}
                    sx={{ flex: column ? undefined : 1, minWidth: 0 }}
                />
                <TimePicker
                    value={dv}
                    onChange={(nv) => {
                        if (!nv) {
                            onChange("");
                            return;
                        }
                        const date =
                            value?.split("T")[0] ||
                            dayjs().format("YYYY-MM-DD");
                        onChange(`${date}T${nv.format("HH:mm")}`);
                    }}
                    format="HH:mm"
                    ampm={false}
                    reduceAnimations
                    slotProps={slotStyles}
                    sx={{ flex: column ? undefined : 1, minWidth: 0 }}
                />
                {error && (
                    <Tooltip title={errorMessage || "Thời gian không hợp lệ"} arrow>
                        <WarningAmberIcon
                            sx={{ color: "error.main", fontSize: "1rem", flexShrink: 0 }}
                        />
                    </Tooltip>
                )}
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

import { Box } from "@mui/material";
import { InputAdornment } from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

export default function DatePicker({ value, onChange, size = "large" }) {
    const isSmall = size === "small";
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
                value={value}
                onChange={(v) => v && onChange(v)}
                format="DD/MM/YYYY"
                slotProps={{
                    textField: {
                        size: "small",
                        sx: {
                            "& fieldset": { border: isSmall ? undefined : "none" },
                            width: isSmall ? 160 : 200,
                        },
                        slotProps: {
                            input: {
                                sx: {
                                    px: isSmall ? 1 : 0,
                                    fontSize: isSmall ? 14 : 22,
                                    fontWeight: isSmall ? 400 : 600,
                                    color: isSmall ? "text.primary" : "primary.dark",
                                },
                            },
                        },
                    },
                    openPickerButton: {
                        sx: {
                            m: 0,
                            "& .MuiSvgIcon-root": { fontSize: isSmall ? 20 : 32 },
                        },
                    },
                }}
            />
        </LocalizationProvider>
    );
}

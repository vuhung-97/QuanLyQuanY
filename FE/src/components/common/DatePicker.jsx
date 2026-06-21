import { Box } from "@mui/material";
import { InputAdornment } from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

export default function DatePicker({ value, onChange }) {
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
                            "& fieldset": { border: "none" },
                            width: 200,
                        },
                        slotProps: {
                            input: {
                                sx: {
                                    px: 0,
                                    fontSize: 22,
                                    fontWeight: 600,
                                    color: "primary.dark",
                                },
                            },
                        },
                    },
                    openPickerButton: {
                        sx: {
                            m: 0,
                            "& .MuiSvgIcon-root": { fontSize: 32 },
                        },
                    },
                }}
            />
        </LocalizationProvider>
    );
}

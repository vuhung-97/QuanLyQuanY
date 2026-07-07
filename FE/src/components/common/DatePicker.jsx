import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

export default function DatePicker({ value, onChange, size = "large", label }) {
    const isSmall = size === "small";
    return (
        <DesktopDatePicker
            label={label}
            value={value}
            onChange={(v) => v && onChange(v)}
            format="DD/MM/YYYY"
            slotProps={{
                textField: {
                    label,
                    size: "small",
                    sx: {
                        "& fieldset": {
                            border: isSmall ? undefined : "none",
                        },
                        width: isSmall ? 160 : 200,
                    },
                    slotProps: {
                        input: {
                            sx: {
                                px: isSmall ? 1 : 0,
                                fontSize: isSmall ? 14 : 22,
                                fontWeight: isSmall ? 400 : 600,
                                color: isSmall
                                    ? "text.primary"
                                    : "primary.dark",
                            },
                        },
                    },
                },
                openPickerButton: {
                    sx: {
                        m: 0,
                        "& .MuiSvgIcon-root": {
                            fontSize: isSmall ? 20 : 32,
                        },
                    },
                },
            }}
        />
    );
}

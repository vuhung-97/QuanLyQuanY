import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from "@mui/material";

export default function StatusFilter({
    value,
    onChange,
    statusMap,
    options,
    label = "Trạng thái",
    allLabel = "Tất cả",
    minWidth = 160,
}) {
    const items = options || Object.entries(statusMap).map(([key, val]) => ({
        value: key,
        label: val.label,
    }));
    return (
        <Box sx={{ minWidth }}>
            <FormControl fullWidth size="small">
                <InputLabel id="status-filter-label">{label}</InputLabel>
                <Select
                    labelId="status-filter-label"
                    value={value}
                    label={label}
                    onChange={(e) => onChange(e.target.value)}
                >
                    <MenuItem value="">{allLabel}</MenuItem>
                    {items.map((item) => (
                        <MenuItem key={item.value} value={item.value}>
                            {item.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
}

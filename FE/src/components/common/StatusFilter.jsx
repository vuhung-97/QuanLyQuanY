import {
    Box,
    Chip,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
} from "@mui/material";

export default function StatusFilter({
    value,
    onChange,
    statusMap,
    options,
    label = "Trạng thái",
    allLabel = "Tất cả",
    minWidth = 160,
    multiple = false,
}) {
    const items = options || Object.entries(statusMap).map(([key, val]) => ({
        value: key,
        label: val.label,
    }));

    if (multiple) {
        const selected = value || [];
        const labelMap = items.reduce((acc, item) => {
            acc[item.value] = item.label;
            return acc;
        }, {});
        return (
            <Box sx={{ minWidth }}>
                <FormControl fullWidth size="small">
                    <InputLabel id="status-filter-label">{label}</InputLabel>
                    <Select
                        labelId="status-filter-label"
                        multiple
                        value={selected}
                        label={label}
                        onChange={(e) => onChange(e.target.value)}
                        renderValue={(sel) =>
                            sel.length === 0 ? (
                                <em>{allLabel}</em>
                            ) : (
                                <Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap", gap: 0.5 }}>
                                    {sel.map((v) => (
                                        <Chip
                                            key={v}
                                            label={labelMap[v] || v}
                                            size="small"
                                            onMouseDown={(e) => e.stopPropagation()}
                                            onDelete={() =>
                                                onChange(selected.filter((x) => x !== v))
                                            }
                                        />
                                    ))}
                                </Stack>
                            )
                        }
                    >
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

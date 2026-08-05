import { memo, useCallback, useEffect, useState } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const FormSelect = memo(function FormSelect({
    name,
    initialValue,
    onUpdateRef,
    label,
    options = [],
    emptyLabel = "Chưa chọn",
    required = false,
    disabled = false,
    fullWidth = true,
    size = "small",
    error = false,
    helperText,
}) {
    const [value, setValue] = useState(initialValue ?? "");
    useEffect(() => {
        setValue(initialValue ?? "");
    }, [initialValue]);

    const handleChange = useCallback(
        (e) => {
            const v = e.target.value;
            setValue(v);
            onUpdateRef(name, v);
        },
        [name, onUpdateRef],
    );

    return (
        <FormControl fullWidth={fullWidth} size={size} error={error}>
            <InputLabel>{label}</InputLabel>
            <Select
                value={value}
                onChange={handleChange}
                label={label}
                disabled={disabled}
            >
                <MenuItem value="">
                    <em>{emptyLabel}</em>
                </MenuItem>
                {options.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                    </MenuItem>
                ))}
            </Select>
            {helperText && <span style={{ fontSize: "0.75rem", color: "inherit", marginLeft: 14 }}>{helperText}</span>}
        </FormControl>
    );
});

export default FormSelect;

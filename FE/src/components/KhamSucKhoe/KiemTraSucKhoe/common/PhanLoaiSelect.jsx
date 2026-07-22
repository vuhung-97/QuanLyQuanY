import { memo, useCallback, useState } from "react";
import {
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
} from "@mui/material";
import { DEFAULT_PHAN_LOAI, PHAN_LOAI_OPTIONS } from "@/constants/khamSucKhoeConstants.js";

const isStringArray = (arr) => Array.isArray(arr) && arr.length > 0 && typeof arr[0] === "string";

const PhanLoaiSelect = memo(({
    name,
    label,
    dataRef,
    readOnly = false,
    options = PHAN_LOAI_OPTIONS,
    gridProps = { xs: 6, sm: 4, md: true },
}) => {
    const [val, setVal] = useState(() => {
        const existing = dataRef.current?.[name];
        if (existing) return existing;
        if (isStringArray(options)) return DEFAULT_PHAN_LOAI;
        return options[0]?.value ?? DEFAULT_PHAN_LOAI;
    });

    const handleChange = useCallback((e) => {
        const v = e.target.value;
        setVal(v);
        dataRef.current[name] = v;
    }, [name, dataRef]);

    const renderOptions = () => {
        if (isStringArray(options)) {
            return options.map((opt) => (
                <MenuItem key={opt} value={opt}>
                    {opt}
                </MenuItem>
            ));
        }
        return options.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
            </MenuItem>
        ));
    };

    const select = (
        <FormControl fullWidth size="small">
            <InputLabel>{label}</InputLabel>
            <Select
                name={name}
                value={val}
                onChange={handleChange}
                label={label}
                disabled={readOnly}
            >
                {renderOptions()}
            </Select>
        </FormControl>
    );

    if (gridProps === false) return select;

    return <Grid size={gridProps}>{select}</Grid>;
});

export default PhanLoaiSelect;

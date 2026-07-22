import { memo, useCallback, useState } from "react";
import { Grid, InputAdornment, TextField, Tooltip } from "@mui/material";
import { fieldRanges, isOutOfRange } from "../tabs/fieldRanges.js";

const RangeFieldSM = memo(function RangeFieldSM({
    name,
    label,
    unit,
    dataRef,
    readOnly = false,
    size = "small",
    step = "1",
    min = "1",
    xs = 6,
    sm = 4,
    md = 2,
    onChangeExtra,
}) {
    const [val, setVal] = useState(() => dataRef.current?.[name] ?? "");

    const handleChange = useCallback(
        (e) => {
            const v = e.target.value;
            setVal(v);
            dataRef.current[name] = v;
            onChangeExtra?.(name, v);
        },
        [name, dataRef, onChangeExtra],
    );

    const outOfRange = isOutOfRange(name, val);

    return (
        <Grid size={{ xs, sm, md }}>
            <Tooltip
                title={fieldRanges[name]?.tooltip || ""}
                arrow
                placement="right"
            >
                <TextField
                    name={name}
                    label={label}
                    type="number"
                    value={val}
                    onChange={handleChange}
                    disabled={readOnly}
                    fullWidth
                    size={size}
                    error={outOfRange}
                    slotProps={{
                        htmlInput: { step, min },
                        input: unit
                            ? {
                                  endAdornment: (
                                      <InputAdornment position="end">
                                          {unit}
                                      </InputAdornment>
                                  ),
                              }
                            : undefined,
                    }}
                />
            </Tooltip>
        </Grid>
    );
});

export default RangeFieldSM;

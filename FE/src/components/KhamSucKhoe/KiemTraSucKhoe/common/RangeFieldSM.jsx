import { memo, useCallback, useState } from "react";
import { Grid, InputAdornment, Tooltip } from "@mui/material";
import NumberField from "@/components/common/NumberField.jsx";
import { fieldRanges, isOutOfRange } from "../tabs/fieldRanges.js";

const RangeFieldSM = memo(function RangeFieldSM({
    name,
    label,
    unit,
    dataRef,
    readOnly = false,
    size = "small",
    step = "1",
    min = "0",
    xs = 6,
    sm = 4,
    md = 2,
    onChangeExtra,
    errors,
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
    const fieldError = errors?.[name];

    return (
        <Grid size={{ xs, sm, md }}>
            <Tooltip
                title={fieldRanges[name]?.tooltip || ""}
                arrow
                placement="right"
            >
                <NumberField
                    name={name}
                    label={label}
                    value={val}
                    onChange={handleChange}
                    disabled={readOnly}
                    fullWidth
                    size={size}
                    error={outOfRange || Boolean(fieldError)}
                    helperText={fieldError}
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

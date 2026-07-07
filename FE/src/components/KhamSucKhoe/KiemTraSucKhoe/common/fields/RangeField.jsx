import { memo } from "react";
import { Grid, InputAdornment, TextField, Tooltip } from "@mui/material";
import { fieldRanges, isOutOfRange } from "../../tabs/fieldRanges.js";

const RangeField = memo(function RangeField({
    name,
    label,
    value,
    unit,
    onChange,
    readOnly = false,
    size = "small",
    step = "1",
    min = "1",
    xs = 6,
    sm = 4,
    md = 2,
}) {
    const outOfRange = isOutOfRange(name, value);

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
                    value={value}
                    onChange={onChange}
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

export default RangeField;

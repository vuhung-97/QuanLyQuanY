import { memo, useCallback, useState } from "react";
import { Grid } from "@mui/material";
import NormalToggleField from "@/components/common/NormalToggleField";

const NormalToggleFieldSM = memo(
    ({
        name,
        label,
        dataRef,
        readOnly,
        multiline,
        minRows,
        maxRows,
        normalText = "Bình thường",
        helperText,
        grid = 12,
        height,
        ...rest
    }) => {
        const [val, setVal] = useState(() => dataRef.current?.[name] ?? "");

        const handleChange = useCallback(
            (e) => {
                const v = e.target.value;
                setVal(v);
                dataRef.current[name] = v;
            },
            [name, dataRef],
        );

        return (
            <Grid size={grid}>
                <NormalToggleField
                    label={label}
                    name={name}
                    value={val}
                    onChange={handleChange}
                    readOnly={readOnly}
                    size="small"
                    normalText={normalText}
                    helperText={helperText}
                    multiline={multiline}
                    minRows={minRows}
                    maxRows={maxRows}
                    height={height}
                    {...rest}
                />
            </Grid>
        );
    },
);

export default NormalToggleFieldSM;

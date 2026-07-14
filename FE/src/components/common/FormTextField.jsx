import { memo, useCallback, useEffect, useState } from "react";
import { TextField } from "@mui/material";

const FormTextField = memo(function FormTextField({
    name,
    initialValue,
    onUpdateRef,
    onBlurSync,
    ...props
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

    const handleBlur = useCallback(() => {
        if (onBlurSync) onBlurSync(name, value);
    }, [name, value, onBlurSync]);

    return (
        <TextField
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            {...props}
        />
    );
});

export default FormTextField;

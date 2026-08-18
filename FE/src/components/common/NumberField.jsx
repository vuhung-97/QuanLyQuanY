import { memo, useCallback, useEffect, useState } from "react";
import { TextField } from "@mui/material";

const NumberField = memo(function NumberField({
    name,
    initialValue,
    onUpdateRef,
    value,
    onChange,
    defaultValue,
    inputRef,
    ...props
}) {
    const isControlled = onChange !== undefined;
    const isUncontrolled =
        defaultValue !== undefined || inputRef !== undefined;
    const [internal, setInternal] = useState(initialValue ?? "");

    useEffect(() => {
        if (initialValue !== undefined) {
            setInternal(initialValue ?? "");
        }
    }, [initialValue]);

    const handleChange = useCallback(
        (e) => {
            if (isControlled) {
                onChange(e);
            } else if (isUncontrolled) {
                // defaultValue/inputRef: do not touch state
            } else {
                setInternal(e.target.value);
                onUpdateRef?.(name, e.target.value);
            }
        },
        [isControlled, isUncontrolled, onChange, name, onUpdateRef],
    );

    let inputValue;
    if (isControlled) {
        inputValue = value;
    } else if (isUncontrolled) {
        inputValue = undefined;
    } else {
        inputValue = internal;
    }

    return (
        <TextField
            {...props}
            name={name}
            type="number"
            value={inputValue}
            defaultValue={isUncontrolled ? defaultValue : undefined}
            inputRef={isUncontrolled ? inputRef : undefined}
            onChange={handleChange}
        />
    );
});

export default NumberField;
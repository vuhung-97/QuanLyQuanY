import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { TextField } from "@mui/material";

const DEFAULT_MIN_MESSAGE = "Không điền giá trị âm";

function validateRange(value, min, max, minMessage, maxMessage) {
    if (value === "" || value === undefined || value === null) return "";
    const num = Number(value);
    if (Number.isNaN(num)) return "";
    if (min != null && num < min) {
        return minMessage ?? DEFAULT_MIN_MESSAGE;
    }
    if (max != null && num > max) {
        return maxMessage ?? `Giá trị không được lớn hơn ${max}`;
    }
    return "";
}

const NumberField = memo(function NumberField({
    name,
    initialValue,
    onUpdateRef,
    value,
    onChange,
    defaultValue,
    inputRef,
    min = 0,
    max,
    minMessage,
    maxMessage,
    error: externalError,
    helperText: externalHelperText,
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

    const validationError = useMemo(
        () =>
            min != null || max != null
                ? validateRange(inputValue, min, max, minMessage, maxMessage)
                : "",
        [inputValue, min, max, minMessage, maxMessage],
    );

    const hasValidationError = !!validationError;
    const showError = externalError || hasValidationError;
    const showHelperText = hasValidationError ? validationError : externalHelperText;

    return (
        <TextField
            {...props}
            name={name}
            type="number"
            value={inputValue}
            defaultValue={isUncontrolled ? defaultValue : undefined}
            inputRef={isUncontrolled ? inputRef : undefined}
            onChange={handleChange}
            error={showError ? true : undefined}
            helperText={showHelperText || undefined}
        />
    );
});

export default NumberField;

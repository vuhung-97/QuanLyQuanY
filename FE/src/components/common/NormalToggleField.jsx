import { memo } from "react";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { CheckCircleOutlined, Undo } from "@mui/icons-material";

const NormalToggleField = memo(function NormalToggleField({
    label,
    name,
    value,
    onChange,
    normalText = "Bình thường",
    multiline = false,
    minRows = 1,
    size = "medium",
    disabled = false,
    readOnly = false,
    helperText,
    ...rest
}) {
    const isNormal = value === normalText;
    const handleToggle = () => {
        if (readOnly || disabled) return;
        onChange({ target: { name, value: isNormal ? "" : normalText } });
    };
    return (
        <TextField
            label={label}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled || isNormal}
            readOnly={readOnly}
            multiline={multiline}
            minRows={minRows}
            fullWidth
            size={size}
            helperText={helperText}
            slotProps={{
                input: {
                    sx: multiline ? { fontSize: "1rem" } : undefined,
                    endAdornment: (
                        <InputAdornment
                            position="end"
                            sx={
                                multiline
                                    ? { alignSelf: "center", mt: 1 }
                                    : undefined
                            }
                        >
                            <IconButton
                                size="small"
                                onClick={handleToggle}
                                color={isNormal ? "success" : "default"}
                                disabled={readOnly || disabled}
                            >
                                {isNormal ? (
                                    <Undo fontSize="small" />
                                ) : (
                                    <CheckCircleOutlined fontSize="small" />
                                )}
                            </IconButton>
                        </InputAdornment>
                    ),
                },
            }}
            {...rest}
        />
    );
});

export default NormalToggleField;

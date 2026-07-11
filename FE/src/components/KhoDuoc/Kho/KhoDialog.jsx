import { memo, useCallback, useEffect, useState } from "react";
import {
    Autocomplete,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Grid,
    MenuItem,
    TextField,
    Typography,
} from "@mui/material";
import DialogTitleWrapper from "@/components/common/DialogTitleWrapper.jsx";
import DatePicker from "@/components/common/DatePicker.jsx";
import FeedbackSnackbar from "@/components/common/FeedbackSnackbar.jsx";
import useKhoForm from "@/hooks/useKhoForm.js";
import {
    DIALOG_FIELDS,
    LOAI_OPTIONS,
    MODE_TITLES,
} from "@/constants/khoConstant.js";

const TextFormField = memo(function TextFormField({
    label,
    name,
    initialValue = "",
    onChange,
    error,
    helperText,
    disabled,
    required,
    multiline,
    rows,
}) {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    const handleChange = useCallback(
        (e) => {
            setValue(e.target.value);
            onChange?.(name, e.target.value);
        },
        [name, onChange],
    );

    return (
        <TextField
            label={label}
            name={name}
            value={value}
            onChange={handleChange}
            fullWidth
            size="small"
            disabled={disabled}
            required={required}
            error={!!error}
            helperText={helperText}
            multiline={multiline}
            rows={rows}
        />
    );
});

const NumberFormField = memo(function NumberFormField({
    label,
    name,
    initialValue = "",
    onChange,
    disabled,
    error,
    helperText,
    slotProps,
}) {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    const handleChange = useCallback(
        (e) => {
            setValue(e.target.value);
            onChange?.(name, e.target.value);
        },
        [name, onChange],
    );

    return (
        <TextField
            label={label}
            name={name}
            value={value}
            onChange={handleChange}
            fullWidth
            size="small"
            disabled={disabled}
            type="number"
            error={!!error}
            helperText={helperText}
            slotProps={slotProps}
        />
    );
});

const DateFormField = memo(function DateFormField({
    label,
    initialValue = null,
    onChange,
}) {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    const handleChange = useCallback(
        (newValue) => {
            setValue(newValue);
            onChange?.("han_su_dung", newValue);
        },
        [onChange],
    );

    return (
        <DatePicker
            label={label}
            value={value}
            onChange={handleChange}
            size="small"
        />
    );
});

const AutocompleteFormField = memo(function AutocompleteFormField({
    label,
    name,
    initialValue = "",
    onChange,
    disabled,
    options,
    freeSolo,
}) {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    const handleChange = useCallback(
        (_, newValue) => {
            setValue(newValue || "");
            onChange?.(name, newValue || "");
        },
        [name, onChange],
    );

    const handleInputChange = useCallback(
        (_, newInputValue) => {
            if (freeSolo) {
                setValue(newInputValue || "");
                onChange?.(name, newInputValue || "");
            }
        },
        [name, onChange, freeSolo],
    );

    return (
        <Autocomplete
            freeSolo={freeSolo}
            options={options}
            value={value || ""}
            onChange={handleChange}
            onInputChange={handleInputChange}
            disabled={disabled}
            size="small"
            fullWidth
            renderInput={(params) => (
                <TextField {...params} label={label} name={name} />
            )}
        />
    );
});

const SelectFormField = memo(function SelectFormField({
    label,
    name,
    initialValue = "",
    onChange,
    disabled,
    required,
    options,
    emptyLabel = "-- Chọn --",
    slotProps,
}) {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    const handleChange = useCallback(
        (e) => {
            setValue(e.target.value);
            onChange?.(name, e.target.value);
        },
        [name, onChange],
    );

    return (
        <TextField
            select
            label={label}
            name={name}
            value={value}
            onChange={handleChange}
            fullWidth
            size="small"
            disabled={disabled}
            required={required}
            slotProps={slotProps}
        >
            <MenuItem value="">{emptyLabel}</MenuItem>
            {options.map((opt) => {
                const optValue = typeof opt === "object" ? opt.value : opt;
                const optLabel = typeof opt === "object" ? opt.label : opt;
                return (
                    <MenuItem key={optValue} value={optValue}>
                        {optLabel}
                    </MenuItem>
                );
            })}
        </TextField>
    );
});

export default function KhoDialog({
    open,
    onClose,
    onSaved,
    thuocId = null,
    mode = "create",
}) {
    const isView = mode === "view";
    const isEdit = mode === "edit";

    const hook = useKhoForm({ open, thuocId, mode, onClose, onSaved });

    const renderField = (field) => {
        const error = hook.errors[field.name];
        const helperText = error;

        switch (field.type) {
            case "loai":
                return (
                    <SelectFormField
                        label={field.label}
                        name={field.name}
                        initialValue={hook.getFieldDefault(field.name)}
                        onChange={hook.updateField}
                        disabled={isView}
                        required={field.required}
                        options={LOAI_OPTIONS}
                    />
                );
            case "donViTinh":
                return (
                    <AutocompleteFormField
                        label={field.label}
                        name={field.name}
                        initialValue={hook.getFieldDefault(field.name)}
                        onChange={hook.updateField}
                        disabled={isView}
                        options={hook.donViTinhOptions}
                        freeSolo
                    />
                );
            case "phanLoai":
                return (
                    <SelectFormField
                        key={`phan_loai-${hook.fieldVersion.phan_loai || 0}`}
                        label={field.label}
                        name={field.name}
                        initialValue={hook.getFieldDefault(field.name)}
                        onChange={hook.updateField}
                        disabled={isView}
                        options={hook.phanLoaiOptions}
                        emptyLabel={
                            hook.loadingOptions ? "Đang tải..." : "-- Chọn --"
                        }
                        slotProps={field.slotProps}
                    />
                );
            case "date":
                return (
                    <DateFormField
                        label={field.label}
                        initialValue={hook.getFieldDefault(field.name)}
                        onChange={hook.updateField}
                    />
                );
            case "number":
                return (
                    <NumberFormField
                        label={field.label}
                        name={field.name}
                        initialValue={hook.getFieldDefault(field.name)}
                        onChange={hook.updateField}
                        disabled={isView}
                        error={error}
                        helperText={helperText}
                        slotProps={field.slotProps}
                    />
                );
            case "textarea":
                return (
                    <TextFormField
                        label={field.label}
                        name={field.name}
                        initialValue={hook.getFieldDefault(field.name)}
                        onChange={hook.updateField}
                        disabled={isView}
                        multiline
                        rows={3}
                    />
                );
            default:
                return (
                    <TextFormField
                        label={field.label}
                        name={field.name}
                        initialValue={hook.getFieldDefault(field.name)}
                        onChange={hook.updateField}
                        disabled={isView}
                        required={field.required}
                        error={error}
                        helperText={helperText}
                    />
                );
        }
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={hook.saving ? undefined : hook.handleClose}
                fullWidth
                maxWidth="md"
            >
                <DialogTitleWrapper>
                    {MODE_TITLES[mode] || "Thuốc / VTYT"}
                </DialogTitleWrapper>

                <DialogContent dividers sx={{ height: 520, overflow: "auto" }}>
                    {hook.loading ? (
                        <Typography sx={{ textAlign: "center", py: 4 }}>
                            Đang tải...
                        </Typography>
                    ) : (
                        <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
                            {DIALOG_FIELDS.map((field) => (
                                <Grid key={field.name} size={field.grid}>
                                    {renderField(field)}
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </DialogContent>

                {!hook.loading && (
                    <DialogActions sx={{ p: 2 }}>
                        {isView ? (
                            <Button onClick={hook.handleClose}>Đóng</Button>
                        ) : (
                            <>
                                <Button
                                    onClick={hook.handleClose}
                                    disabled={hook.saving}
                                >
                                    Hủy
                                </Button>
                                <Button
                                    onClick={hook.handleSave}
                                    variant="contained"
                                    disabled={hook.saving}
                                >
                                    {hook.saving
                                        ? "Đang xử lý..."
                                        : isEdit
                                          ? "Cập nhật"
                                          : "Thêm mới"}
                                </Button>
                            </>
                        )}
                    </DialogActions>
                )}
            </Dialog>

            <FeedbackSnackbar
                open={hook.snackbar.open}
                message={hook.snackbar.message}
                severity={hook.snackbar.severity}
                onClose={() =>
                    hook.setSnackbar((prev) => ({ ...prev, open: false }))
                }
            />
        </>
    );
}

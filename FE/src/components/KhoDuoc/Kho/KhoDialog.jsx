import { memo } from "react";
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
    label, name, value, onChange, error, helperText, disabled,
    required, multiline, rows,
}) {
    return (
        <TextField
            label={label}
            name={name}
            value={value}
            onChange={onChange}
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
    label, name, value, onChange, disabled, error, helperText, slotProps,
}) {
    return (
        <TextField
            label={label}
            name={name}
            value={value}
            onChange={onChange}
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

const DateFormField = memo(function DateFormField({ label, value, onChange }) {
    return <DatePicker label={label} value={value} onChange={onChange} size="small" />;
});

const AutocompleteFormField = memo(function AutocompleteFormField({
    label, name, value, onChange, disabled, options, freeSolo
}) {
    return (
        <Autocomplete
            freeSolo={freeSolo}
            options={options}
            value={value || ""}
            onChange={(_, newValue) => {
                onChange({ target: { name, value: newValue || "" } });
            }}
            onInputChange={(_, newInputValue) => {
                if (freeSolo) {
                    onChange({ target: { name, value: newInputValue || "" } });
                }
            }}
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
    label, name, value, onChange, disabled, required,
    options, emptyLabel = "-- Chọn --", slotProps,
}) {
    return (
        <TextField
            select
            label={label}
            name={name}
            value={value}
            onChange={onChange}
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
        const value = hook.form[field.name];

        switch (field.type) {
            case "loai":
                return (
                    <SelectFormField
                        label={field.label}
                        name={field.name}
                        value={value}
                        onChange={hook.handleLoaiChange}
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
                        value={value}
                        onChange={hook.handleChange}
                        disabled={isView}
                        options={hook.donViTinhOptions}
                        freeSolo
                    />
                );
            case "phanLoai":
                return (
                    <SelectFormField
                        label={field.label}
                        name={field.name}
                        value={value}
                        onChange={hook.handleChange}
                        disabled={isView}
                        options={hook.phanLoaiOptions}
                        emptyLabel={hook.loadingOptions ? "Đang tải..." : "-- Chọn --"}
                        slotProps={field.slotProps}
                    />
                );
            case "date":
                return (
                    <DateFormField
                        label={field.label}
                        value={hook.form.han_su_dung}
                        onChange={hook.handleDateChange}
                    />
                );
            case "number":
                return (
                    <NumberFormField
                        label={field.label}
                        name={field.name}
                        value={value}
                        onChange={hook.handleChange}
                        disabled={isView}
                        error={!!hook.errors[field.name]}
                        helperText={hook.errors[field.name]}
                        slotProps={field.slotProps}
                    />
                );
            case "textarea":
                return (
                    <TextFormField
                        label={field.label}
                        name={field.name}
                        value={value}
                        onChange={hook.handleChange}
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
                        value={value}
                        onChange={hook.handleChange}
                        disabled={isView}
                        required={field.required}
                        error={!!hook.errors[field.name]}
                        helperText={hook.errors[field.name]}
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
                    <DialogActions sx={{ px: 3, pb: 2.5 }}>
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

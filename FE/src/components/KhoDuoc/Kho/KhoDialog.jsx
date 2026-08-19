import { memo, useCallback, useEffect, useState } from "react";
import {
    Autocomplete,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Grid,
    MenuItem,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import MedicationIcon from "@mui/icons-material/Medication";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import InventoryIcon from "@mui/icons-material/Inventory";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import NotesOutlinedIcon from "@mui/icons-material/NotesOutlined";
import DialogTitleWrapper from "@/components/common/DialogTitleWrapper.jsx";
import FormTextField from "@/components/common/FormTextField.jsx";
import NumberField from "@/components/common/NumberField.jsx";
import FeedbackSnackbar from "@/components/common/FeedbackSnackbar.jsx";
import useKhoForm from "@/hooks/useKhoForm.js";
import {
    DIALOG_FIELDS,
    LOAI_OPTIONS,
    MODE_TITLES,
} from "@/constants/khoConstant.js";

const SECTIONS = [
    {
        key: "basic",
        label: "Thông tin cơ bản",
        icon: <InfoOutlinedIcon fontSize="small" />,
    },
    {
        key: "inventory",
        label: "Tồn kho",
        icon: <InventoryIcon fontSize="small" />,
    },
    {
        key: "note",
        label: "Ghi chú",
        icon: <NotesOutlinedIcon fontSize="small" />,
    },
];

const getOptionLabel = (options, value) => {
    const found = options.find(
        (opt) => (typeof opt === "object" ? opt.value : opt) === value,
    );
    return found ? (typeof found === "object" ? found.label : found) : "";
};

const SectionHeader = ({ icon, title }) => (
    <Box
        sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mt: 1.5,
            mb: 2,
        }}
    >
        <Box sx={{ color: "primary.main", display: "flex" }}>{icon}</Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {title}
        </Typography>
        <Box sx={{ flexGrow: 1, height: 1, bgcolor: "divider" }} />
    </Box>
);

const InfoItem = ({ label, value }) => (
    <Box>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {label}
        </Typography>
        <Typography
            variant="body1"
            sx={{
                fontWeight: 500,
                wordBreak: "break-word",
                whiteSpace: "pre-wrap",
            }}
        >
            {value || "—"}
        </Typography>
    </Box>
);

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

    const getValue = (name) => {
        const v = hook.getFieldDefault(name);
        return v ?? "";
    };

    const renderField = (field) => {
        const error = hook.errors[field.name];

        switch (field.type) {
            case "loai":
                return (
                    <ToggleButtonGroup
                        exclusive
                        fullWidth
                        value={getValue("loai")}
                        onChange={(_, value) => {
                            if (value !== null) {
                                hook.updateField("loai", value);
                            }
                        }}
                        size="medium"
                        sx={{
                            "& .MuiToggleButton-root": {
                                py: 1.25,
                                textTransform: "none",
                                fontWeight: 600,
                                gap: 1,
                            },
                        }}
                    >
                        {LOAI_OPTIONS.map((opt) => (
                            <ToggleButton key={opt.value} value={opt.value}>
                                {opt.value === "thuoc" ? (
                                    <MedicationIcon />
                                ) : (
                                    <MedicalServicesIcon />
                                )}
                                {opt.label}
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup>
                );
            case "donViTinh":
                return (
                    <AutocompleteFormField
                        label={field.label}
                        name={field.name}
                        initialValue={getValue(field.name)}
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
                        initialValue={getValue(field.name)}
                        onChange={hook.updateField}
                        disabled={isView}
                        options={hook.phanLoaiOptions}
                        emptyLabel={
                            hook.loadingOptions ? "Đang tải..." : "-- Chọn --"
                        }
                        slotProps={field.slotProps}
                    />
                );
            case "number":
                return (
                    <NumberField
                        name={field.name}
                        initialValue={getValue(field.name)}
                        onUpdateRef={hook.updateField}
                        label={field.label}
                        disabled={isView}
                        error={!!error}
                        helperText={
                            error ||
                            (field.name === "so_luong"
                                ? "Số lượng tồn kho hiện tại của thuốc / vật tư y tế."
                                : undefined)
                        }
                        min={field.slotProps?.htmlInput?.min}
                        max={field.slotProps?.htmlInput?.max}
                        slotProps={field.slotProps}
                        fullWidth
                        size="small"
                    />
                );
            case "textarea":
                return (
                    <FormTextField
                        name={field.name}
                        initialValue={getValue(field.name)}
                        onUpdateRef={hook.updateField}
                        label={field.label}
                        disabled={isView}
                        multiline
                        rows={3}
                        fullWidth
                        size="small"
                    />
                );
            default:
                return (
                    <FormTextField
                        name={field.name}
                        initialValue={getValue(field.name)}
                        onUpdateRef={hook.updateField}
                        label={field.label}
                        disabled={isView}
                        required={field.required}
                        error={!!error}
                        helperText={error}
                        fullWidth
                        size="small"
                    />
                );
        }
    };

    const renderViewValue = (field) => {
        const raw = getValue(field.name);
        switch (field.type) {
            case "loai": {
                const label = getOptionLabel(LOAI_OPTIONS, raw);
                return (
                    <InfoItem
                        label={field.label}
                        value={
                            <span
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 6,
                                }}
                            >
                                {raw === "thuoc" ? (
                                    <MedicationIcon fontSize="small" />
                                ) : raw === "vat_tu" ? (
                                    <MedicalServicesIcon fontSize="small" />
                                ) : null}
                                {label}
                            </span>
                        }
                    />
                );
            }
            case "phanLoai":
                return (
                    <InfoItem
                        label={field.label}
                        value={getOptionLabel(hook.phanLoaiOptions, raw)}
                    />
                );
            case "number":
                return (
                    <InfoItem
                        label={field.label}
                        value={
                            raw === "" || raw == null
                                ? ""
                                : Number(raw).toLocaleString("vi-VN")
                        }
                    />
                );
            default:
                return <InfoItem label={field.label} value={raw} />;
        }
    };

    const renderSection = (section) => {
        const fields = DIALOG_FIELDS.filter(
            (f) => f.section === section.key,
        );
        if (fields.length === 0) return null;
        return (
            <Box key={section.key}>
                <SectionHeader icon={section.icon} title={section.label} />
                <Grid container spacing={2.5}>
                    {fields.map((field) => (
                        <Grid key={field.name} size={field.grid}>
                            {isView ? renderViewValue(field) : renderField(field)}
                        </Grid>
                    ))}
                </Grid>
            </Box>
        );
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={hook.saving ? undefined : hook.handleClose}
                fullWidth
                maxWidth="md"
            >
                <DialogTitleWrapper
                    sx={{
                        position: "relative",
                        overflow: "hidden",
                        "&::before": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 4,
                            background:
                                "linear-gradient(90deg, #0B3B60 0%, #00B4D8 100%)",
                        },
                    }}
                    typographySx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                    }}
                >
                    <Inventory2Icon
                        sx={{ fontSize: 24, color: "primary.main" }}
                    />
                    {MODE_TITLES[mode] || "Thuốc / VTYT"}
                </DialogTitleWrapper>

                <DialogContent dividers sx={{ height: 520, overflow: "auto" }}>
                    {hook.loading ? (
                        <Typography sx={{ textAlign: "center", py: 4 }}>
                            Đang tải...
                        </Typography>
                    ) : (
                        <Box sx={{ pt: 1 }}>
                            {SECTIONS.map(renderSection)}
                        </Box>
                    )}
                </DialogContent>

                {!hook.loading && (
                    <DialogActions sx={{ p: 2 }}>
                        {isView ? (
                            <Button
                                variant="outlined"
                                onClick={hook.handleClose}
                            >
                                Đóng
                            </Button>
                        ) : (
                            <>
                                <Button
                                    variant="outlined"
                                    onClick={hook.handleClose}
                                    disabled={hook.saving}
                                >
                                    Hủy
                                </Button>
                                <Button
                                    onClick={hook.handleSave}
                                    variant="contained"
                                    startIcon={
                                        isEdit ? <SaveIcon /> : <AddIcon />
                                    }
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
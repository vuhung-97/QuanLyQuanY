import { useMemo } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Grid,
    Typography,
} from "@mui/material";
import DialogTitleWrapper from "@/components/common/DialogTitleWrapper.jsx";
import FeedbackSnackbar from "@/components/common/FeedbackSnackbar.jsx";
import FormSelect from "@/components/common/FormSelect.jsx";
import FormTextField from "@/components/common/FormTextField.jsx";
import useStaticList from "@/hooks/useStaticList.js";
import useDanhMucForm from "@/hooks/useDanhMucForm.js";

export default function DanhMucDialog({
    open,
    onClose,
    onSaved,
    itemId = null,
    mode = "create",
    config,
}) {
    const isView = mode === "view";

    const requiredFields = config.fields
        .filter((f) => f.required)
        .map((f) => f.name);

    const hook = useDanhMucForm({
        open,
        itemId,
        mode,
        onClose,
        onSaved,
        service: config.service,
        initForm: config.initForm,
        requiredFields,
    });

    const selectField = config.fields.find(
        (f) => f.type === "select" && f.optionsUrl,
    );
    const selectOptions = useStaticList(
        selectField?.optionsUrl || "",
        { pageSize: 500 },
    );
    const selectOptionsMap = useMemo(() => {
        const map = new Map();
        for (const item of selectOptions) {
            map.set(
                item[selectField?.valueField] ?? item[selectField?.idField],
                item[selectField?.labelField],
            );
        }
        return map;
    }, [selectOptions, selectField]);

    const renderField = (field) => {
        const error = hook.errors[field.name];

        if (field.type === "select") {
            const options = field.optionsUrl
                ? [...selectOptionsMap.entries()].map(([value, label]) => ({
                      value,
                      label,
                  }))
                : field.options || [];
            return (
                <FormSelect
                    name={field.name}
                    initialValue={hook.getFieldDefault(field.name)}
                    onUpdateRef={hook.updateField}
                    label={field.label}
                    options={options}
                    disabled={isView}
                    required={field.required}
                    error={!!error}
                    helperText={error}
                />
            );
        }

        return (
            <FormTextField
                name={field.name}
                initialValue={hook.getFieldDefault(field.name)}
                onUpdateRef={hook.updateField}
                label={field.label}
                disabled={isView}
                required={field.required}
                error={!!error}
                helperText={error}
                fullWidth
                size="small"
                multiline={field.multiline}
                rows={field.rows}
            />
        );
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={hook.saving ? undefined : hook.handleClose}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitleWrapper>
                    {config.modeTitles[mode] || ""}
                </DialogTitleWrapper>

                <DialogContent dividers sx={{ height: 300, overflow: "auto" }}>
                    {hook.loading ? (
                        <Typography sx={{ textAlign: "center", py: 4 }}>
                            Đang tải...
                        </Typography>
                    ) : (
                        <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
                            {config.fields.map((field) => (
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
                                        : mode === "edit"
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

import { useState, useEffect, useCallback, useRef } from "react";

export default function useDanhMucForm({
    open,
    itemId,
    mode,
    onClose,
    onSaved,
    service,
    initForm,
    requiredFields = [],
}) {
    const formRef = useRef({ ...initForm });
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });
    const [errors, setErrors] = useState({});

    const errorsRef = useRef(errors);
    errorsRef.current = errors;

    const isView = mode === "view";
    const isEdit = mode === "edit";

    const loadData = useCallback(async () => {
        if (!itemId) return;
        setLoading(true);
        try {
            const res = await service.get(itemId);
            const d = res.data;
            const loaded = { ...initForm };
            for (const key of Object.keys(initForm)) {
                if (d[key] != null) loaded[key] = d[key];
            }
            formRef.current = loaded;
        } catch {
            setSnackbar({
                open: true,
                message: "Lỗi tải dữ liệu",
                severity: "error",
            });
        } finally {
            setLoading(false);
        }
    }, [itemId, service, initForm]);

    useEffect(() => {
        if (!open) return;
        setErrors({});
        if (itemId) {
            loadData();
        } else {
            formRef.current = { ...initForm };
        }
    }, [open, itemId, loadData, initForm]);

    const getFieldDefault = useCallback((name) => {
        return formRef.current[name];
    }, []);

    const updateField = useCallback((name, value) => {
        formRef.current[name] = value;
        if (errorsRef.current[name]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[name];
                return next;
            });
        }
    }, []);

    const handleClose = useCallback(() => {
        setErrors({});
        onClose();
    }, [onClose]);

    const handleSave = useCallback(async () => {
        const f = formRef.current;
        const newErrors = {};
        for (const key of requiredFields) {
            if (!f[key]?.toString().trim()) {
                newErrors[key] = "Không được để trống";
            }
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setSaving(true);
        try {
            const payload = {};
            for (const key of Object.keys(initForm)) {
                const val = f[key];
                payload[key] = typeof val === "string" ? val.trim() || null : val;
            }
            if (mode === "create") {
                await service.create(payload);
            } else {
                await service.update(itemId, payload);
            }
            onSaved?.();
            handleClose();
        } catch (err) {
            const msg = err?.response?.data?.detail || "Lỗi lưu dữ liệu";
            setSnackbar({ open: true, message: msg, severity: "error" });
        } finally {
            setSaving(false);
        }
    }, [itemId, mode, onSaved, handleClose, service, initForm, requiredFields]);

    return {
        getFieldDefault,
        fieldVersion: {},
        loading,
        saving,
        snackbar,
        errors,
        isView,
        isEdit,
        updateField,
        handleSave,
        handleClose,
        setSnackbar,
    };
}

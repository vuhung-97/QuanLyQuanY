import { useState, useEffect, useCallback, useRef } from "react";
import { khoDuocService } from "@/services/khoDuocService.js";
import { INIT_FORM } from "@/constants/khoConstant.js";

export default function useKhoForm({ open, thuocId, mode, onClose, onSaved }) {
    const formRef = useRef({ ...INIT_FORM });
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });
    const [errors, setErrors] = useState({});
    const [phanLoaiOptions, setPhanLoaiOptions] = useState([]);
    const [donViTinhOptions, setDonViTinhOptions] = useState([]);
    const [loadingOptions, setLoadingOptions] = useState(false);
    const [fieldVersion, setFieldVersion] = useState({});

    const errorsRef = useRef(errors);
    errorsRef.current = errors;

    const loadData = useCallback(async () => {
        if (!thuocId) return;
        setLoading(true);
        try {
            const res = await khoDuocService.getThuocVtyt(thuocId);
            const d = res.data;
            formRef.current = {
                ten_thuoc_vtyt: d.ten_thuoc_vtyt || "",
                loai: d.loai || "",
                don_vi_tinh: d.don_vi_tinh || "",
                phan_loai: d.phan_loai || "",
                hoat_chat: d.hoat_chat || "",
                so_luong: d.so_luong ?? 0,
                mo_ta: d.mo_ta || "",
            };
        } catch {
            setSnackbar({
                open: true,
                message: "Lỗi tải dữ liệu",
                severity: "error",
            });
        } finally {
            setLoading(false);
        }
    }, [thuocId]);

    useEffect(() => {
        if (!open) return;
        setErrors({});
        setFieldVersion({});
        if (thuocId) {
            loadData();
        } else {
            formRef.current = { ...INIT_FORM };
        }
        setLoadingOptions(true);
        Promise.all([
            khoDuocService.getPhanLoaiList(),
            khoDuocService.getDonViTinhList(),
        ])
            .then(([phanLoaiRes, donViTinhRes]) => {
                setPhanLoaiOptions(phanLoaiRes.data || []);
                setDonViTinhOptions(donViTinhRes.data || []);
            })
            .catch(() => {})
            .finally(() => setLoadingOptions(false));
    }, [open, thuocId, loadData]);

    const getFieldDefault = useCallback((name) => {
        return formRef.current[name];
    }, []);

    const updateField = useCallback((name, value) => {
        formRef.current[name] = value;

        if (name === "loai") {
            formRef.current.phan_loai = "";
            setFieldVersion((prev) => ({
                ...prev,
                phan_loai: (prev.phan_loai || 0) + 1,
            }));
        }

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
        if (!f.ten_thuoc_vtyt?.trim()) {
            setErrors({ ten_thuoc_vtyt: "Tên thuốc/VTYT không được để trống" });
            return;
        }
        setSaving(true);
        try {
            const payload = {
                ten_thuoc_vtyt: f.ten_thuoc_vtyt.trim(),
                loai: f.loai || null,
                don_vi_tinh: f.don_vi_tinh || null,
                phan_loai: f.phan_loai || null,
                hoat_chat: f.hoat_chat || null,
                so_luong: Number(f.so_luong) || 0,
                mo_ta: f.mo_ta || null,
            };
            let saved;
            if (mode === "create") {
                saved = await khoDuocService.createThuocVtyt(payload);
            } else {
                saved = await khoDuocService.updateThuocVtyt(thuocId, payload);
            }
            onSaved?.(saved?.data);
            handleClose();
        } catch (err) {
            const msg = err?.response?.data?.detail || "Lỗi lưu dữ liệu";
            setSnackbar({ open: true, message: msg, severity: "error" });
        } finally {
            setSaving(false);
        }
    }, [thuocId, mode, onSaved, handleClose]);

    return {
        getFieldDefault,
        fieldVersion,
        loading,
        saving,
        snackbar,
        errors,
        phanLoaiOptions,
        donViTinhOptions,
        loadingOptions,
        updateField,
        handleSave,
        handleClose,
        setSnackbar,
    };
}

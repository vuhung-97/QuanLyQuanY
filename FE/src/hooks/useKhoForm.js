import { useState, useEffect, useCallback, useRef } from "react";
import dayjs from "dayjs";
import { khoDuocService } from "@/services/khoDuocService.js";
import { INIT_FORM } from "@/constants/khoConstant.js";

export default function useKhoForm({ open, thuocId, mode, onClose, onSaved }) {
    const [form, setForm] = useState({ ...INIT_FORM });
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

    const errorsRef = useRef(errors);
    errorsRef.current = errors;
    const formRef = useRef(form);
    formRef.current = form;

    const loadData = useCallback(async () => {
        if (!thuocId) return;
        setLoading(true);
        try {
            const res = await khoDuocService.getThuocVtyt(thuocId);
            const d = res.data;
            setForm({
                ten_thuoc_vtyt: d.ten_thuoc_vtyt || "",
                loai: d.loai || "",
                don_vi_tinh: d.don_vi_tinh || "",
                phan_loai: d.phan_loai || "",
                nha_san_xuat: d.nha_san_xuat || "",
                hoat_chat: d.hoat_chat || "",
                don_gia: d.don_gia != null ? String(d.don_gia) : "",
                so_luong: d.so_luong ?? 0,
                so_lo_han_dung: d.so_lo_han_dung || "",
                han_su_dung: d.han_su_dung ? dayjs(d.han_su_dung) : null,
                nam_san_xuat:
                    d.nam_san_xuat != null ? String(d.nam_san_xuat) : "",
                cap_chat_luong: d.cap_chat_luong || "",
                mo_ta: d.mo_ta || "",
            });
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
        if (thuocId) {
            loadData();
        } else {
            setForm({ ...INIT_FORM });
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

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errorsRef.current[name])
            setErrors((prev) => {
                const next = { ...prev };
                delete next[name];
                return next;
            });
    }, []);

    const handleLoaiChange = useCallback((e) => {
        const val = e.target.value;
        setForm((prev) => ({ ...prev, loai: val, phan_loai: "" }));
        if (errorsRef.current.loai)
            setErrors((prev) => {
                const next = { ...prev };
                delete next.loai;
                return next;
            });
    }, []);

    const handleDateChange = useCallback((value) => {
        setForm((prev) => ({ ...prev, han_su_dung: value }));
        if (errorsRef.current.han_su_dung)
            setErrors((prev) => {
                const next = { ...prev };
                delete next.han_su_dung;
                return next;
            });
    }, []);

    const handleClose = useCallback(() => {
        setErrors({});
        onClose();
    }, [onClose]);

    const validate = useCallback(() => {
        const f = formRef.current;
        const e = {};
        if (!f.ten_thuoc_vtyt.trim())
            e.ten_thuoc_vtyt = "Tên thuốc/VTYT không được để trống";
        setErrors(e);
        return Object.keys(e).length === 0;
    }, []);

    const handleSave = useCallback(async () => {
        const f = formRef.current;
        if (!f.ten_thuoc_vtyt.trim()) {
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
                nha_san_xuat: f.nha_san_xuat || null,
                hoat_chat: f.hoat_chat || null,
                don_gia: f.don_gia ? Number(f.don_gia) : null,
                so_luong: Number(f.so_luong) || 0,
                so_lo_han_dung: f.so_lo_han_dung || null,
                han_su_dung: f.han_su_dung
                    ? f.han_su_dung.format("YYYY-MM-DD")
                    : null,
                nam_san_xuat: f.nam_san_xuat
                    ? Number(f.nam_san_xuat)
                    : null,
                cap_chat_luong: f.cap_chat_luong || null,
                mo_ta: f.mo_ta || null,
            };
            if (mode === "create") {
                await khoDuocService.createThuocVtyt(payload);
            } else {
                await khoDuocService.updateThuocVtyt(thuocId, payload);
            }
            onSaved?.();
            handleClose();
        } catch (err) {
            const msg = err?.response?.data?.detail || "Lỗi lưu dữ liệu";
            setSnackbar({ open: true, message: msg, severity: "error" });
        } finally {
            setSaving(false);
        }
    }, [thuocId, mode, onSaved, handleClose]);

    return {
        form,
        loading,
        saving,
        snackbar,
        errors,
        phanLoaiOptions,
        donViTinhOptions,
        loadingOptions,
        handleChange,
        handleLoaiChange,
        handleDateChange,
        handleSave,
        handleClose,
        setSnackbar,
    };
}

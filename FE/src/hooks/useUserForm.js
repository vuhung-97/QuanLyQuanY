import { useCallback, useEffect, useRef, useState } from "react";
import { adminService } from "@/services/adminService.js";

const emptyForm = {
    ten_dang_nhap: "",
    mat_khau: "",
    ho_ten: "",
    id_vai_tro: "ROLE_QN",
    id_quan_nhan: "",
    trang_thai: true,
};

export default function useUserForm({ open, editingUser, onClose, onSaved }) {
    const [formSnapshot, setFormSnapshot] = useState(emptyForm);
    const formRef = useRef({ ...emptyForm });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [openChonQn, setOpenChonQn] = useState(false);

    const updateField = useCallback((name, value) => {
        formRef.current[name] = value;
    }, []);

    useEffect(() => {
        if (open) {
            const init = editingUser
                ? { ...emptyForm, ...editingUser, mat_khau: "" }
                : { ...emptyForm };
            setFormSnapshot(init);
            formRef.current = { ...init };
            setError("");
            setSaving(false);
        }
    }, [open, editingUser]);

    const handleTrangThaiChange = useCallback((e) => {
        const v = e.target.checked;
        formRef.current.trang_thai = v;
        setFormSnapshot((prev) => ({ ...prev, trang_thai: v }));
    }, []);

    const handleChonQuanNhan = useCallback((qn) => {
        formRef.current.id_quan_nhan = qn.ma_quan_nhan;
        formRef.current.ho_ten = qn.ho_ten;
        setFormSnapshot((prev) => ({
            ...prev,
            id_quan_nhan: qn.ma_quan_nhan,
            ho_ten: qn.ho_ten,
        }));
        setOpenChonQn(false);
    }, []);

    const handleSubmit = useCallback(
        async (event) => {
            event.preventDefault();
            setSaving(true);
            setError("");
            try {
                const payload = { ...formRef.current };
                if (!payload.id_vai_tro) {
                    setError("Vai trò không được để trống.");
                    setSaving(false);
                    return;
                }
                if (!editingUser) delete payload.id;
                if (editingUser && !payload.mat_khau) delete payload.mat_khau;

                let res;
                if (editingUser) {
                    res = await adminService.updateUser(editingUser.id, payload);
                } else {
                    res = await adminService.createUser(payload);
                }
                onSaved(res.data, !!editingUser);
                onClose();
            } catch (err) {
                setError(
                    err.response?.data?.detail ||
                        "Không thể lưu tài khoản người dùng.",
                );
            } finally {
                setSaving(false);
            }
        },
        [editingUser, onSaved, onClose],
    );

    const handleClose = useCallback(() => {
        onClose();
    }, [onClose]);

    return {
        formSnapshot,
        updateField,
        saving,
        error,
        openChonQn,
        setOpenChonQn,
        handleTrangThaiChange,
        handleChonQuanNhan,
        handleSubmit,
        handleClose,
    };
}

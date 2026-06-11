import { useCallback, useEffect, useState } from "react";
import api from "../services/api.js";
import {
    DEFAULT_TS, DEFAULT_LS, DEFAULT_CLS, DEFAULT_KL,
    parseTienSu, parseLamSang, parseCanLamSang, parseKetLuan,
} from "../components/PeriodicCheckup/healthCheckFormUtils.js";

export default function useHealthCheckForm({
    open, quanNhan, existingPhieu, nam, onSaved, onClose,
}) {
    const [activeTab, setActiveTab] = useState(0);
    const [ngayNhapNgu, setNgayNhapNgu] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [ts, setTs] = useState({ ...DEFAULT_TS });
    const [ls, setLs] = useState({ ...DEFAULT_LS });
    const [cls, setCls] = useState({ ...DEFAULT_CLS });
    const [kl, setKl] = useState({ ...DEFAULT_KL });

    const isEdit = Boolean(existingPhieu);

    useEffect(() => {
        if (open && quanNhan) {
            setNgayNhapNgu(quanNhan.ngay_nhap_ngu || "");
            if (existingPhieu) {
                setTs(parseTienSu(existingPhieu.tien_su_benh_tat));
                setLs(parseLamSang(existingPhieu.kham_lam_sang));
                setCls(parseCanLamSang(existingPhieu.kham_can_lam_sang));
                setKl(parseKetLuan(existingPhieu.ket_luan));
            } else {
                setTs({ ...DEFAULT_TS });
                setLs({ ...DEFAULT_LS });
                setCls({ ...DEFAULT_CLS });
                setKl({ ...DEFAULT_KL });
            }
            setError("");
            setActiveTab(0);
        }
    }, [open, quanNhan, existingPhieu]);

    const handleTsChange = useCallback((e) => {
        const { name, value } = e.target;
        setTs((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handleLsChange = useCallback((e) => {
        const { name, value } = e.target;
        setLs((prev) => {
            const updated = { ...prev, [name]: value };
            if (name === "chieu_cao" || name === "can_nang") {
                const h = parseFloat(
                    name === "chieu_cao" ? value : prev.chieu_cao,
                );
                const w = parseFloat(
                    name === "can_nang" ? value : prev.can_nang,
                );
                if (h > 0 && w > 0) {
                    updated.bmi = (w / Math.pow(h / 100, 2)).toFixed(1);
                } else {
                    updated.bmi = "";
                }
            }
            return updated;
        });
    }, []);

    const handleClsChange = useCallback((e) => {
        const { name, value } = e.target;
        setCls((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handleKlChange = useCallback((e) => {
        const { name, value } = e.target;
        setKl((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        try {
            const phieuData = {
                ma_quan_nhan: quanNhan.ma_quan_nhan,
                nam: nam || null,
                tien_su_benh_tat: JSON.stringify(ts),
                kham_lam_sang: JSON.stringify(ls),
                kham_can_lam_sang: JSON.stringify(cls),
                ket_luan: Object.values(kl).some(
                    (v) => v && v !== "Loại 1",
                )
                    ? JSON.stringify(kl)
                    : "",
            };

            let saved;
            if (isEdit) {
                saved = await api.patch(
                    `/phieu_kham_suc_khoe/${existingPhieu.ma_phieu_kham}`,
                    phieuData,
                );
            } else {
                saved = await api.post("/phieu_kham_suc_khoe", phieuData);
            }
            onSaved(saved.data);
            onClose();
        } catch (err) {
            setError(
                err.response?.data?.detail || "Không thể lưu phiếu khám.",
            );
        } finally {
            setSaving(false);
        }
    };

    return {
        activeTab,
        setActiveTab,
        ngayNhapNgu,
        saving,
        error,
        ts,
        ls,
        cls,
        kl,
        handleTsChange,
        handleLsChange,
        handleClsChange,
        handleKlChange,
        handleSubmit,
    };
}

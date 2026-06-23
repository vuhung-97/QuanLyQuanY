import { useEffect, useRef, useState } from "react";
import { khamSucKhoeService } from "@/services/khamSucKhoeService.js";
import {
    DEFAULT_TS,
    DEFAULT_LS,
    DEFAULT_CLS,
    DEFAULT_KL,
    parseTienSu,
    parseLamSang,
    parseCanLamSang,
    parseKetLuan,
} from "@/components/KhamSucKhoe/KiemTraSucKhoe/KhamSucKhoeFormUtils.js";

export default function useKhamSucKhoeForm({
    open,
    quanNhan,
    existingPhieu,
    nam,
    onSaved,
    onClose,
}) {
    const [activeTab, setActiveTab] = useState(0);
    const [ngayNhapNgu, setNgayNhapNgu] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const tsRef = useRef(null);
    const lsRef = useRef(null);
    const xnRef = useRef(null);
    const cdhaRef = useRef(null);
    const klRef = useRef(null);
    const [initialTS, setInitialTS] = useState(null);
    const [initialLS, setInitialLS] = useState(null);
    const [initialXN, setInitialXN] = useState(null);
    const [initialCDHA, setInitialCDHA] = useState(null);
    const [initialKL, setInitialKL] = useState(null);

    const isEdit = Boolean(existingPhieu);

    useEffect(() => {
        if (open && quanNhan) {
            setNgayNhapNgu(quanNhan.ngay_nhap_ngu || "");
            if (existingPhieu) {
                setInitialTS(parseTienSu(existingPhieu.tien_su_benh_tat));
                setInitialLS(parseLamSang(existingPhieu.kham_lam_sang));
                setInitialXN(parseCanLamSang(existingPhieu.kham_can_lam_sang));
                setInitialCDHA(parseCanLamSang(existingPhieu.kham_can_lam_sang));
                setInitialKL(parseKetLuan(existingPhieu.ket_luan));
            } else {
                setInitialTS({ ...DEFAULT_TS });
                setInitialLS({ ...DEFAULT_LS });
                setInitialXN({ ...DEFAULT_CLS });
                setInitialCDHA({ ...DEFAULT_CLS });
                setInitialKL({ ...DEFAULT_KL });
            }
            setError("");
            setActiveTab(0);
        }
    }, [open, quanNhan, existingPhieu]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        try {
            if (!initialTS) {
                setError("Dữ liệu chưa sẵn sàng.");
                setSaving(false);
                return;
            }
            const ts = tsRef.current?.getData() ?? initialTS;
            const ls = lsRef.current?.getData() ?? initialLS;
            const cls = {
                ...(xnRef.current?.getData() ?? initialXN),
                ...(cdhaRef.current?.getData() ?? initialCDHA),
            };
            const kl = klRef.current?.getData() ?? initialKL;

            const phieuData = {
                ma_quan_nhan: quanNhan.ma_quan_nhan,
                nam: nam || null,
                tien_su_benh_tat: JSON.stringify(ts),
                kham_lam_sang: JSON.stringify(ls),
                kham_can_lam_sang: JSON.stringify(cls),
                ket_luan: Object.values(kl).some((v) => v && v !== "Loại 1")
                    ? JSON.stringify(kl)
                    : "",
            };

            let saved;
            if (isEdit) {
                saved = await khamSucKhoeService.updatePhieu(
                    existingPhieu.ma_phieu_kham,
                    phieuData,
                );
            } else {
                saved = await khamSucKhoeService.createPhieu(phieuData);
            }
            onSaved(saved.data);
            onClose();
        } catch (err) {
            setError(err.response?.data?.detail || "Không thể lưu phiếu khám.");
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
        tsRef,
        lsRef,
        xnRef,
        cdhaRef,
        klRef,
        initialTS,
        initialLS,
        initialXN,
        initialCDHA,
        initialKL,
        handleSubmit,
    };
}

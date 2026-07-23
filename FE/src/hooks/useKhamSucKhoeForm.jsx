import { useEffect, useRef, useState } from "react";
import { khamSucKhoeService } from "@/services/khamSucKhoeService.js";
import {
    DEFAULT_TS,
    DEFAULT_LS,
    DEFAULT_XN,
    DEFAULT_CDHA,
    DEFAULT_KL,
    ALL_TABS,
} from "@/constants/khamSucKhoeConstants.js";
import {
    parseTienSu,
    parseLamSang,
    parseXetNghiem,
    parseChanDoanHinhAnh,
    parseKetLuan,
    computeHighestClassification,
} from "@/components/KhamSucKhoe/KhamSucKhoeUtils.js";

function getDirty(current, initial) {
    const dirty = {};
    for (const key of Object.keys(current)) {
        if (current[key] !== (initial?.[key] ?? "")) {
            dirty[key] = current[key];
        }
    }
    return dirty;
}

export default function useKhamSucKhoeForm({
    open,
    quanNhan,
    existingPhieu,
    maLichKham,
    nam,
    onSaved,
    onClose,
    allowedTabs = ALL_TABS,
    editableTabs = ALL_TABS,
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
    const [klVersion, setKlVersion] = useState(0);

    const isEdit = Boolean(existingPhieu);

    useEffect(() => {
        if (open && quanNhan) {
            setNgayNhapNgu(quanNhan.ngay_nhap_ngu || "");
            if (existingPhieu) {
                setInitialTS(parseTienSu(existingPhieu.tong_quan));
                setInitialLS(parseLamSang(existingPhieu.kham_lam_sang));
                setInitialXN(parseXetNghiem(existingPhieu.xet_nghiem));
                setInitialCDHA(
                    parseChanDoanHinhAnh(existingPhieu.chan_doan_hinh_anh),
                );
                setInitialKL(parseKetLuan(existingPhieu.ket_luan));
            } else {
                setInitialTS({ ...DEFAULT_TS });
                setInitialLS({ ...DEFAULT_LS });
                setInitialXN({ ...DEFAULT_XN });
                setInitialCDHA({ ...DEFAULT_CDHA });
                setInitialKL({ ...DEFAULT_KL });
            }
            setError("");
            setActiveTab(allowedTabs[0] ?? 0);
        }
    }, [open, quanNhan, existingPhieu]);

    useEffect(() => {
        setActiveTab(allowedTabs[0] ?? 0);
    }, [allowedTabs]);

    useEffect(() => {
        if (activeTab !== 4) return;
        const ts = tsRef.current?.getData() ?? initialTS;
        const ls = lsRef.current?.getData() ?? initialLS;
        const xn = xnRef.current?.getData() ?? initialXN;
        const cdha = cdhaRef.current?.getData() ?? initialCDHA;
        const highest = computeHighestClassification(ts, ls, xn, cdha);
        setInitialKL((prev) => ({ ...prev, phan_loai_suc_khoe: highest }));
        setKlVersion((v) => v + 1);
    }, [activeTab]);

    const canEdit = (tabIdx) => editableTabs.includes(tabIdx);

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

            // Chỉ gửi field thay đổi (dirty) từ tab được edit
            const ts = canEdit(0)
                ? getDirty(tsRef.current?.getData() ?? initialTS, initialTS)
                : {};
            const ls = canEdit(1)
                ? getDirty(lsRef.current?.getData() ?? initialLS, initialLS)
                : {};
            const xn = canEdit(2)
                ? getDirty(xnRef.current?.getData() ?? initialXN, initialXN)
                : {};
            const cdha = canEdit(3)
                ? getDirty(
                      cdhaRef.current?.getData() ?? initialCDHA,
                      initialCDHA,
                  )
                : {};
            const kl = canEdit(4)
                ? getDirty(klRef.current?.getData() ?? initialKL, initialKL)
                : {};

            const tsFull = tsRef.current?.getData() ?? initialTS;
            const lsFull = lsRef.current?.getData() ?? initialLS;
            const xnFull = xnRef.current?.getData() ?? initialXN;
            const cdhaFull = cdhaRef.current?.getData() ?? initialCDHA;
            const klFull = klRef.current?.getData() ?? initialKL;
            kl.phan_loai_suc_khoe = computeHighestClassification(
                tsFull, lsFull, xnFull, cdhaFull,
            );

            const hasKetLuan = Boolean(
                klFull.ly_do?.trim() &&
                klFull.benh_tat_theo_doi?.trim() &&
                klFull.chi_dan_khac?.trim(),
            );
            const phieuData = {
                ma_quan_nhan: quanNhan.ma_quan_nhan,
                ma_lich_kham: maLichKham,
                nam: nam || null,
                tong_quan: JSON.stringify(ts),
                kham_lam_sang: JSON.stringify(ls),
                xet_nghiem: JSON.stringify(xn),
                chan_doan_hinh_anh: JSON.stringify(cdha),
                ket_luan: JSON.stringify(kl),
                trang_thai: hasKetLuan ? "da_kham" : "dang_kham",
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
        klVersion,
        handleSubmit,
    };
}

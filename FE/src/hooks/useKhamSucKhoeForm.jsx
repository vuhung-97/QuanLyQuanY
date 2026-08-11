import { useCallback, useEffect, useRef, useState } from "react";
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

function buildSection(canEdit, tabRef, initial) {
    return canEdit
        ? getDirty(tabRef.current?.getData() ?? initial, initial)
        : {};
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
    initialTab,
}) {
    const [activeTab, setActiveTab] = useState(0);
    const [ngayNhapNgu, setNgayNhapNgu] = useState("");
    const [saving, setSaving] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "error" });
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

    const [loadingPhieu, setLoadingPhieu] = useState(false);
    const [currentPhieu, setCurrentPhieu] = useState(existingPhieu || null);

    const isEdit = Boolean(currentPhieu);

    const handleCloseSnackbar = useCallback(() => {
        setSnackbar((s) => ({ ...s, open: false }));
    }, []);

    useEffect(() => {
        if (!open || !quanNhan) return;

        let ignore = false;
        setNgayNhapNgu(quanNhan.ngay_nhap_ngu || "");
        setSnackbar({ open: false, message: "", severity: "error" });
        setActiveTab(initialTab ?? allowedTabs[0] ?? 0);
        setLoadingPhieu(false);

        const applyPhieuData = (p) => {
            setCurrentPhieu(p || null);
            if (p) {
                setInitialTS(parseTienSu(p.tong_quan));
                setInitialLS(parseLamSang(p.kham_lam_sang));
                setInitialXN(parseXetNghiem(p.xet_nghiem));
                setInitialCDHA(
                    parseChanDoanHinhAnh(p.chan_doan_hinh_anh),
                );
                setInitialKL(parseKetLuan(p.ket_luan));
            } else {
                setInitialTS({ ...DEFAULT_TS });
                setInitialLS({ ...DEFAULT_LS });
                setInitialXN({ ...DEFAULT_XN });
                setInitialCDHA({ ...DEFAULT_CDHA });
                setInitialKL({ ...DEFAULT_KL });
            }
        };

        if (maLichKham && quanNhan.ma_quan_nhan) {
            setLoadingPhieu(true);
            khamSucKhoeService
                .getPhieuByQuanNhanAndSchedule(
                    quanNhan.ma_quan_nhan,
                    maLichKham,
                )
                .then((res) => {
                    if (!ignore) {
                        applyPhieuData(res.data);
                    }
                })
                .catch(() => {
                    if (!ignore) {
                        applyPhieuData(existingPhieu);
                    }
                })
                .finally(() => {
                    if (!ignore) setLoadingPhieu(false);
                });
        } else {
            applyPhieuData(existingPhieu);
        }

        return () => {
            ignore = true;
        };
    }, [open, quanNhan, maLichKham, existingPhieu, initialTab, allowedTabs]);

    useEffect(() => {
        setActiveTab(initialTab ?? allowedTabs[0] ?? 0);
    }, [allowedTabs, initialTab]);

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
        setSnackbar({ open: false, message: "", severity: "error" });
        try {
            if (!initialTS) {
                setSnackbar({ open: true, message: "Dữ liệu chưa sẵn sàng.", severity: "warning" });
                setSaving(false);
                return;
            }

            // Chỉ gửi field thay đổi (dirty) từ tab được edit
            const ts = buildSection(canEdit(0), tsRef, initialTS);
            const ls = buildSection(canEdit(1), lsRef, initialLS);
            const xn = buildSection(canEdit(2), xnRef, initialXN);
            const cdha = buildSection(canEdit(3), cdhaRef, initialCDHA);
            const kl = buildSection(canEdit(4), klRef, initialKL);

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
                tong_quan: ts,
                kham_lam_sang: ls,
                xet_nghiem: xn,
                chan_doan_hinh_anh: cdha,
                ket_luan: kl,
                trang_thai: hasKetLuan ? "da_kham" : "dang_kham",
            };

            let saved;
            if (isEdit) {
                saved = await khamSucKhoeService.updatePhieu(
                    currentPhieu.ma_phieu_kham,
                    phieuData,
                );
            } else {
                saved = await khamSucKhoeService.createPhieu(phieuData);
            }
            onSaved(saved.data);
            onClose();
        } catch (err) {
            setSnackbar({
                open: true,
                message: err.response?.data?.detail || "Không thể lưu phiếu khám.",
                severity: "error",
            });
        } finally {
            setSaving(false);
        }
    };

    return {
        activeTab,
        setActiveTab,
        ngayNhapNgu,
        saving,
        loadingPhieu,
        currentPhieu,
        snackbar,
        handleCloseSnackbar,
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

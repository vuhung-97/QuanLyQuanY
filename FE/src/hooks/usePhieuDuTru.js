import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import { khoDuocService } from "@/services/khoDuocService.js";
import { getCurrentUser } from "@/services/api.js";
import { STORAGE_KEY_THRESHOLDS, DEFAULT_THRESHOLDS } from "@/constants/khoConstant.js";

const EMPTY_ITEM = { tenThuoc: "", donViTinh: "", soLuong: 1, maThuocVtyt: null };
let _rowKey = 0;
const nextKey = () => ++_rowKey;

export default function usePhieuDuTru({ open, phieuId = null, mode = "create", onClose, onSaved }) {
    const [ghiChu, setGhiChu] = useState("");
    const ghiChuRef = useRef("");
    const updateField = useCallback((name, value) => {
        if (name === "ghiChu") ghiChuRef.current = value;
    }, []);
    const [saving, setSaving] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
    const [openKhoThuoc, setOpenKhoThuoc] = useState(false);
    const [savedPhieu, setSavedPhieu] = useState(null);
    const [loadingData, setLoadingData] = useState(false);
    const [ngayLap, setNgayLap] = useState(dayjs());
    const [creatorName, setCreatorName] = useState("");
    const [keys, setKeys] = useState([]);

    const itemsRef = useRef([]);
    const keysRef = useRef(keys);
    keysRef.current = keys;

    const isView = mode === "view";

    const currentUser = useMemo(() => getCurrentUser(), []);

    const getItem = useCallback((idx) => itemsRef.current[idx] || {}, []);

    useEffect(() => {
        if (!open) return;

        if (mode === "create" || !phieuId) {
            ghiChuRef.current = "";
            setGhiChu("");
            setSavedPhieu(null);
            setNgayLap(dayjs());
            setCreatorName("");
            itemsRef.current = [{ ...EMPTY_ITEM }];
            setKeys([nextKey()]);
            return;
        }

        setLoadingData(true);
        (async () => {
            try {
                const phieuRes = await khoDuocService.getPhieuDuTru(phieuId);
                const p = phieuRes.data;
                ghiChuRef.current = p.ghi_chu || "";
                setGhiChu(p.ghi_chu || "");

                const ctRes = await khoDuocService.getChiTietByPhieuDuTru(phieuId, { limit: 500 });
                const ctData = ctRes.data || [];
                const ctItems = Array.isArray(ctData) ? ctData : [];

                if (ctItems.length === 0) {
                    itemsRef.current = [{ ...EMPTY_ITEM }];
                    setKeys([nextKey()]);
                } else {
                    itemsRef.current = ctItems.map((ct) => ({
                        tenThuoc: ct.ten_thuoc_vtyt || "",
                        donViTinh: ct.don_vi_tinh || "",
                        soLuong: ct.so_luong,
                        maThuocVtyt: ct.ma_thuoc_vtyt || null,
                    }));
                    setKeys(itemsRef.current.map(() => nextKey()));
                }

                setNgayLap(p.ngay_lap_phieu ? dayjs(p.ngay_lap_phieu) : dayjs());
                setCreatorName(p.nguoi_lap_ho_ten || p.nguoi_lap || "");

                if (isView) {
                    setSavedPhieu({
                        maPhieu: phieuId,
                        ngayLap: p.ngay_lap_phieu,
                        nguoiLap: p.nguoi_lap_ho_ten || p.nguoi_lap || "",
                        ghiChu: p.ghi_chu || "",
                        items: ctItems.map((ct) => ({
                            tenThuoc: ct.ten_thuoc_vtyt || "",
                            donViTinh: ct.don_vi_tinh || "",
                            soLuong: ct.so_luong,
                        })),
                    });
                }
            } catch {
                setSnackbar({
                    open: true,
                    message: "Không thể tải phiếu dự trù.",
                    severity: "error",
                });
            } finally {
                setLoadingData(false);
            }
        })();
    }, [open, phieuId, mode, isView]);

    const updateItem = useCallback((key, field, val) => {
        const idx = keysRef.current.indexOf(key);
        if (idx === -1) return;
        itemsRef.current[idx][field] = val;
    }, []);

    const addItem = useCallback(() => {
        itemsRef.current.push({ ...EMPTY_ITEM });
        setKeys((prev) => [...prev, nextKey()]);
    }, []);

    const removeItem = useCallback((key) => {
        const idx = keysRef.current.indexOf(key);
        if (idx === -1) return;
        itemsRef.current.splice(idx, 1);
        setKeys((prev) => prev.filter((k) => k !== key));
    }, []);

    const isValid = useCallback(() => {
        const arr = itemsRef.current;
        if (arr.length === 0) return false;
        return arr.every((item) => item.tenThuoc.trim() && item.soLuong > 0);
    }, []);

    const [loadingAuto, setLoadingAuto] = useState(false);

    const handleAutoCreate = useCallback(async () => {
        if (isView) return;
        setLoadingAuto(true);
        try {
            // Lấy ngưỡng tồn kho tối thiểu từ localStorage hoặc dùng mặc định
            let thresholds = { ...DEFAULT_THRESHOLDS };
            try {
                const stored = localStorage.getItem(STORAGE_KEY_THRESHOLDS);
                if (stored) {
                    const parsed = JSON.parse(stored);
                    thresholds = {
                        thuoc: parsed.thuoc ?? DEFAULT_THRESHOLDS.thuoc,
                        vat_tu: parsed.vat_tu ?? DEFAULT_THRESHOLDS.vat_tu,
                    };
                }
            } catch (e) {
                /* ignore */
            }

            const allItems = await khoDuocService.fetchAllThuocVtyt();
            const lowStock = (allItems || []).filter((i) => {
                const qty = i.so_luong ?? 0;
                const isThuoc = i.loai !== "vat_tu";
                const limit = isThuoc ? thresholds.thuoc : thresholds.vat_tu;
                return qty < limit;
            });
            if (lowStock.length === 0) {
                setSnackbar({
                    open: true,
                    message: "Không có thuốc / VTYT nào tồn kho thấp.",
                    severity: "info",
                });
                return;
            }
            itemsRef.current = lowStock.map((i) => {
                const qty = i.so_luong ?? 0;
                const isThuoc = i.loai !== "vat_tu";
                const limit = isThuoc ? thresholds.thuoc : thresholds.vat_tu;
                return {
                    tenThuoc: i.ten_thuoc_vtyt || "",
                    donViTinh: i.don_vi_tinh || "",
                    soLuong: Math.max(1, limit - qty),
                    maThuocVtyt: i.ma_thuoc_vtyt,
                };
            });
            setKeys(itemsRef.current.map(() => nextKey()));
            setSnackbar({
                open: true,
                message: `Đã tạo tự động ${lowStock.length} dòng thuốc / VTYT tồn kho thấp.`,
                severity: "success",
            });
        } catch {
            setSnackbar({
                open: true,
                message: "Lỗi khi tải danh sách tồn kho.",
                severity: "error",
            });
        } finally {
            setLoadingAuto(false);
        }
    }, [isView]);

    const handleAddFromKhoThuoc = useCallback((selectedItems) => {
        const newKeys = [];
        for (const si of selectedItems) {
            itemsRef.current.push({
                tenThuoc: si.ten_thuoc_vtyt,
                donViTinh: si.don_vi_tinh || "",
                soLuong: si.so_luong,
                maThuocVtyt: si.ma_thuoc_vtyt,
            });
            newKeys.push(nextKey());
        }
        setKeys((prev) => [...prev, ...newKeys]);
    }, []);

    const handleSave = useCallback(async () => {
        const arr = itemsRef.current;
        if (arr.length === 0 || !arr.every((item) => item.tenThuoc.trim() && item.soLuong > 0)) {
            setSnackbar({
                open: true,
                message: "Vui lòng nhập đủ thông tin các dòng thuốc.",
                severity: "error",
            });
            return;
        }
        setSaving(true);
        try {
            const nguoiLap = currentUser?.id || null;

            if (phieuId && mode === "edit") {
                await khoDuocService.updatePhieuDuTru(phieuId, {
                    ghi_chu: ghiChuRef.current || null,
                    nguoi_lap: nguoiLap,
                    ngay_lap_phieu: ngayLap.format("YYYY-MM-DD"),
                });

                const existing = await khoDuocService.getChiTietByPhieuDuTru(phieuId, { limit: 500 });
                const oldItems = Array.isArray(existing.data) ? existing.data : [];
                for (const old of oldItems) {
                    await khoDuocService.deleteChiTietDuTru(
                        `${old.ma_phieu_du_tru},${old.ma_thuoc_vtyt}`
                    );
                }

                for (const item of arr) {
                    let maThuocVtyt = item.maThuocVtyt;
                    if (!maThuocVtyt) {
                        const res = await khoDuocService.createThuocVtyt({
                            ten_thuoc_vtyt: item.tenThuoc,
                            don_vi_tinh: item.donViTinh || null,
                        });
                        maThuocVtyt = res.data.ma_thuoc_vtyt;
                    }
                    await khoDuocService.createChiTietDuTru({
                        ma_phieu_du_tru: phieuId,
                        ma_thuoc_vtyt: maThuocVtyt,
                        so_luong: item.soLuong,
                    });
                }

                setSnackbar({
                    open: true,
                    message: "Cập nhật phiếu dự trù thành công.",
                    severity: "success",
                });
                onSaved?.();
                onClose();
                return;
            }

            const phieuRes = await khoDuocService.createPhieuDuTru({
                ghi_chu: ghiChuRef.current || null,
                trang_thai: "cho_gui",
                nguoi_lap: nguoiLap,
                ngay_lap_phieu: ngayLap.format("YYYY-MM-DD"),
            });
            const maPhieu = phieuRes.data.ma_phieu_du_tru;

            for (const item of arr) {
                let maThuocVtyt = item.maThuocVtyt;

                if (!maThuocVtyt) {
                    const res = await khoDuocService.createThuocVtyt({
                        ten_thuoc_vtyt: item.tenThuoc,
                        don_vi_tinh: item.donViTinh || null,
                    });
                    maThuocVtyt = res.data.ma_thuoc_vtyt;
                }

                await khoDuocService.createChiTietDuTru({
                    ma_phieu_du_tru: maPhieu,
                    ma_thuoc_vtyt: maThuocVtyt,
                    so_luong: item.soLuong,
                });
            }

            setSnackbar({
                open: true,
                message: "Tạo phiếu dự trù thành công.",
                severity: "success",
            });
            onSaved?.();
            onClose();
        } catch (err) {
            setSnackbar({
                open: true,
                message: err.response?.data?.detail || "Không thể tạo phiếu dự trù.",
                severity: "error",
            });
        } finally {
            setSaving(false);
        }
    }, [phieuId, mode, ngayLap, currentUser, onSaved, onClose]);

    const handleClose = useCallback(() => {
        onClose();
    }, [onClose]);

    return {
        ghiChu,
        updateField,
        keys,
        getItem,
        saving,
        loadingAuto,
        loadingData,
        snackbar,
        openKhoThuoc,
        savedPhieu,
        currentUser,
        isView,
        ngayLap,
        setNgayLap,
        creatorName,
        setOpenKhoThuoc,
        addItem,
        removeItem,
        updateItem,
        handleAddFromKhoThuoc,
        handleAutoCreate,
        handleSave,
        handleClose,
        setSnackbar,
    };
}

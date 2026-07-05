import { useCallback, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { khoDuocService } from "@/services/khoDuocService.js";
import { decodeJWT } from "@/services/api.js";

const EMPTY_ITEM = { tenThuoc: "", donViTinh: "", soLuong: 1, maThuocVtyt: null };

export default function usePhieuDuTru({ open, phieuId = null, mode = "create", onClose, onSaved }) {
    const [ghiChu, setGhiChu] = useState("");
    const [items, setItems] = useState([{ ...EMPTY_ITEM }]);
    const [saving, setSaving] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
    const [openKhoThuoc, setOpenKhoThuoc] = useState(false);
    const [savedPhieu, setSavedPhieu] = useState(null);
    const [loadingData, setLoadingData] = useState(false);
    const [ngayLap, setNgayLap] = useState(dayjs());
    const [creatorName, setCreatorName] = useState("");
    const [trangThai, setTrangThai] = useState("");

    const isView = mode === "view";

    const currentUser = useMemo(() => {
        const token = localStorage.getItem("datamed_access_token");
        return token ? decodeJWT(token) : null;
    }, []);

    useEffect(() => {
        if (!open) return;

        if (mode === "create" || !phieuId) {
            setGhiChu("");
            setItems([{ ...EMPTY_ITEM }]);
            setSavedPhieu(null);
            setNgayLap(dayjs());
            setCreatorName("");
            setTrangThai("");
            return;
        }

        setLoadingData(true);
        (async () => {
            try {
                const phieuRes = await khoDuocService.getPhieuDuTru(phieuId);
                const p = phieuRes.data;
                setGhiChu(p.ghi_chu || "");

                const ctRes = await khoDuocService.getChiTietByPhieuDuTru(phieuId);
                const ctData = ctRes.data || [];
                const ctItems = Array.isArray(ctData) ? ctData : [];

                if (ctItems.length === 0) {
                    setItems([{ ...EMPTY_ITEM }]);
                } else {
                    setItems(
                        ctItems.map((ct) => ({
                            tenThuoc: ct.ten_thuoc_vtyt || "",
                            donViTinh: ct.don_vi_tinh || "",
                            soLuong: ct.so_luong,
                            maThuocVtyt: ct.ma_thuoc_vtyt || null,
                        }))
                    );
                }

                setNgayLap(p.ngay_lap_phieu ? dayjs(p.ngay_lap_phieu) : dayjs());
                setCreatorName(p.nguoi_lap_ho_ten || p.nguoi_lap || "");
                setTrangThai(p.trang_thai || "");

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

    const addItem = () => setItems((prev) => [...prev, { ...EMPTY_ITEM }]);
    const removeItem = (idx) => setItems((prev) => prev.filter((_, i) => i !== idx));
    const updateItem = (idx, field, val) =>
        setItems((prev) => prev.map((item, i) => (i === idx ? { ...item, [field]: val } : item)));

    const isValid = () => {
        if (items.length === 0) return false;
        return items.every((item) => item.tenThuoc.trim() && item.soLuong > 0);
    };

    const handleAddFromKhoThuoc = useCallback((selectedItems) => {
        setItems((prev) => [
            ...prev,
            ...selectedItems.map((si) => ({
                tenThuoc: si.ten_thuoc_vtyt,
                donViTinh: si.don_vi_tinh || "",
                soLuong: si.so_luong,
                maThuocVtyt: si.ma_thuoc_vtyt,
            })),
        ]);
    }, []);

    const handleSave = async () => {
        if (!isValid()) return;
        setSaving(true);
        try {
            const nguoiLap = currentUser?.id || null;

            if (phieuId && mode === "edit") {
                await khoDuocService.updatePhieuDuTru(phieuId, {
                    ghi_chu: ghiChu || null,
                    nguoi_lap: nguoiLap,
                    ngay_lap_phieu: ngayLap.format("YYYY-MM-DD"),
                });

                const existing = await khoDuocService.getChiTietByPhieuDuTru(phieuId);
                const oldItems = Array.isArray(existing.data) ? existing.data : [];
                for (const old of oldItems) {
                    await khoDuocService.deleteChiTietDuTru(
                        `${old.ma_phieu_du_tru},${old.ma_thuoc_vtyt}`
                    );
                }

                for (const item of items) {
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
                ghi_chu: ghiChu || null,
                trang_thai: "chua_duyet",
                nguoi_lap: nguoiLap,
                ngay_lap_phieu: ngayLap.format("YYYY-MM-DD"),
            });
            const maPhieu = phieuRes.data.ma_phieu_du_tru;

            for (const item of items) {
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
    };

    const handleClose = () => {
        onClose();
    };

    return {
        ghiChu,
        setGhiChu,
        items,
        saving,
        loadingData,
        snackbar,
        openKhoThuoc,
        savedPhieu,
        currentUser,
        isView,
        ngayLap,
        setNgayLap,
        creatorName,
        trangThai,
        setOpenKhoThuoc,
        addItem,
        removeItem,
        updateItem,
        isValid,
        handleAddFromKhoThuoc,
        handleSave,
        handleClose,
    };
}

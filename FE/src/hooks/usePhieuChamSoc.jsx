import { useCallback, useEffect, useState } from "react";
import { noiTruService } from "@/services/noiTruService.js";
import { updateThuocCacheItem } from "./useThuocList.jsx";

export default function usePhieuChamSoc(maBenhAn) {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const [openForm, setOpenForm] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);

    const loadData = useCallback(async () => {
        if (!maBenhAn) return;
        setLoading(true);
        try {
            const res = await noiTruService.getPhieuChamSoc(maBenhAn);
            setRecords(res.data.data || []);
        } catch (err) {
            setSnackbar({
                open: true,
                message: err.response?.data?.detail || "Lỗi tải phiếu chăm sóc.",
                severity: "error",
            });
        } finally {
            setLoading(false);
        }
    }, [maBenhAn]);

    useEffect(() => { loadData(); }, [loadData]);

    const handleOpenForm = useCallback((record) => {
        setEditingRecord(record || null);
        setOpenForm(true);
    }, []);

    const handleCloseForm = useCallback(() => {
        setOpenForm(false);
        setEditingRecord(null);
    }, []);

    const handleSave = useCallback(async (data) => {
        try {
            if (editingRecord) {
                await noiTruService.updatePhieuChamSoc(editingRecord.ma_phieu_cs, data);
                const oldItems = editingRecord.chi_tiet || [];
                const newItems = data.chi_tiet || [];
                const oldMap = {};
                oldItems.forEach((ct) => {
                    oldMap[ct.ma_thuoc_vtyt] = (oldMap[ct.ma_thuoc_vtyt] || 0) + ct.so_luong;
                });
                const newMap = {};
                newItems.forEach((ct) => {
                    newMap[ct.ma_thuoc_vtyt] = (newMap[ct.ma_thuoc_vtyt] || 0) + ct.so_luong;
                });
                const allKeys = new Set([...Object.keys(oldMap), ...Object.keys(newMap)]);
                allKeys.forEach((key) => {
                    const delta = (oldMap[key] || 0) - (newMap[key] || 0);
                    if (delta !== 0) updateThuocCacheItem(key, delta);
                });
                setSnackbar({ open: true, message: "Đã cập nhật phiếu chăm sóc.", severity: "success" });
            } else {
                await noiTruService.createPhieuChamSoc({ ...data, ma_benh_an: maBenhAn });
                (data.chi_tiet || []).forEach((ct) => {
                    updateThuocCacheItem(ct.ma_thuoc_vtyt, -ct.so_luong);
                });
                setSnackbar({ open: true, message: "Đã thêm phiếu chăm sóc.", severity: "success" });
            }
            setOpenForm(false);
            setEditingRecord(null);
            await loadData();
        } catch (err) {
            setSnackbar({
                open: true,
                message: err.response?.data?.detail || "Lỗi lưu phiếu chăm sóc.",
                severity: "error",
            });
        }
    }, [editingRecord, maBenhAn, loadData]);

    return {
        records,
        loading,
        snackbar,
        setSnackbar,
        openForm,
        editingRecord,
        handleOpenForm,
        handleCloseForm,
        handleSave,
        loadData,
    };
}
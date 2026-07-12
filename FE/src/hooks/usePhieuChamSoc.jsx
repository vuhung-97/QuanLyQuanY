import { useCallback, useEffect, useState } from "react";
import { noiTruService } from "@/services/noiTruService.js";
import { clearThuocCache } from "./useThuocList.jsx";

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
                clearThuocCache();
                setSnackbar({ open: true, message: "Đã cập nhật phiếu chăm sóc.", severity: "success" });
            } else {
                await noiTruService.createPhieuChamSoc({ ...data, ma_benh_an: maBenhAn });
                clearThuocCache();
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
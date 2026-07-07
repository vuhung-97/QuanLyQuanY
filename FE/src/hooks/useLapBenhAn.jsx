import { useCallback, useEffect, useMemo, useState } from "react";

import { noiTruService } from "@/services/noiTruService.js";

export default function useLapBenhAn() {
    const [examinations, setExaminations] = useState([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchText, setSearchText] = useState("");

    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    const [openForm, setOpenForm] = useState(false);
    const [selectedExam, setSelectedExam] = useState(null);
    const [saving, setSaving] = useState(false);

    const loadData = useCallback(async () => {
        setRefreshing(true);
        try {
            const res = await noiTruService.getDanhSachNhapVien({ limit: 500, offset: 0 });
            setExaminations(res.data.data || []);
        } catch (err) {
            setSnackbar({
                open: true,
                message: err.response?.data?.detail || "Lỗi tải danh sách nhập viện.",
                severity: "error",
            });
        } finally {
            setRefreshing(false);
            setInitialLoading(false);
        }
    }, []);

    useEffect(() => { loadData(); }, [loadData]);

    const filtered = useMemo(() => {
        if (!searchText) return examinations;
        const q = searchText.toLowerCase();
        return examinations.filter(
            (e) =>
                (e.ma_kham_benh || "").toLowerCase().includes(q) ||
                (e.ho_ten || "").toLowerCase().includes(q) ||
                (e.ten_don_vi || "").toLowerCase().includes(q),
        );
    }, [examinations, searchText]);

    const handleOpenForm = useCallback((exam) => {
        setSelectedExam(exam);
        setOpenForm(true);
    }, []);

    const handleCloseForm = useCallback(() => {
        setOpenForm(false);
        setSelectedExam(null);
    }, []);

    const handleLapBenhAn = useCallback(async (data) => {
        if (!selectedExam) return;
        setSaving(true);
        try {
            await noiTruService.createBenhAn({
                ...data,
                ma_kham_benh: selectedExam.ma_kham_benh,
            });
            setSnackbar({
                open: true,
                message: "Đã lập bệnh án nội trú thành công.",
                severity: "success",
            });
            setOpenForm(false);
            setSelectedExam(null);
            loadData();
        } catch (err) {
            setSnackbar({
                open: true,
                message: err.response?.data?.detail || "Lỗi lập bệnh án.",
                severity: "error",
            });
        } finally {
            setSaving(false);
        }
    }, [selectedExam, loadData]);

    return {
        initialLoading,
        refreshing,
        searchText,
        setSearchText,
        filtered,
        snackbar,
        setSnackbar,
        openForm,
        selectedExam,
        handleOpenForm,
        handleCloseForm,
        handleLapBenhAn,
        saving,
        loadData,

    };
}
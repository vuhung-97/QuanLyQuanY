import { useState, useEffect, useCallback } from "react";
import { baoCaoService } from "@/services/baoCaoService.js";

export default function useBaoCaoTonKho() {
    const now = new Date();
    const [thang, setThang] = useState(now.getMonth() + 1);
    const [nam, setNam] = useState(now.getFullYear());
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await baoCaoService.getTonKho(thang, nam);
            setData(res.data);
        } catch (err) {
            setError(err.response?.data?.detail || "Lỗi tải báo cáo tồn kho");
        } finally {
            setLoading(false);
        }
    }, [thang, nam]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleExport = useCallback(async () => {
        try {
            const res = await baoCaoService.exportTonKho(thang, nam);
            const url = URL.createObjectURL(res.data);
            const a = document.createElement("a");
            a.href = url;
            a.download = `BC_ton_kho_${nam}_${String(thang).padStart(2, "0")}.xlsx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            setError(err.response?.data?.detail || "Lỗi xuất Excel");
        }
    }, [thang, nam]);

    return {
        thang, setThang, nam, setNam,
        data, loading, error,
        fetchData, handleExport,
    };
}

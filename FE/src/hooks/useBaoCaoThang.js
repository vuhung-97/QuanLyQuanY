import { useState, useEffect, useCallback } from "react";
import { baoCaoService } from "@/services/baoCaoService.js";
import { setDeferred } from "@/utils/setDeferred.js";

export default function useBaoCaoThang() {
    const now = new Date();
    const [thang, setThang] = useState(now.getMonth() + 1);
    const [nam, setNam] = useState(now.getFullYear());
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [printOpen, setPrintOpen] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = thang
                ? await baoCaoService.getQuanYThang(thang, nam)
                : await baoCaoService.getQuanYNam(nam);
            setDeferred(setData, res.data);
        } catch (err) {
            setError(err.response?.data?.detail || "Lỗi tải báo cáo");
            setDeferred(setData, null);
        } finally {
            setLoading(false);
        }
    }, [thang, nam]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        thang, setThang, nam, setNam,
        data, loading, error,
        fetchData,
        printOpen, setPrintOpen,
    };
}

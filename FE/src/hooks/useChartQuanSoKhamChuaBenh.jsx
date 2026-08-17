import { useState, useEffect, useCallback } from "react";
import api from "@/services/api.js";
import { setDeferred } from "@/utils/setDeferred.js";

export default function useChartQuanSoKhamChuaBenh() {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    const [isLeft, setIsLeft] = useState(false);
    const [endDate, setEndDate] = useState(todayStr);
    const [nam, setNam] = useState(today.getFullYear());
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFilterModeChange = useCallback(() => {
        setIsLeft(prev => !prev);
    }, []);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = isLeft ? { mode: "month", nam } : { mode: "day", end_date: endDate };
            const res = await api.get("/bao-cao/quan-so-kham-chua-benh", { params });
            setDeferred(setData, res.data.data);
        } catch (err) {
            setError(err.response?.data?.detail || "Không thể tải dữ liệu biểu đồ");
        } finally {
            setLoading(false);
        }
    }, [isLeft, endDate, nam]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        isLeft,
        endDate, setEndDate,
        nam, setNam,
        data, loading, error,
        fetchData,
        handleFilterModeChange,
    };
}
import { useEffect, useState, useMemo } from "react";
import { dashboardService } from "@/services/dashboardService.js";
import { setDeferred } from "@/utils/setDeferred.js";

export default function useDashboardStats() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dashboardService
            .getTongQuan()
            .then((res) => setDeferred(setStats, res.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const flatStats = useMemo(() => {
        if (!stats) return {};
        return {
            luot_kham: stats.hom_nay.luot_kham,
            noi_tru: stats.hom_nay.noi_tru,
            chuyen_tuyen: stats.hom_nay.chuyen_tuyen,
            don_thuoc: stats.hom_nay.don_thuoc,
            tong_giuong: stats.tong_quan.tong_giuong,
            giuong_trong: stats.tong_quan.giuong_trong,
            tong_quan_so: stats.tong_quan.tong_quan_so,
            ...stats.cho_xu_ly,
        };
    }, [stats]);

    return { flatStats, loading };
}

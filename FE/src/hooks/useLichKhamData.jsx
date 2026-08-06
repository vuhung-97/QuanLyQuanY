import { useCallback, useEffect, useMemo, useState } from "react";
import { khamSucKhoeService } from "@/services/khamSucKhoeService.js";
import { fallbackSchedules } from "@/constants/khamSucKhoeConstants.js";
import { getScheduleStatus } from "@/components/KhamSucKhoe/KhamSucKhoeUtils.js";

export default function useLichKhamData() {
    const [schedules, setSchedules] = useState([]);
    const [chiTietMap, setChiTietMap] = useState({});
    const [unitStats, setUnitStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [refreshCounter, setRefreshCounter] = useState(0);

    const loadSchedules = useCallback(() => {
        let ignore = false;
        async function load() {
            setLoading(true);
            setError("");
            try {
                const [schRes, uvRes] = await Promise.all([
                    khamSucKhoeService.getScheduleList(),
                    khamSucKhoeService.getDonViList(),
                ]);
                if (ignore) return;
                const masterList = Array.isArray(schRes.data)
                    ? schRes.data
                    : [];

                const ctMap = {};
                await Promise.all(
                    masterList.map(async (m) => {
                        try {
                            const ctRes =
                                await khamSucKhoeService.getScheduleDetail(
                                    m.ma_lich_kham,
                                );
                            ctMap[m.ma_lich_kham] = Array.isArray(ctRes.data)
                                ? ctRes.data
                                : [];
                        } catch {
                            ctMap[m.ma_lich_kham] = [];
                        }
                    }),
                );
                if (!ignore) {
                    setSchedules(masterList);
                    setUnitStats(Array.isArray(uvRes.data) ? uvRes.data : []);
                    setChiTietMap(ctMap);
                    setRefreshCounter((c) => c + 1);
                }
            } catch (err) {
                if (!ignore) {
                    setError(
                        err.response?.data?.detail ||
                            "Chưa tải được dữ liệu lịch khám từ API.",
                    );
                    setSchedules(fallbackSchedules);
                }
            } finally {
                if (!ignore) setLoading(false);
            }
        }
        load();
        return () => {
            ignore = true;
        };
    }, []);

    useEffect(loadSchedules, [loadSchedules]);

    const latestSchedule = useMemo(() => {
        const approved = schedules.filter((s) => s.trang_thai === "da_duyet");
        if (approved.length === 0) return null;
        const dangThucHien = approved.find(
            (s) => getScheduleStatus(s) === "Đang thực hiện",
        );
        if (dangThucHien) return dangThucHien;
        const now = new Date();
        const upcoming = approved
            .filter((s) => new Date(s.thoi_gian_bat_dau) > now)
            .sort(
                (a, b) =>
                    new Date(a.thoi_gian_bat_dau) -
                    new Date(b.thoi_gian_bat_dau),
            );
        return upcoming.length > 0 ? upcoming[0] : null;
    }, [schedules]);

    const latestStatus = latestSchedule
        ? getScheduleStatus(latestSchedule)
        : "";

    const unitOptions = useMemo(
        () => (unitStats ?? []).filter((u) => !u.ma_don_vi_truc_thuoc),
        [unitStats],
    );

    return {
        schedules,
        chiTietMap,
        unitStats,
        unitOptions,
        loading,
        error,
        setError,
        latestSchedule,
        latestStatus,
        loadSchedules,
        refreshCounter,
    };
}

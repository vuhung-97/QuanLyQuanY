import { useCallback, useEffect, useMemo, useState } from "react";
import {
    CalendarMonth as CalendarIcon,
    EventAvailable as EventAvailableIcon,
    Groups as GroupsIcon,
} from "@mui/icons-material";
import { khamSucKhoeService } from "@/services/khamSucKhoeService.js";
import { fallbackSchedules } from "@/constants/khamSucKhoeConstants.js";
import { formatDate } from "@/utils/date.js";
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
                            const ctRes = await khamSucKhoeService.getScheduleDetail(m.ma_lich_kham);
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
                    setRefreshCounter(c => c + 1);
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

    const allDetails = useMemo(
        () => Object.values(chiTietMap).flat(),
        [chiTietMap],
    );

    const nearestDetail = useMemo(() => {
        const items = Object.values(chiTietMap)
            .flat()
            .filter((d) => d.thoi_gian_bat_dau);
        if (items.length === 0) return null;
        const now = new Date();
        return items.reduce((a, b) =>
            Math.abs(new Date(b.thoi_gian_bat_dau) - now) <
            Math.abs(new Date(a.thoi_gian_bat_dau) - now)
                ? b
                : a,
        );
    }, [chiTietMap]);

    const scheduleStats = useMemo(() => {
        const tong = schedules.length;
        const dangThucHien = schedules.filter(
            (s) => getScheduleStatus(s) === "Đang thực hiện",
        ).length;
        return { tong, dangThucHien };
    }, [schedules]);

    const summaryItems = useMemo(() => {
        const totalQn = unitStats
            ? unitStats.reduce((s, u) => s + (u.quan_so || 0), 0)
            : 0;
        const tongDonViTrongLich = new Set(
            allDetails.map((d) => d.ma_don_vi).filter(Boolean),
        ).size;

        return [
            {
                label: "Tổng quân số",
                value: totalQn,
                note: "Toàn đơn vị",
                color: "primary.main",
                bg: "rgba(11, 59, 96, 0.1)",
                icon: <GroupsIcon />,
            },
            {
                label: "Phòng, Hải đội",
                value: tongDonViTrongLich,
                note: tongDonViTrongLich ? "Đã có lịch" : "Chưa có lịch",
                color: "secondary.main",
                bg: "rgba(0, 180, 216, 0.12)",
                icon: <EventAvailableIcon />,
            },
            {
                label: "Thời gian khám",
                value: nearestDetail
                    ? `${formatDate(nearestDetail.thoi_gian_bat_dau)} - ${formatDate(nearestDetail.thoi_gian_ket_thuc)}`
                    : "Chưa có",
                note: "",
                color: "success.main",
                bg: "rgba(16, 185, 129, 0.12)",
                icon: <CalendarIcon />,
            },
        ];
    }, [unitStats, allDetails, nearestDetail]);

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
        allDetails,
        nearestDetail,
        scheduleStats,
        summaryItems,
        loadSchedules,
        refreshCounter,
    };
}

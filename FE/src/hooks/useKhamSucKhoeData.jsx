import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { khamSucKhoeService } from "@/services/khamSucKhoeService.js";
import { fetchAllPages } from "@/utils/fetchAll.js";
import { getScheduleStatus } from "@/components/KhamSucKhoe/KhamSucKhoeUtils.js";

export default function useKhamSucKhoeData() {
    const [schedules, setSchedules] = useState([]);
    const [units, setUnits] = useState([]);
    const [soldiers, setSoldiers] = useState([]);
    const [phieuMap, setPhieuMap] = useState({});
    const [allSoldiers, setAllSoldiers] = useState([]);
    const [allPhieuMap, setAllPhieuMap] = useState({});
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [allUnitLookup, setAllUnitLookup] = useState(new Map());
    const [unitChildrenMap, setUnitChildrenMap] = useState(new Map());

    function getDescendantCodes(maDonVi) {
        const codes = [maDonVi];
        for (const child of unitChildrenMap.get(maDonVi) || []) {
            codes.push(...getDescendantCodes(child));
        }
        return codes;
    }

    const [searchParams] = useSearchParams();
    const [filters, setFilters] = useState(() => ({
        schedule: searchParams.get("schedule") || "",
        unit: searchParams.get("unit") || "",
        filterModeLeft: false,
    }));

    const {
        schedule: selectedSchedule,
        unit: selectedUnit,
        filterModeLeft,
    } = filters;

    const selectedScheduleObj = useMemo(
        () =>
            schedules.find((s) => s.ma_lich_kham === selectedSchedule) || null,
        [schedules, selectedSchedule],
    );

    const setSelectedSchedule = useCallback((s) => {
        setFilters((prev) => ({ ...prev, schedule: s }));
    }, []);

    const setSelectedUnit = useCallback((u) => {
        setFilters((prev) => ({ ...prev, unit: u }));
    }, []);

    useEffect(() => {
        khamSucKhoeService
            .getDonViList()
            .then((res) => {
                const list = Array.isArray(res.data) ? res.data : [];
                setAllUnitLookup(
                    new Map(list.map((u) => [u.ma_don_vi, u.ten_don_vi])),
                );
                const cm = new Map();
                for (const u of list) {
                    if (u.ma_don_vi_truc_thuoc) {
                        const parent = u.ma_don_vi_truc_thuoc;
                        if (!cm.has(parent)) cm.set(parent, []);
                        cm.get(parent).push(u.ma_don_vi);
                    }
                }
                setUnitChildrenMap(cm);
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        let ignore = false;
        async function load() {
            try {
                const res = await khamSucKhoeService.getScheduleList();
                if (!ignore) {
                    const data = Array.isArray(res.data) ? res.data : [];
                    setSchedules(data.filter(s => s.trang_thai === "da_duyet"));
                }
            } catch {}
        }
        load();
        return () => {
            ignore = true;
        };
    }, []);

    useEffect(() => {
        if (!selectedSchedule) {
            setStats(null);
            setUnits([]);
            return;
        }
        let ignore = false;
        async function load() {
            try {
                const res =
                    await khamSucKhoeService.getScheduleStats(selectedSchedule);
                if (!ignore) {
                    setStats(res.data);
                    setUnits(res.data.danh_sach_don_vi || []);
                }
            } catch {
                if (!ignore) setStats(null);
            }
        }
        load();
        return () => {
            ignore = true;
        };
    }, [selectedSchedule]);

    const refreshStats = useCallback(async () => {
        if (!selectedSchedule) return;
        try {
            const res =
                await khamSucKhoeService.getScheduleStats(selectedSchedule);
            setStats(res.data);
            setUnits(res.data.danh_sach_don_vi || []);
        } catch {}
    }, [selectedSchedule]);

    useEffect(() => {
        if (!selectedSchedule) {
            setAllSoldiers([]);
            setAllPhieuMap({});
            setSoldiers([]);
            setPhieuMap({});
            setLoading(false);
            return;
        }
        let ignore = false;
        async function load() {
            setLoading(true);
            try {
                const [qnList, pList] = await Promise.all([
                    fetchAllPages(`/quan_nhan/lich-kham/${selectedSchedule}`),
                    fetchAllPages(
                        `/phieu_kham_suc_khoe/lich-kham/${selectedSchedule}`,
                    ),
                ]);
                if (!ignore) {
                    const pm = pList.reduce((acc, p) => {
                        acc[p.ma_quan_nhan] = p;
                        return acc;
                    }, {});
                    setAllSoldiers(qnList);
                    setAllPhieuMap(pm);
                }
            } catch {
            } finally {
                if (!ignore) setLoading(false);
            }
        }
        load();
        return () => {
            ignore = true;
        };
    }, [selectedSchedule]);

    useEffect(() => {
        if (!selectedUnit) {
            setSoldiers([]);
            setPhieuMap({});
            return;
        }
        if (allSoldiers.length === 0) return;

        if (selectedUnit === "__ALL__") {
            setSoldiers(allSoldiers);
            setPhieuMap(allPhieuMap);
        } else {
            const codes = getDescendantCodes(selectedUnit);
            const filtered = allSoldiers.filter((s) =>
                codes.includes(s.ma_don_vi),
            );
            const pm = {};
            for (const s of filtered) {
                const p = allPhieuMap[s.ma_quan_nhan];
                if (p) pm[s.ma_quan_nhan] = p;
            }
            setSoldiers(filtered);
            setPhieuMap(pm);
        }
    }, [selectedUnit, allSoldiers, allPhieuMap, unitChildrenMap]);

    const filteredSchedules = useMemo(
        () =>
            filterModeLeft
                ? schedules
                : schedules.filter(
                      (s) => getScheduleStatus(s) === "Đang thực hiện",
                  ),
        [schedules, filterModeLeft],
    );

    const handleFilterModeChange = useCallback(() => {
        setFilters((prev) => ({
            filterModeLeft: !prev.filterModeLeft,
            schedule: "",
            unit: "",
        }));
    }, []);

    const handleScheduleChange = useCallback((scheduleId) => {
        setFilters((prev) => ({ ...prev, schedule: scheduleId, unit: "" }));
    }, []);

    return {
        schedules,
        units,
        soldiers,
        phieuMap,
        allPhieuMap,
        setPhieuMap,
        setAllPhieuMap,
        stats,
        loading,
        allUnitLookup,
        selectedSchedule,
        selectedUnit,
        selectedScheduleObj,
        filterModeLeft,
        filteredSchedules,
        setSelectedSchedule,
        setSelectedUnit,
        handleFilterModeChange,
        handleScheduleChange,
        refreshStats,
    };
}

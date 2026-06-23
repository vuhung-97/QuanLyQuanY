import { useCallback, useEffect, useMemo, useState } from "react";
import { khamSucKhoeService } from "@/services/khamSucKhoeService.js";

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
        for (const child of (unitChildrenMap.get(maDonVi) || [])) {
            codes.push(...getDescendantCodes(child));
        }
        return codes;
    }

    const [filters, setFilters] = useState({
        schedule: "",
        unit: "",
        year: "",
    });

    const { schedule: selectedSchedule, unit: selectedUnit, year: selectedYear } = filters;

    const selectedScheduleObj = useMemo(
        () => schedules.find((s) => s.ma_lich_kham === selectedSchedule) || null,
        [schedules, selectedSchedule],
    );

    const setSelectedSchedule = useCallback((s) => {
        setFilters((prev) => ({ ...prev, schedule: s }));
    }, []);

    const setSelectedUnit = useCallback((u) => {
        setFilters((prev) => ({ ...prev, unit: u }));
    }, []);

    const setSelectedYear = useCallback((y) => {
        setFilters((prev) => ({ ...prev, year: y }));
    }, []);

    useEffect(() => {
        khamSucKhoeService.getDonViList()
            .then((res) => {
                const list = Array.isArray(res.data) ? res.data : [];
                setAllUnitLookup(new Map(list.map((u) => [u.ma_don_vi, u.ten_don_vi])));
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
                    setSchedules(data);
                    const currentYear = String(new Date().getFullYear());
                    const hasCurrentYear = data.some(
                        (s) =>
                            s.thoi_gian_bat_dau &&
                            new Date(s.thoi_gian_bat_dau).getFullYear() ===
                                Number(currentYear),
                    );
                    setSelectedYear(hasCurrentYear ? currentYear : "");
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
                const res = await khamSucKhoeService.getScheduleStats(selectedSchedule);
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
            const res = await khamSucKhoeService.getScheduleStats(selectedSchedule);
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
                const [qnRes, pRes] = await Promise.all([
                    khamSucKhoeService.getSoldiersBySchedule(selectedSchedule),
                    khamSucKhoeService.getPhieuBySchedule(selectedSchedule),
                ]);
                if (!ignore) {
                    const qnList = Array.isArray(qnRes.data) ? qnRes.data : [];
                    const pList = Array.isArray(pRes.data) ? pRes.data : [];
                    const pm = pList.reduce((acc, p) => { acc[p.ma_quan_nhan] = p; return acc; }, {});
                    setAllSoldiers(qnList);
                    setAllPhieuMap(pm);
                }
            } catch {} finally {
                if (!ignore) setLoading(false);
            }
        }
        load();
        return () => { ignore = true; };
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
            const filtered = allSoldiers.filter((s) => codes.includes(s.ma_don_vi));
            const pm = {};
            for (const s of filtered) {
                const p = allPhieuMap[s.ma_quan_nhan];
                if (p) pm[s.ma_quan_nhan] = p;
            }
            setSoldiers(filtered);
            setPhieuMap(pm);
        }
    }, [selectedUnit, allSoldiers, allPhieuMap, unitChildrenMap]);

    const years = useMemo(
        () =>
            [
                ...new Set(
                    schedules
                        .map((s) =>
                            s.thoi_gian_bat_dau
                                ? new Date(s.thoi_gian_bat_dau).getFullYear()
                                : null,
                        )
                        .filter(Boolean),
                ),
            ].sort((a, b) => b - a),
        [schedules],
    );

    const filteredSchedules = useMemo(
        () =>
            selectedYear
                ? schedules.filter((s) => {
                      const y = s.thoi_gian_bat_dau
                          ? new Date(s.thoi_gian_bat_dau).getFullYear()
                          : null;
                      return y === Number(selectedYear);
                  })
                : schedules,
        [schedules, selectedYear],
    );

    const handleYearChange = useCallback((year) => {
        setFilters({ year, schedule: "", unit: "" });
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
        selectedYear,
        years,
        filteredSchedules,
        setSelectedYear,
        setSelectedSchedule,
        setSelectedUnit,
        handleYearChange,
        handleScheduleChange,
        refreshStats,
    };
}

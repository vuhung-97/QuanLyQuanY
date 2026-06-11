import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../services/api.js";

export default function useHealthCheckData() {
    const [schedules, setSchedules] = useState([]);
    const [units, setUnits] = useState([]);
    const [soldiers, setSoldiers] = useState([]);
    const [phieuMap, setPhieuMap] = useState({});
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [allUnitLookup, setAllUnitLookup] = useState(new Map());

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
        api.get("/thong-ke/don-vi")
            .then((res) => {
                const list = Array.isArray(res.data) ? res.data : [];
                setAllUnitLookup(new Map(list.map((u) => [u.ma_don_vi, u.ten_don_vi])));
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        let ignore = false;
        async function load() {
            try {
                const res = await api.get("/lich_kham_sk_nam", {
                    params: { limit: 100 },
                });
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
                const res = await api.get(
                    `/thong-ke/lich-kham/${selectedSchedule}`,
                );
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

    useEffect(() => {
        if (!selectedUnit) {
            setSoldiers([]);
            setPhieuMap({});
            setLoading(false);
            return;
        }
        let ignore = false;
        async function load() {
            setLoading(true);
            try {
                if (selectedUnit === "__ALL__") {
                    const [qnRes, pRes] = await Promise.all([
                        api.get(`/quan_nhan/by-lich-kham/${selectedSchedule}`),
                        api.get(`/phieu_kham_suc_khoe/latest-by-lich-kham/${selectedSchedule}`),
                    ]);
                    if (!ignore) {
                        setSoldiers(Array.isArray(qnRes.data) ? qnRes.data : []);
                        const pList = Array.isArray(pRes.data) ? pRes.data : [];
                        const phieuData = pList.reduce((acc, p) => {
                            acc[p.ma_quan_nhan] = p;
                            return acc;
                        }, {});
                        setPhieuMap(phieuData);
                    }
                } else {
                    const qnRes = await api.get(
                        `/quan_nhan/by-don-vi/${selectedUnit}`,
                    );
                    const qnList = Array.isArray(qnRes.data) ? qnRes.data : [];
                    if (ignore) return;

                    let phieuData = {};
                    try {
                        const pRes = await api.get(
                            `/phieu_kham_suc_khoe/latest-by-unit/${selectedUnit}`,
                        );
                        const list = Array.isArray(pRes.data) ? pRes.data : [];
                        phieuData = {};
                        for (const p of list) {
                            phieuData[p.ma_quan_nhan] = p;
                        }
                    } catch {}
                    if (!ignore) {
                        setSoldiers(qnList);
                        setPhieuMap(phieuData);
                    }
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
    }, [selectedUnit, selectedSchedule]);

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
        setPhieuMap,
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
    };
}

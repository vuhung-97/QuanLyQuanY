import { useEffect, useState } from "react";
import { khamSucKhoeService } from "@/services/khamSucKhoeService.js";
import { getScheduleStatus } from "@/components/KhamSucKhoe/KhamSucKhoeUtils.js";

export default function useMyTemporaryRole() {
    const [assignment, setAssignment] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let ignore = false;
        async function load() {
            setLoading(true);
            try {
                const res = await khamSucKhoeService.getScheduleList();
                const list = Array.isArray(res.data) ? res.data : [];
                const active = list
                    .filter(
                        (s) =>
                            s.trang_thai === "da_duyet" &&
                            getScheduleStatus(s) === "Đang thực hiện",
                    )
                    .sort(
                        (a, b) =>
                            new Date(b.thoi_gian_bat_dau) -
                            new Date(a.thoi_gian_bat_dau),
                    )[0];
                if (ignore) return;
                if (!active) {
                    setAssignment(null);
                    return;
                }
                const myRes = await khamSucKhoeService.getMyAssignment(
                    active.ma_lich_kham,
                );
                if (!ignore) setAssignment(myRes.data || null);
            } catch {
                if (!ignore) setAssignment(null);
            } finally {
                if (!ignore) setLoading(false);
            }
        }
        load();
        return () => {
            ignore = true;
        };
    }, []);

    return { assignment, loading };
}
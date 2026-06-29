import { useEffect, useState } from "react";
import { khamSucKhoeService } from "@/services/khamSucKhoeService.js";

export default function usePhanCongNhiemVu(scheduleId) {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!scheduleId) {
            setAssignments([]);
            return;
        }
        let ignore = false;
        async function load() {
            setLoading(true);
            try {
                const res = await khamSucKhoeService.getAssignments(scheduleId);
                if (!ignore) {
                    setAssignments(Array.isArray(res.data) ? res.data : []);
                }
            } catch {
                if (!ignore) setAssignments([]);
            } finally {
                if (!ignore) setLoading(false);
            }
        }
        load();
        return () => {
            ignore = true;
        };
    }, [scheduleId]);

    return { assignments, loading };
}

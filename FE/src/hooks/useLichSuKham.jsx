import { useEffect, useState } from "react";
import { khamSucKhoeService } from "@/services/khamSucKhoeService.js";

export default function useLichSuKham(open, quanNhan) {
    const [phieuList, setPhieuList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open || !quanNhan) return;
        setLoading(true);
        khamSucKhoeService.getPhieuByMaQuanNhan(quanNhan.ma_quan_nhan)
            .then((res) =>
                setPhieuList(Array.isArray(res.data) ? res.data : []),
            )
            .catch(() => setPhieuList([]))
            .finally(() => setLoading(false));
    }, [open, quanNhan]);

    return { phieuList, loading };
}

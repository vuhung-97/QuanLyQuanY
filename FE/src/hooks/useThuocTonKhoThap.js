import { useEffect, useState, useMemo } from "react";
import { khoDuocService } from "@/services/khoDuocService.js";

export default function useThuocTonKhoThap(thresholds) {
    const [allItems, setAllItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let ignore = false;
        khoDuocService
            .fetchAllThuocVtyt()
            .then((data) => {
                if (!ignore) setAllItems(Array.isArray(data) ? data : []);
            })
            .catch(() => {
                if (!ignore) setAllItems([]);
            })
            .finally(() => {
                if (!ignore) setLoading(false);
            });
        return () => {
            ignore = true;
        };
    }, []);

    const value = useMemo(() => {
        const thuocThap = allItems.filter(
            (i) => (i.so_luong ?? 0) < thresholds.thuoc && i.loai !== "vat_tu",
        ).length;
        const vtytThap = allItems.filter(
            (i) => (i.so_luong ?? 0) < thresholds.vat_tu && i.loai === "vat_tu",
        ).length;
        return thuocThap + vtytThap;
    }, [allItems, thresholds.thuoc, thresholds.vat_tu]);

    return { value, loading };
}
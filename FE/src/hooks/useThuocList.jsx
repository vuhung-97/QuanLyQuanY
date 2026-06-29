import { useCallback, useRef } from "react";
import { khamBenhService } from "@/services/khamBenhService.js";

let sharedCache = null;

export default function useThuocList() {
    const cacheRef = useRef(sharedCache);

    const fetchAll = useCallback(async () => {
        if (cacheRef.current) return cacheRef.current;
        const LIMIT = 500;
        let offset = 0;
        let all = [];
        while (true) {
            const res = await khamBenhService.listThuoc({
                limit: LIMIT,
                offset,
                sort_by: "phan_loai",
            });
            const items = res.data || [];
            if (items.length === 0) break;
            all = all.concat(items);
            if (items.length < LIMIT) break;
            offset += LIMIT;
        }
        sharedCache = all;
        cacheRef.current = all;
        return all;
    }, []);

    const searchThuoc = useCallback(async (keyword) => {
        const res = await khamBenhService.searchThuoc(keyword);
        return res.data || [];
    }, []);

    const getCache = useCallback(() => cacheRef.current || [], []);

    return { fetchAll, searchThuoc, getCache };
}

export function clearThuocCache() {
    sharedCache = null;
}

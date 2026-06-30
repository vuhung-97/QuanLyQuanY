import { useCallback, useRef } from "react";
import { khamBenhService } from "@/services/khamBenhService.js";

let sharedCache = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 5 * 60 * 1000;

export default function useThuocList() {
    const cacheRef = useRef(sharedCache);
    const fetchTimeRef = useRef(lastFetchTime);

    const fetchAll = useCallback(async ({ force } = {}) => {
        const now = Date.now();
        if (!force && cacheRef.current && (now - fetchTimeRef.current) < CACHE_TTL_MS) {
            return cacheRef.current;
        }
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
        lastFetchTime = Date.now();
        cacheRef.current = all;
        fetchTimeRef.current = lastFetchTime;
        return all;
    }, []);

    const refreshAll = useCallback(() => fetchAll({ force: true }), [fetchAll]);

    const searchThuoc = useCallback(async (keyword) => {
        const res = await khamBenhService.searchThuoc(keyword);
        return res.data || [];
    }, []);

    const getCache = useCallback(() => cacheRef.current || [], []);

    return { fetchAll, refreshAll, searchThuoc, getCache, clearThuocCache };
}

export function clearThuocCache() {
    sharedCache = null;
    lastFetchTime = 0;
}

export function updateThuocCacheItem(maThuocVtyt, delta) {
    if (!sharedCache) return;
    for (const item of sharedCache) {
        if (item.ma_thuoc_vtyt === maThuocVtyt) {
            item.so_luong = (item.so_luong || 0) + delta;
            break;
        }
    }
}

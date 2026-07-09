import { useCallback } from "react";
import { khamBenhService } from "@/services/khamBenhService.js";
import useStaticList, {
    ensureCached,
    getCacheValue,
    invalidateCache,
    updateCacheItem,
} from "@/hooks/useStaticList.js";

const CACHE_URL = "/thuoc_vtyt";
const CACHE_PARAMS = { sort_by: "phan_loai" };
const PAGE_SIZE = 500;

export default function useThuocList() {
    useStaticList(CACHE_URL, {
        params: CACHE_PARAMS,
        pageSize: PAGE_SIZE,
    });

    const fetchAll = useCallback(async ({ force } = {}) => {
        if (force) invalidateCache(CACHE_URL);
        return ensureCached(CACHE_URL, CACHE_PARAMS, PAGE_SIZE);
    }, []);

    const refreshAll = useCallback(() => fetchAll({ force: true }), [fetchAll]);

    const searchThuoc = useCallback(async (keyword) => {
        const res = await khamBenhService.searchThuoc(keyword);
        return res.data || [];
    }, []);

    const getCache = useCallback(() => getCacheValue(CACHE_URL), []);

    return { fetchAll, refreshAll, searchThuoc, getCache, clearThuocCache };
}

export function clearThuocCache() {
    invalidateCache(CACHE_URL);
}

export function updateThuocCacheItem(maThuocVtyt, delta) {
    updateCacheItem(CACHE_URL, "ma_thuoc_vtyt", maThuocVtyt, "so_luong", delta);
}

import { useEffect, useState } from "react";
import api from "@/services/api.js";

const _cache = new Map();
const _pending = new Map();

export default function useStaticList(url, { params, transform, pageSize } = {}) {
    const [data, setData] = useState(() => _cache.get(url) || []);

    useEffect(() => {
        if (_cache.has(url)) return;
        if (_pending.has(url)) {
            _pending.get(url).then(setData);
            return;
        }
        const promise = fetchAllPages(url, params, pageSize, transform);
        _pending.set(url, promise);
    }, [url]);

    return data;
}

async function fetchAllPages(url, params, pageSize, transform) {
    try {
        const all = [];
        const limit = pageSize || 200;
        let offset = 0;
        while (true) {
            const res = await api.get(url, { params: { ...params, limit, offset } });
            const raw = Array.isArray(res.data) ? res.data : res.data?.data || [];
            if (raw.length === 0) break;
            const items = transform ? raw.map(transform) : raw;
            all.push(...items);
            if (items.length < limit) break;
            offset += limit;
        }
        _cache.set(url, all);
        return all;
    } catch {
        return [];
    }
}

export async function ensureCached(url, params, pageSize, transform) {
    if (_cache.has(url)) return _cache.get(url);
    if (_pending.has(url)) return _pending.get(url);
    const promise = fetchAllPages(url, params, pageSize, transform)
        .then((result) => {
            _cache.set(url, result);
            return result;
        });
    _pending.set(url, promise);
    return promise;
}

export function invalidateCache(url) {
    _cache.delete(url);
    _pending.delete(url);
}

export function getCacheValue(url) {
    return _cache.get(url) || [];
}

export function updateCacheItem(url, idField, idValue, field, delta) {
    const items = _cache.get(url);
    if (!items) return;
    for (const item of items) {
        if (item[idField] === idValue) {
            item[field] = (item[field] || 0) + delta;
            break;
        }
    }
}

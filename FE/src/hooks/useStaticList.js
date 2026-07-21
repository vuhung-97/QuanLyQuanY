import { useCallback, useEffect, useRef, useState } from "react";
import api from "@/services/api.js";

const _cache = new Map();
const _pending = new Map();

export default function useStaticList(url, { params, transform, pageSize, version = 0 } = {}) {
    const transformRef = useRef(transform);
    useEffect(() => {
        transformRef.current = transform;
    });

    const applyTransform = useCallback((raw) => {
        const t = transformRef.current;
        return t ? raw.map(t) : raw;
    }, []);

    const [data, setData] = useState(() => {
        const raw = _cache.get(url);
        return raw ? applyTransform(raw) : [];
    });
    const prevVersion = useRef(version);

    useEffect(() => {
        if (version !== prevVersion.current) {
            prevVersion.current = version;
            _cache.delete(url);
            _pending.delete(url);
        }
        if (_cache.has(url)) {
            setData(applyTransform(_cache.get(url)));
            return;
        }
        if (_pending.has(url)) {
            _pending.get(url).then((rawData) => {
                setData(applyTransform(rawData));
            });
            return;
        }
        const promise = fetchAllPages(url, params, pageSize)
            .then((rawData) => {
                _cache.set(url, rawData);
                setData(applyTransform(rawData));
                return rawData;
            })
            .catch(() => {
                return [];
            })
            .finally(() => {
                _pending.delete(url);
            });
        _pending.set(url, promise);
    }, [url, version]);

    return data;
}

async function fetchAllPages(url, params, pageSize) {
    const all = [];
    const limit = pageSize || 200;
    let offset = 0;
    while (true) {
        const res = await api.get(url, { params: { ...params, limit, offset } });
        const raw = Array.isArray(res.data) ? res.data : res.data?.data || [];
        if (raw.length === 0) break;
        all.push(...raw);
        if (raw.length < limit) break;
        offset += limit;
    }
    return all;
}

export async function ensureCached(url, params, pageSize) {
    if (_cache.has(url)) return _cache.get(url);
    if (_pending.has(url)) return _pending.get(url);
    const promise = fetchAllPages(url, params, pageSize)
        .then((rawData) => {
            _cache.set(url, rawData);
            return rawData;
        })
        .catch(() => {
            return [];
        })
        .finally(() => {
            _pending.delete(url);
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

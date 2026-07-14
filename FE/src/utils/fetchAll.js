import api from "@/services/api.js";

export async function fetchAllPages(url, { params, pageSize = 500 } = {}) {
    const all = [];
    let offset = 0;
    while (true) {
        const res = await api.get(url, { params: { ...params, limit: pageSize, offset } });
        const raw = Array.isArray(res.data) ? res.data : res.data?.data || res.data?.items || [];
        if (raw.length === 0) break;
        all.push(...raw);
        if (raw.length < pageSize) break;
        offset += pageSize;
    }
    return all;
}

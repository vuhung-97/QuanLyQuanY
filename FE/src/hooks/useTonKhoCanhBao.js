import { useState, useEffect } from "react";
import api from "@/services/api.js";

export default function useTonKhoCanhBao() {
    const now = new Date();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const thang = now.getMonth() + 1;
        const nam = now.getFullYear();
        setLoading(true);
        api.get("/bao-cao/ton-kho", { params: { thang, nam } })
            .then((res) => {
                const sorted = [...(res.data?.danh_sach || [])]
                    .sort((a, b) => a.ton_cuoi_ky - b.ton_cuoi_ky)
                    .slice(0, 7);
                setItems(sorted);
            })
            .catch(() => setItems([]))
            .finally(() => setLoading(false));
    }, []);

    return { items, loading };
}

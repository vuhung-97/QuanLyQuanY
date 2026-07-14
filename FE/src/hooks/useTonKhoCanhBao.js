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
        api.get("/bao-cao/ton-kho", { params: { thang, nam, limit: 500 } })
            .then((res) => {
                const sorted = [...(res.data?.danh_sach || [])]
                    .filter((item) => {
                        if (item.loai === "vat_tu") return item.ton_cuoi_ky < 100;
                        return item.ton_cuoi_ky < 400;
                    })
                    .sort((a, b) => a.ton_cuoi_ky - b.ton_cuoi_ky);
                setItems(sorted);
            })
            .catch(() => setItems([]))
            .finally(() => setLoading(false));
    }, []);

    return { items, loading };
}

import { useState, useEffect } from "react";
import api from "@/services/api.js";

export default function useTonKhoCanhBao() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        api.get("/thuoc_vtyt/ton-kho")
            .then((res) => {
                const list = Array.isArray(res.data) ? res.data : [];
                const sorted = list
                    .filter((item) => {
                        const ton = item.so_luong ?? 0;
                        if (item.loai === "vat_tu") return ton < 30;
                        return ton < 100;
                    })
                    .sort((a, b) => (a.so_luong ?? 0) - (b.so_luong ?? 0));
                setItems(sorted);
            })
            .catch(() => setItems([]))
            .finally(() => setLoading(false));
    }, []);

    return { items, loading };
}

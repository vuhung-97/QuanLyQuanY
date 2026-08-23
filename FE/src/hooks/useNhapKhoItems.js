import { useCallback, useState } from "react";
import { clearThuocCache } from "@/hooks/useThuocList.jsx";

export default function useNhapKhoItems() {
    const [items, setItems] = useState([]);

    const addItemsFromKho = useCallback((selected) => {
        setItems((prev) => {
            const next = [...prev];
            for (const s of selected) {
                const existingIdx = next.findIndex(
                    (it) => it.ma_thuoc_vtyt === s.ma_thuoc_vtyt,
                );
                if (existingIdx !== -1) {
                    const existing = next[existingIdx];
                    next[existingIdx] = {
                        ...existing,
                        soLuong: (existing.soLuong || 0) + s.so_luong,
                    };
                } else {
                    next.push({
                        ma_thuoc_vtyt: s.ma_thuoc_vtyt,
                        ten_thuoc_vtyt: s.ten_thuoc_vtyt,
                        don_vi_tinh: s.don_vi_tinh || "",
                        soLuongDuTru: null,
                        soLuong: s.so_luong,
                        donGia: "",
                        soLo: "",
                        hanSuDung: null,
                    });
                }
            }
            return next;
        });
    }, []);

    const addThuocMoi = useCallback((record) => {
        if (!record?.ma_thuoc_vtyt) return;
        setItems((prev) => {
            if (prev.some((it) => it.ma_thuoc_vtyt === record.ma_thuoc_vtyt)) {
                return prev;
            }
            return [
                ...prev,
                {
                    ma_thuoc_vtyt: record.ma_thuoc_vtyt,
                    ten_thuoc_vtyt: record.ten_thuoc_vtyt,
                    don_vi_tinh: record.don_vi_tinh || "",
                    soLuongDuTru: null,
                    soLuong: 1,
                    donGia:
                        record.don_gia != null ? String(record.don_gia) : "",
                    soLo: "",
                    hanSuDung: null,
                },
            ];
        });
        clearThuocCache();
    }, []);

    const updateItem = useCallback((idx, patch) => {
        setItems((prev) =>
            prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)),
        );
    }, []);

    const removeItem = useCallback((idx) => {
        setItems((prev) => prev.filter((_, i) => i !== idx));
    }, []);

    const buildItemsPayload = () =>
        items.map((it) => ({
            ma_thuoc_vtyt: it.ma_thuoc_vtyt,
            so_luong:
                it.soLuong === "" || it.soLuong == null
                    ? 0
                    : Math.round(Number(it.soLuong)),
            so_lo: it.soLo?.trim() || null,
            han_su_dung: it.hanSuDung
                ? it.hanSuDung.format("YYYY-MM-DD")
                : null,
            don_gia:
                it.donGia !== "" && it.donGia != null
                    ? Math.round(Number(it.donGia))
                    : null,
        }));

    const validateItems = () => {
        if (items.length === 0) {
            return "Phải có ít nhất một thuốc/VTYT.";
        }
        for (const it of items) {
            const qty = it.soLuong === "" || it.soLuong == null ? 0 : Number(it.soLuong);
            if (!Number.isFinite(qty) || !Number.isInteger(qty) || qty < 0) {
                return `Số lượng của "${it.ten_thuoc_vtyt}" phải là số nguyên không âm.`;
            }
        }
        return null;
    };

    return {
        items,
        setItems,
        addItemsFromKho,
        addThuocMoi,
        updateItem,
        removeItem,
        buildItemsPayload,
        validateItems,
    };
}
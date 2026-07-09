import { useState, useCallback, useEffect, useRef } from "react";
import useThuocList from "@/hooks/useThuocList.jsx";
import { genKey } from "@/utils/khamBenhUtils.js";

export default function useDonThuocForm({
    open,
    onClose,
    onSave,
    initialItems,
}) {
    const [rows, setRows] = useState([]);
    const rowRefs = useRef(new Map());
    const [openKhoThuoc, setOpenKhoThuoc] = useState(false);
    const [saveError, setSaveError] = useState("");
    const { fetchAll, getCache } = useThuocList();

    const handleKhoThuocConfirm = useCallback((items) => {
        setRows((prev) => {
            const existingMas = new Set(
                prev.map((r) => r.initial?.ma_thuoc_vtyt).filter(Boolean),
            );
            const newItems = items
                .filter((item) => !existingMas.has(item.ma_thuoc_vtyt))
                .map((item) => ({
                    key: genKey(),
                    initial: {
                        ma_thuoc_vtyt: item.ma_thuoc_vtyt,
                        ten_thuoc_vtyt: item.ten_thuoc_vtyt,
                        don_vi_tinh: item.don_vi_tinh,
                        so_luong: item.so_luong,
                        so_luong_max: item.so_luong_max,
                    },
                }));
            return newItems.length === 0 ? prev : [...prev, ...newItems];
        });
        setOpenKhoThuoc(false);
    }, []);

    useEffect(() => {
        if (!open) return;
        setSaveError("");
        let cancelled = false;

        (async () => {
            const allItems = await fetchAll();
            if (cancelled) return;

            const stockByMa = {};
            allItems.forEach(
                (item) => (stockByMa[item.ma_thuoc_vtyt] = item.so_luong),
            );

            const next =
                initialItems?.length > 0
                    ? initialItems.map((it) => ({
                          key: genKey(),
                          initial: {
                              ...it,
                              so_luong_max:
                                  stockByMa[it.ma_thuoc_vtyt] ?? Infinity,
                          },
                      }))
                    : [];
            setRows(next);
            rowRefs.current = new Map();
        })();

        return () => {
            cancelled = true;
        };
    }, [open, initialItems, fetchAll]);

    const handleRemove = useCallback((key) => {
        setRows((prev) => prev.filter((r) => r.key !== key));
    }, []);

    const handleSave = useCallback(() => {
        const items = [];
        const errors = [];
        setSaveError("");
        rowRefs.current.forEach((ref) => {
            const data = ref.getData();
            if (!data.ma_thuoc_vtyt) return;
            const total =
                (data.sang || 0) + (data.trua || 0) + (data.toi || 0);
            if (total > data.so_luong) {
                errors.push(
                    `${data.ten_thuoc_vtyt}: tổng liều ${total} > số lượng ${data.so_luong}`,
                );
                return;
            }
            items.push(data);
        });
        if (errors.length > 0) {
            setSaveError(errors.join("\n"));
            return;
        }
        if (items.length === 0) return;
        onSave(items);
        onClose();
    }, [onSave, onClose]);

    return {
        rows,
        rowRefs,
        openKhoThuoc,
        setOpenKhoThuoc,
        saveError,
        handleKhoThuocConfirm,
        handleRemove,
        handleSave,
        getCache,
    };
}

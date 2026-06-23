import { useCallback, useImperativeHandle, useState } from "react";

export default function useTongQuanTab(initialData, ref) {
    const [data, setData] = useState({ ...initialData });
    const [showCoKinh, setShowCoKinh] = useState(false);

    useImperativeHandle(
        ref,
        () => ({
            getData: () => ({ ...data }),
        }),
        [data],
    );

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setData((prev) => {
            const updated = { ...prev, [name]: value };
            if (name === "chieu_cao" || name === "can_nang") {
                const h = parseFloat(
                    name === "chieu_cao" ? value : prev.chieu_cao,
                );
                const w = parseFloat(
                    name === "can_nang" ? value : prev.can_nang,
                );
                if (h > 0 && w > 0) {
                    updated.bmi = (w / Math.pow(h / 100, 2)).toFixed(1);
                } else {
                    updated.bmi = "";
                }
            }
            return updated;
        });
    }, []);

    const handleToggle = useCallback((name) => {
        setData((prev) => ({
            ...prev,
            [name]: prev[name] === "Không" ? "" : "Không",
        }));
    }, []);

    const toggleCoKinh = useCallback(() => {
        setShowCoKinh((p) => !p);
    }, []);

    return {
        data,
        showCoKinh,
        handleChange,
        handleToggle,
        toggleCoKinh,
    };
}

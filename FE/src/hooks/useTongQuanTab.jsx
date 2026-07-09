import { useCallback, useImperativeHandle, useRef, useState } from "react";

export default function useTongQuanTab(initialData, ref) {
    const dataRef = useRef({ ...initialData });
    const [showCoKinh, setShowCoKinh] = useState(false);

    useImperativeHandle(
        ref,
        () => ({
            getData: () => {
                const data = { ...dataRef.current };
                const h = parseFloat(data.chieu_cao);
                const w = parseFloat(data.can_nang);
                if (h > 0 && w > 0) {
                    data.bmi = (w / Math.pow(h / 100, 2)).toFixed(1);
                } else {
                    data.bmi = "";
                }
                return data;
            },
        }),
        [],
    );

    const toggleCoKinh = useCallback(() => {
        setShowCoKinh((p) => !p);
    }, []);

    return {
        dataRef,
        showCoKinh,
        toggleCoKinh,
    };
}

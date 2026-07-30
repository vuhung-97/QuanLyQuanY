import { useState, useCallback, useEffect } from "react";
import {
    STORAGE_KEY_THRESHOLDS,
    DEFAULT_THRESHOLDS,
} from "@/constants/khoConstant.js";

export default function useThresholdSettings() {
    const [thresholds, setThresholds] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY_THRESHOLDS);
            if (stored) {
                const parsed = JSON.parse(stored);
                return {
                    thuoc: parsed.thuoc ?? DEFAULT_THRESHOLDS.thuoc,
                    vat_tu: parsed.vat_tu ?? DEFAULT_THRESHOLDS.vat_tu,
                };
            }
        } catch {
            /* ignore */
        }
        return { ...DEFAULT_THRESHOLDS };
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY_THRESHOLDS, JSON.stringify(thresholds));
    }, [thresholds]);

    const updateThresholds = useCallback(
        (key, value) => {
            setThresholds((prev) => ({ ...prev, [key]: value }));
        },
        [],
    );

    return { thresholds, updateThresholds };
}

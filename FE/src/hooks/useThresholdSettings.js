import { useState, useCallback, useEffect } from "react";
import { DEFAULT_THRESHOLDS } from "@/constants/khoConstant.js";
import { khoDuocService } from "@/services/khoDuocService.js";

export default function useThresholdSettings() {
    const [thresholds, setThresholds] = useState({ ...DEFAULT_THRESHOLDS });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        khoDuocService
            .getThresholds()
            .then((res) => {
                if (!cancelled && res.data) {
                    setThresholds({
                        thuoc: res.data.thuoc ?? DEFAULT_THRESHOLDS.thuoc,
                        vat_tu: res.data.vat_tu ?? DEFAULT_THRESHOLDS.vat_tu,
                        sapHetHanNgay:
                            res.data.sapHetHanNgay ??
                            DEFAULT_THRESHOLDS.sapHetHanNgay,
                    });
                }
            })
            .catch(() => {})
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    const updateThresholds = useCallback(async (key, value) => {
        setThresholds((prev) => ({ ...prev, [key]: value }));
        try {
            await khoDuocService.updateThresholds({ [key]: value });
        } catch {
            /* ignore */
        }
    }, []);

    return { thresholds, updateThresholds, loading };
}

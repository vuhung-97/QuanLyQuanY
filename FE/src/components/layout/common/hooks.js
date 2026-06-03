import { useCallback, useEffect, useState } from "react";
import { STORAGE_KEYS } from "./constants.js";

export function useSidebarState(initialOpen = true) {
    const [open, setOpen] = useState(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEYS.sidebarOpen);
            if (raw === null) return initialOpen;
            return raw === "true";
        } catch {
            return initialOpen;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEYS.sidebarOpen, String(open));
        } catch {
        }
    }, [open]);

    const toggle = useCallback(() => setOpen((v) => !v), []);

    return { open, setOpen, toggle };
}

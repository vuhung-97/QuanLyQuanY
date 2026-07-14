import { decodeJWT } from "@/services/api.js";
import { STORAGE_KEYS } from "@/components/layout/common/constants.js";

export default function IfRole({ roles, children, fallback = null }) {
    const token = localStorage.getItem(STORAGE_KEYS.token);
    if (!token) return fallback;

    const payload = decodeJWT(token);
    if (!payload || !roles.includes(payload.role)) {
        return fallback;
    }

    return children;
}

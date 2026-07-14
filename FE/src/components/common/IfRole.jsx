import { getCurrentUser } from "@/services/api.js";

export default function IfRole({ roles, children, fallback = null }) {
    const payload = getCurrentUser();
    if (!payload || !roles.includes(payload.role)) {
        return fallback;
    }

    return children;
}

import { Navigate } from "react-router-dom";
import { decodeJWT } from "@/services/api.js";
import { STORAGE_KEYS } from "@/components/layout/common/constants.js";

export default function RoleRoute({ roles, children }) {
    const token = localStorage.getItem(STORAGE_KEYS.token);
    if (!token) return <Navigate to="/login" replace />;

    const payload = decodeJWT(token);
    if (!payload || !roles.includes(payload.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
}

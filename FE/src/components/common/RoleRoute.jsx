import { Navigate } from "react-router-dom";
import { getCurrentUser } from "@/services/api.js";

export default function RoleRoute({ roles, children }) {
    const payload = getCurrentUser();
    if (!payload) return <Navigate to="/login" replace />;

    if (!roles.includes(payload.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
}

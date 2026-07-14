import { Navigate } from "react-router-dom";
import { getCurrentUser } from "@/services/api.js";
import { MENU_ROLE_MAP } from "@/constants/roleConstants.js";

export default function AdminRoute({ children }) {
    const payload = getCurrentUser();
    if (!payload) return <Navigate to="/login" replace />;

    if (!MENU_ROLE_MAP["quan-tri"].includes(payload.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
}

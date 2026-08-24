import { Navigate } from "react-router-dom";
import { clearAuth, getToken } from "@/services/api.js";

export default function ProtectedRoute({ children }) {
    const token = getToken();

    if (!token) {
        clearAuth();
        return <Navigate to="/login" replace />;
    }

    return children;
}

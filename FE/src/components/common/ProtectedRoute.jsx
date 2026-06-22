import { Navigate } from "react-router-dom";
import { clearAuth } from "@/services/api.js";

export default function ProtectedRoute({ children }) {
    const token = localStorage.getItem("datamed_access_token");

    if (!token) {
        clearAuth();
        return <Navigate to="/login" replace />;
    }

    return children;
}

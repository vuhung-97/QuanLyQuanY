import { Navigate } from "react-router-dom";
import { isTokenExpired, clearAuth } from "../services/api.js";

export default function ProtectedRoute({ children }) {
    const token = localStorage.getItem("datamed_access_token");

    if (!token || isTokenExpired()) {
        clearAuth();
        return <Navigate to="/login" replace />;
    }

    return children;
}

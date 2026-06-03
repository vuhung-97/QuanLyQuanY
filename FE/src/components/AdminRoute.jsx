import { Navigate } from "react-router-dom";
import { decodeJWT } from "../services/api.js";

const ALLOWED_ROLES = ["ROLE_ADMIN", "ROLE_CNQY"];

export default function AdminRoute({ children }) {
    const token = localStorage.getItem("datamed_access_token");
    if (!token) return <Navigate to="/login" replace />;

    const payload = decodeJWT(token);
    if (!payload || !ALLOWED_ROLES.includes(payload.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
}

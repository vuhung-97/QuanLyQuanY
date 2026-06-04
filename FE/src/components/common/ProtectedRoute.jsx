import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { isTokenExpired, clearAuth } from "../../services/api.js";

const TOKEN_CHECK_INTERVAL = 30_000;

export default function ProtectedRoute({ children }) {
    const token = localStorage.getItem("datamed_access_token");

    useEffect(() => {
        const checkToken = () => {
            if (isTokenExpired()) {
                clearAuth();
                window.location.href = "/login";
            }
        };

        const intervalId = window.setInterval(checkToken, TOKEN_CHECK_INTERVAL);
        window.addEventListener("storage", checkToken);

        return () => {
            window.clearInterval(intervalId);
            window.removeEventListener("storage", checkToken);
        };
    }, []);

    if (!token || isTokenExpired()) {
        clearAuth();
        return <Navigate to="/login" replace />;
    }

    return children;
}

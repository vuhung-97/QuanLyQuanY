import axios from "axios";

export function decodeJWT(token) {
    try {
        const payload = token.split(".")[1];
        const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
        return JSON.parse(decoded);
    } catch {
        return null;
    }
}

export function clearAuth() {
    localStorage.removeItem("datamed_access_token");
    localStorage.removeItem("datamed_token_exp");
    localStorage.removeItem("datamed_user_role");
}

const api = axios.create({
    baseURL: "http://localhost:8000",
    headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("datamed_access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

function normalizeApiError(error) {
    const detail = error.response?.data?.detail;
    if (detail && typeof detail !== "string") {
        error.response.data.detail = JSON.stringify(detail);
    }
    return error;
}

api.interceptors.response.use(
    (res) => res,
    (error) => {
        if (
            error.response?.status === 401 &&
            window.location.pathname !== "/login"
        ) {
            clearAuth();
            window.location.href = "/login";
        }
        return Promise.reject(normalizeApiError(error));
    },
);

export default api;

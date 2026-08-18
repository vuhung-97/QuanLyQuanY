import axios from "axios";
import { STORAGE_KEYS } from "@/components/layout/common/constants";
import { getErrorMessage } from "@/utils/apiError.js";

export function decodeJWT(token) {
    try {
        const payload = token.split(".")[1];
        const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
        return JSON.parse(decoded);
    } catch {
        return null;
    }
}

export function getCurrentUser() {
    const token = localStorage.getItem(STORAGE_KEYS.token);
    if (!token) return null;
    return decodeJWT(token);
}

export function clearAuth() {
    localStorage.removeItem(STORAGE_KEYS.token);
    localStorage.removeItem(STORAGE_KEYS.tokenExp);
    localStorage.removeItem(STORAGE_KEYS.userRole);
}

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "/api",
    headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem(STORAGE_KEYS.token);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

function normalizeApiError(error) {
    const detail = error.response?.data?.detail;
    if (detail) {
        const message = getErrorMessage(error, "");
        if (message) {
            error.response.data.detail = message;
        }
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

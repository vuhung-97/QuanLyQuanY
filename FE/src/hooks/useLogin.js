import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";
import { STORAGE_KEYS } from "@/components/layout/common/constants";

export default function useLogin() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const togglePassword = () => setShowPassword((prev) => !prev);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        const formData = new FormData(event.currentTarget);

        try {
            const params = new URLSearchParams();
            params.append("username", formData.get("username"));
            params.append("password", formData.get("password"));

            const res = await api.post("/auth/login", params, {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            });
            const token = res.data.access_token;
            localStorage.setItem(STORAGE_KEYS.token, token);

            if (formData.get("remember") === "on") {
                localStorage.setItem(
                    STORAGE_KEYS.remember,
                    formData.get("username"),
                );
            }

            navigate("/");
        } catch (err) {
            const detail =
                err.response?.data?.detail || "Đăng nhập thất bại";
            setError(detail);
        } finally {
            setLoading(false);
        }
    };

    return {
        showPassword,
        loading,
        error,
        handleSubmit,
        togglePassword,
        setError,
    };
}

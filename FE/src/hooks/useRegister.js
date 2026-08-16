import { useState } from "react";
import api from "@/services/api";

export default function useRegister() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const register = async ({ tenDangNhap, matKhau, maQuanNhan }) => {
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            const res = await api.post("/auth/register", {
                ten_dang_nhap: tenDangNhap,
                mat_khau: matKhau,
                ma_quan_nhan: maQuanNhan,
            });
            setSuccess(res.data?.message || "Đăng ký tài khoản thành công");
            return res.data;
        } catch (err) {
            const detail =
                err.response?.data?.detail || "Đăng ký tài khoản thất bại";
            setError(detail);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        success,
        register,
        setError,
        setSuccess,
    };
}
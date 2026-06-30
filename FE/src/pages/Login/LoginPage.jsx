import { Box } from "@mui/material";
import useLogin from "@/hooks/useLogin";
import LoginHero from "./LoginHero";
import LoginForm from "./LoginForm";

export default function LoginPage() {
    const {
        showPassword,
        loading,
        error,
        handleSubmit,
        togglePassword,
        setError,
    } = useLogin();

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1.05fr 0.95fr" },
                bgcolor: "background.default",
                overflow: "hidden",
            }}
        >
            <LoginHero />
            <LoginForm
                showPassword={showPassword}
                loading={loading}
                error={error}
                onSubmit={handleSubmit}
                onTogglePassword={togglePassword}
                onCloseError={() => setError("")}
            />
        </Box>
    );
}

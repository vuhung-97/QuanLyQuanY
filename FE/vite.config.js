import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
        },
    },
    server: {
        host: true,
        port: 3000,
        proxy: {
            "/api": {
                target: "http://localhost:8000",
                changeOrigin: true,
                rewrite: (p) => p.replace(/^\/api/, ""),
            },
            "/uploads": {
                target: "http://localhost:8000",
                changeOrigin: true,
            },
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes("node_modules/react")) return "vendor";
                    if (id.includes("node_modules/recharts")) return "recharts";
                    if (id.includes("@mui/icons-material")) return "mui-icons";
                    if (id.includes("@mui/")) return "mui";
                },
            },
        },
    },
});

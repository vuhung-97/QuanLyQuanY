import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
    palette: {
        primary: {
            main: "#0B3B60", // Primary Navy
            dark: "#06253D",
        },
        secondary: {
            main: "#00B4D8", // Medical Teal
        },
        background: {
            default: "#F4F7F9", // Background Light
            paper: "#FFFFFF", // Surface White
        },
        text: {
            primary: "#1A202C",
            secondary: "#64748B",
        },
        success: {
            main: "#10B981",
        },
        warning: {
            main: "#F59E0B",
        },
        error: {
            main: "#EF4444",
        },
    },
    typography: {
        fontFamily: "'Inter', sans-serif",
        h1: {
            fontSize: 24,
            fontWeight: 700,
        },
        h2: {
            fontSize: 18,
            fontWeight: 600,
        },
        body1: {
            fontSize: 14,
            fontWeight: 400,
        },
        caption: {
            fontSize: 12,
            fontWeight: 400,
            color: "#64748B",
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow:
                        "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)", // Bóng đổ mềm mại
                    border: "1px solid rgba(0,0,0,0.05)",
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                    fontWeight: 600,
                    boxShadow: "none",
                    "&:hover": {
                        boxShadow: "0 4px 12px rgba(0, 180, 216, 0.2)",
                    },
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: "#0B3B60", // Sidebar màu Primary Navy
                    color: "#FFFFFF",
                },
            },
        },
    },
});

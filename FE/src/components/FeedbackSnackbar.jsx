import { Snackbar, Alert } from "@mui/material";

export default function FeedbackSnackbar({ open, message, severity, onClose }) {
    return (
        <Snackbar
            open={open}
            autoHideDuration={4000}
            onClose={onClose}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
            <Alert
                severity={severity}
                variant="filled"
                onClose={onClose}
                sx={{ borderRadius: 3 }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
}

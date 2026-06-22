import { useCallback, useEffect, useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    Typography,
} from "@mui/material";
import api from "@/services/api.js";
import FeedbackSnackbar from "@/components/common/FeedbackSnackbar.jsx";
import ProfileInfo from "./ProfileInfo.jsx";
import ProfileUpdateForm from "./ProfileUpdateForm.jsx";
import PasswordChangeForm from "./PasswordChangeForm.jsx";

export default function AccountSettingsDialog({ open, onClose }) {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    useEffect(() => {
        if (!open) return;
        let ignore = false;

        async function loadProfile() {
            setLoading(true);
            try {
                const res = await api.get("/nguoi_dung/me");
                if (!ignore) {
                    setProfile(res.data);
                }
            } catch (err) {
                if (!ignore) {
                    setSnackbar({
                        open: true,
                        message: err.response?.data?.detail || "Không thể tải thông tin tài khoản.",
                        severity: "error",
                    });
                }
            } finally {
                if (!ignore) setLoading(false);
            }
        }

        loadProfile();
        return () => { ignore = true; };
    }, [open]);

    const onProfileSuccess = useCallback((updatedProfile) => {
        setProfile(updatedProfile);
        setSnackbar({ open: true, message: "Cập nhật thông tin thành công", severity: "success" });
    }, []);

    const onPasswordSuccess = useCallback((message) => {
        setSnackbar({ open: true, message, severity: "success" });
    }, []);

    const onError = useCallback((message) => {
        setSnackbar({ open: true, message, severity: "error" });
    }, []);

    return (
        <>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
                <DialogTitle variant="h1" sx={{ textAlign: "center" }}>
                    Cài đặt tài khoản
                </DialogTitle>
                <DialogContent>
                    {loading ? null : (
                        <Stack spacing={2} sx={{ pt: 1 }}>
                            <Typography variant="h2">
                                - Thông tin tài khoản
                            </Typography>
                            <ProfileInfo profile={profile} />

                            <ProfileUpdateForm
                                initialName={profile?.ho_ten}
                                onSuccess={onProfileSuccess}
                                onError={onError}
                            />

                            <PasswordChangeForm
                                onSuccess={onPasswordSuccess}
                                onError={onError}
                            />
                        </Stack>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5 }}>
                    <Button onClick={onClose}>Đóng</Button>
                </DialogActions>
            </Dialog>

            <FeedbackSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
            />
        </>
    );
}

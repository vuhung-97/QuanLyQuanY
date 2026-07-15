import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    IconButton,
    InputAdornment,
    MenuItem,
    Stack,
    Switch,
    TextField,
} from "@mui/material";
import { PersonSearch as PersonSearchIcon } from "@mui/icons-material";
import FormTextField from "@/components/common/FormTextField.jsx";
import ChonQuanNhanDialog from "@/components/common/ChonQuanNhanDialog.jsx";
import useUserForm from "@/hooks/useUserForm.js";

export default function UserFormDialog({ open, onClose, editingUser, roles, onSaved }) {
    const {
        formSnapshot,
        updateField,
        saving,
        error,
        openChonQn,
        setOpenChonQn,
        handleTrangThaiChange,
        handleChonQuanNhan,
        handleSubmit,
        handleClose,
    } = useUserForm({ open, editingUser, onClose, onSaved });

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <Box component="form" onSubmit={handleSubmit}>
                <DialogTitle>
                    {editingUser ? "Cập nhật tài khoản" : "Thêm tài khoản người dùng"}
                </DialogTitle>
                <DialogContent>
                    {error && (
                        <TextField
                            error
                            fullWidth
                            value={error}
                            slotProps={{ input: { readOnly: true } }}
                            sx={{ mb: 2 }}
                            helperText="Vui lòng thử lại."
                        />
                    )}
                    <Stack spacing={2} sx={{ pt: 1 }}>
                        <FormTextField
                            name="ten_dang_nhap"
                            initialValue={formSnapshot.ten_dang_nhap}
                            onUpdateRef={updateField}
                            label="Tên đăng nhập"
                            required
                            slotProps={{ htmlInput: { maxLength: 50 } }}
                        />
                        <FormTextField
                            name="mat_khau"
                            initialValue={formSnapshot.mat_khau}
                            onUpdateRef={updateField}
                            label={editingUser ? "Mật khẩu mới (nếu đổi)" : "Mật khẩu"}
                            type="password"
                            required={!editingUser}
                            helperText="Tối thiểu 8 ký tự"
                            slotProps={{ htmlInput: { minLength: 8 } }}
                        />
                        <FormTextField
                            select
                            name="id_vai_tro"
                            initialValue={formSnapshot.id_vai_tro}
                            onUpdateRef={updateField}
                            label="Vai trò"
                            required
                        >
                            {roles.map((role) => (
                                <MenuItem key={role.id} value={role.id}>
                                    {role.ten_vai_tro || role.id}
                                </MenuItem>
                            ))}
                        </FormTextField>
                        <FormTextField
                            name="id_quan_nhan"
                            initialValue={formSnapshot.id_quan_nhan || ""}
                            onUpdateRef={updateField}
                            label="Mã quân nhân"
                            slotProps={{
                                htmlInput: { maxLength: 20 },
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setOpenChonQn(true)}
                                                size="small"
                                            >
                                                <PersonSearchIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />
                        <FormTextField
                            name="ho_ten"
                            initialValue={formSnapshot.ho_ten}
                            onUpdateRef={updateField}
                            label="Họ tên"
                            required
                            slotProps={{ htmlInput: { maxLength: 100 } }}
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    name="trang_thai"
                                    checked={Boolean(formSnapshot.trang_thai)}
                                    onChange={handleTrangThaiChange}
                                />
                            }
                            label="Tài khoản đang hoạt động"
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5 }}>
                    <Button onClick={onClose}>Hủy</Button>
                    <Button type="submit" variant="contained" disabled={saving}>
                        {saving ? "Đang lưu..." : "Lưu"}
                    </Button>
                </DialogActions>
            </Box>

            <ChonQuanNhanDialog
                open={openChonQn}
                onClose={() => setOpenChonQn(false)}
                onSelected={handleChonQuanNhan}
            />
        </Dialog>
    );
}

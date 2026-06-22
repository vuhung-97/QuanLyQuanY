import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField,
} from "@mui/material";
import { Security as SecurityIcon } from "@mui/icons-material";

const emptyRole = { id: "", ten_vai_tro: "", mo_ta: "" };

export default function RoleFormDialog({ open, editingRole, saving, onSubmit, onClose }) {
    const [roleForm, setRoleForm] = useState(emptyRole);

    useEffect(() => {
        if (open) {
            setRoleForm(
                editingRole
                    ? {
                          id: editingRole.id,
                          ten_vai_tro: editingRole.ten_vai_tro,
                          mo_ta: editingRole.mo_ta || "",
                      }
                    : emptyRole,
            );
        }
    }, [open, editingRole]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRoleForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(roleForm);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <Box component="form" onSubmit={handleSubmit}>
                <DialogTitle>
                    {editingRole ? "Cập nhật vai trò" : "Thêm vai trò"}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ pt: 1 }}>
                        <TextField
                            name="id"
                            label="ID vai trò"
                            value={roleForm.id}
                            onChange={handleChange}
                            required={!editingRole}
                            disabled={!!editingRole}
                            slotProps={{ htmlInput: { maxLength: 20 } }}
                        />
                        <TextField
                            name="ten_vai_tro"
                            label="Tên vai trò"
                            value={roleForm.ten_vai_tro}
                            onChange={handleChange}
                            required
                            slotProps={{ htmlInput: { maxLength: 100 } }}
                        />
                        <TextField
                            name="mo_ta"
                            label="Mô tả"
                            value={roleForm.mo_ta}
                            onChange={handleChange}
                            multiline
                            minRows={3}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5 }}>
                    <Button onClick={onClose}>Hủy</Button>
                    <Button
                        type="submit"
                        variant="contained"
                        startIcon={<SecurityIcon />}
                        disabled={saving}
                    >
                        {saving ? "Đang lưu..." : editingRole ? "Cập nhật" : "Tạo vai trò"}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}

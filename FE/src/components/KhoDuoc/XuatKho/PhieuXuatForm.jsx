import { memo } from "react";
import {
    Button,
    IconButton,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { Close as CloseIcon, Person as PersonIcon } from "@mui/icons-material";
import DatePicker from "@/components/common/DatePicker.jsx";
import FormTextField from "@/components/common/FormTextField.jsx";

const PhieuXuatForm = memo(function PhieuXuatForm({
    donViFlat,
    donViNhan,
    onDonViNhanChange,
    isView,
    hoTenNguoiNhan,
    maQuanNhanNhan,
    onChonQN,
    onRemoveQN,
    creatorName,
    currentUser,
    ngayXuat,
    onNgayXuatChange,
    initialLyDoXuat,
    initialGhiChu,
    updateField,
}) {
    return (
        <Stack spacing={2.5} sx={{ pt: 1 }}>
            <TextField
                select
                label="Đơn vị nhận"
                value={donViNhan}
                onChange={(e) => onDonViNhanChange(e.target.value)}
                fullWidth
                slotProps={{
                    input: { readOnly: isView },
                    select: {
                        MenuProps: {
                            slotProps: {
                                paper: {
                                    sx: { maxHeight: 300, minWidth: "100%" },
                                },
                            },
                        },
                    },
                }}
            >
                <MenuItem value="">— Chọn đơn vị —</MenuItem>
                {donViFlat.map((dv) => (
                    <MenuItem
                        key={dv.ma_don_vi}
                        value={dv.ma_don_vi}
                        sx={{ pl: dv.level * 3 + 2 }}
                    >
                        {dv.level > 0 ? "– ".repeat(dv.level) : ""}
                        {dv.ten_don_vi}
                    </MenuItem>
                ))}
            </TextField>

            <Stack direction="row" spacing={2}>
                <Stack spacing={0.5} sx={{ flex: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                        Người nhận
                    </Typography>
                    {isView ? (
                        <Typography variant="body2">
                            {hoTenNguoiNhan
                                ? `${hoTenNguoiNhan}${maQuanNhanNhan ? ` (${maQuanNhanNhan})` : ""}`
                                : "—"}
                        </Typography>
                    ) : !maQuanNhanNhan ? (
                        <Button
                            variant="outlined"
                            startIcon={<PersonIcon />}
                            onClick={onChonQN}
                            sx={{ width: "fit-content" }}
                        >
                            Chọn quân nhân
                        </Button>
                    ) : (
                        <Stack
                            direction="row"
                            spacing={1}
                            sx={{ alignItems: "center" }}
                        >
                            <PersonIcon fontSize="small" />
                            <Typography variant="body2">
                                {hoTenNguoiNhan} ({maQuanNhanNhan})
                            </Typography>
                            <IconButton
                                size="small"
                                color="error"
                                onClick={onRemoveQN}
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Stack>
                    )}
                </Stack>
                <Stack spacing={0.5} sx={{ flex: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                        Người tạo
                    </Typography>
                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{ alignItems: "center" }}
                    >
                        <PersonIcon fontSize="small" />
                        <Typography variant="body2">
                            {isView
                                ? creatorName || "—"
                                : currentUser
                                  ? `${currentUser.ho_ten} (${currentUser.role})`
                                  : "—"}
                        </Typography>
                    </Stack>
                </Stack>
            </Stack>
            <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                <Typography variant="caption" color="text.secondary">
                    Ngày đề nghị:
                </Typography>
                <DatePicker
                    value={ngayXuat}
                    onChange={onNgayXuatChange}
                    size="small"
                />
            </Stack>

            <FormTextField
                name="lyDoXuat"
                initialValue={initialLyDoXuat}
                onUpdateRef={updateField}
                label="Lý do xuất"
                multiline
                rows={2}
                fullWidth
                slotProps={{ input: { readOnly: isView } }}
            />

            <FormTextField
                name="ghiChu"
                initialValue={initialGhiChu}
                onUpdateRef={updateField}
                label="Ghi chú"
                multiline
                rows={2}
                fullWidth
                slotProps={{ input: { readOnly: isView } }}
            />
        </Stack>
    );
});

export default PhieuXuatForm;

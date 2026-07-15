import { Chip, Stack, TableCell, TableRow } from "@mui/material";
import {
    Delete as DeleteIcon,
    ManageAccounts as ManageAccountsIcon,
} from "@mui/icons-material";
import ActionIcon from "@/components/common/ActionIcon.jsx";

export default function UserTableRow({ user, onEdit, onDelete }) {
    return (
        <TableRow hover>
            <TableCell sx={{ fontWeight: 700, color: "primary.main" }}>
                {user.id}
            </TableCell>
            <TableCell>{user.ten_dang_nhap}</TableCell>
            <TableCell>{user.ho_ten}</TableCell>
            <TableCell>
                <Chip
                    size="small"
                    label={user.ten_vai_tro || user.id_vai_tro || "Chưa gán"}
                    color={
                        user.id_vai_tro === "ROLE_ADMIN"
                            ? "secondary"
                            : "default"
                    }
                />
            </TableCell>
            <TableCell>{user.id_quan_nhan || "--"}</TableCell>
            <TableCell>
                <Chip
                    size="small"
                    label={user.trang_thai ? "Hoạt động" : "Khóa"}
                    color={user.trang_thai ? "success" : "error"}
                />
            </TableCell>
            <TableCell>
                <Stack direction="row" spacing={0.5}>
                    <ActionIcon
                        title="Sửa"
                        icon={<ManageAccountsIcon />}
                        color="primary"
                        onClick={() => onEdit(user)}
                    />
                    <ActionIcon
                        title="Xóa"
                        icon={<DeleteIcon />}
                        color="error"
                        onClick={() => onDelete(user)}
                    />
                </Stack>
            </TableCell>
        </TableRow>
    );
}

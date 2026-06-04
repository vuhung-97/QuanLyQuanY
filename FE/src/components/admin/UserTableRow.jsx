import { Button, Chip, IconButton, TableCell, TableRow } from "@mui/material";
import {
    Delete as DeleteIcon,
    ManageAccounts as ManageAccountsIcon,
} from "@mui/icons-material";

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
                <Button
                    size="small"
                    startIcon={<ManageAccountsIcon />}
                    onClick={() => onEdit(user)}
                    sx={{ fontSize: "1rem" }}
                >
                    Sửa
                </Button>
                <Button
                    color="error"
                    size="small"
                    startIcon={<DeleteIcon />}
                    onClick={() => onDelete(user)}
                    sx={{ fontSize: "1rem" }}
                >
                    Xóa
                </Button>
            </TableCell>
        </TableRow>
    );
}

import { Button, IconButton, Stack, Tooltip } from "@mui/material";
import {
    CheckCircle as CheckCircleIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Visibility as VisibilityIcon,
} from "@mui/icons-material";

export default function DuTruRowActions({ row, extra }) {
    const {
        currentUser,
        isCNQYorAdmin,
        onView,
        onEdit,
        onDuyet,
        onXoa,
        onNhapKho,
    } = extra || {};
    const isCreator = row.nguoi_lap === currentUser?.id;

    return (
        <Stack direction="row" spacing={0.5}>
            {(row.trang_thai === "da_duyet" ||
                row.trang_thai === "da_nhap" ||
                (!isCreator && !isCNQYorAdmin)) && (
                <Tooltip title="Xem">
                    <IconButton
                        size="small"
                        color="primary"
                        onClick={() => onView(row.ma_phieu_du_tru)}
                    >
                        <VisibilityIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            )}

            {row.trang_thai === "chua_duyet" && isCNQYorAdmin && (
                <Tooltip title="Duyệt">
                    <IconButton
                        size="small"
                        color="success"
                        onClick={() => onDuyet(row.ma_phieu_du_tru)}
                    >
                        <CheckCircleIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            )}

            {row.trang_thai === "chua_duyet" &&
                (isCreator || isCNQYorAdmin) && (
                    <Tooltip title="Sửa">
                        <IconButton
                            size="small"
                            color="primary"
                            onClick={() => onEdit(row.ma_phieu_du_tru)}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}

            {row.trang_thai === "tu_choi" && isCreator && (
                <Tooltip title="Sửa">
                    <IconButton
                        size="small"
                        color="primary"
                        onClick={() => onEdit(row.ma_phieu_du_tru)}
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            )}

            {["chua_duyet", "tu_choi"].includes(row.trang_thai) &&
                (isCreator || isCNQYorAdmin) && (
                    <Tooltip title="Xoá">
                        <IconButton
                            size="small"
                            color="error"
                            onClick={() => onXoa(row.ma_phieu_du_tru)}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}

            {row.trang_thai === "da_duyet" && (
                <Button
                    size="small"
                    variant="contained"
                    onClick={() => onNhapKho(row.ma_phieu_du_tru)}
                >
                    Nhập kho
                </Button>
            )}
        </Stack>
    );
}

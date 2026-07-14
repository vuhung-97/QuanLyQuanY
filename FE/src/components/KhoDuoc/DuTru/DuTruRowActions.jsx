import { Stack } from "@mui/material";
import ActionIcon from "@/components/common/ActionIcon.jsx";
import {
    CheckCircle as CheckCircleIcon,
    Delete as DeleteIcon,
    DoDisturb as DoDisturbIcon,
    Edit as EditIcon,
    Inventory as InventoryIcon,
    Send as SendIcon,
    Visibility as VisibilityIcon,
} from "@mui/icons-material";

export default function DuTruRowActions({ row, extra }) {
    const {
        currentUser,
        isCNQYorAdmin,
        onView,
        onEdit,
        onDuyet,
        onGui,
        onTuChoi,
        onXoa,
        onNhapKho,
    } = extra || {};
    const isCreator = row.nguoi_lap === currentUser?.id;

    return (
        <Stack direction="row" spacing={0.5}>
            {row.trang_thai !== "cho_gui" && (
                <ActionIcon title="Xem" icon={<VisibilityIcon />} onClick={() => onView(row.ma_phieu_du_tru)} />
            )}

            {row.trang_thai === "cho_gui" && isCreator && (
                <ActionIcon title="Sửa" icon={<EditIcon />} onClick={() => onEdit(row.ma_phieu_du_tru)} />
            )}

            {row.trang_thai === "cho_gui" && isCreator && (
                <ActionIcon title="Gửi duyệt" icon={<SendIcon />} onClick={() => onGui(row.ma_phieu_du_tru)} />
            )}

            {row.trang_thai === "chua_duyet" && isCNQYorAdmin && (
                <ActionIcon title="Duyệt" icon={<CheckCircleIcon />} color="success" onClick={() => onDuyet(row.ma_phieu_du_tru)} />
            )}

            {row.trang_thai === "chua_duyet" && isCNQYorAdmin && (
                <ActionIcon title="Không duyệt" icon={<DoDisturbIcon />} color="error" onClick={() => onTuChoi(row.ma_phieu_du_tru)} />
            )}

            {row.trang_thai === "da_duyet" && (
                <ActionIcon title="Nhập kho" icon={<InventoryIcon />} color="info" onClick={() => onNhapKho(row.ma_phieu_du_tru)} />
            )}

            {["cho_gui", "chua_duyet", "tu_choi"].includes(row.trang_thai) &&
                (isCreator || isCNQYorAdmin) && (
                    <ActionIcon title="Xoá" icon={<DeleteIcon />} color="error" onClick={() => onXoa(row.ma_phieu_du_tru)} />
                )}
        </Stack>
    );
}

import { Box, Stack, Typography } from "@mui/material";
import DanhMucList from "@/components/KhamBenhChoQN/DanhMuc/DanhMucList.jsx";
import { danhMucService } from "@/services/danhMucService.js";

const NHOM_BENH_CONFIG = {
    url: "/dm_nhom_benh",
    idField: "ma_nhom",
    nameField: "ten_nhom",
    searchFields: ["ten_nhom", "ma_nhom", "mo_ta"],
    service: {
        get: danhMucService.getNhomBenh,
        create: danhMucService.createNhomBenh,
        update: danhMucService.updateNhomBenh,
        delete: danhMucService.deleteNhomBenh,
    },
    addLabel: "Thêm nhóm bệnh",
    emptyMessage: "Không có nhóm bệnh nào.",
    deleteMessage: "Bạn có chắc muốn xoá nhóm bệnh này?",
    fields: [
        { name: "ten_nhom", label: "Tên nhóm bệnh", grid: { xs: 12 }, required: true },
        { name: "mo_ta", label: "Mô tả", grid: { xs: 12 }, multiline: true, rows: 3 },
    ],
    initForm: { ten_nhom: "", mo_ta: "" },
    modeTitles: {
        create: "Thêm nhóm bệnh",
        edit: "Sửa nhóm bệnh",
        view: "Chi tiết nhóm bệnh",
    },
};

export default function DanhMucPage() {
    return (
        <Stack spacing={3}>
            <Box>
                <Typography variant="h1" sx={{ color: "text.primary" }}>
                    Danh mục nhóm bệnh
                </Typography>
                <Typography sx={{ mt: 0.75, color: "text.secondary" }}>
                    Quản lý danh mục nhóm bệnh khám bệnh.
                </Typography>
            </Box>

            <DanhMucList config={NHOM_BENH_CONFIG} />
        </Stack>
    );
}

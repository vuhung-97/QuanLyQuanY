import { Box, Stack, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";
import DanhMucList from "@/components/KhamBenhChoQN/DanhMuc/DanhMucList.jsx";
import { danhMucService } from "@/services/danhMucService.js";

const TAB_CONFIG = {
    0: {
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
    },
    1: {
        url: "/dm_trieu_chung",
        idField: "ma_trieu_chung",
        nameField: "ten_trieu_chung",
        searchFields: ["ten_trieu_chung", "ma_trieu_chung", "mo_ta"],
        service: {
            get: danhMucService.getTrieuChung,
            create: danhMucService.createTrieuChung,
            update: danhMucService.updateTrieuChung,
            delete: danhMucService.deleteTrieuChung,
        },
        addLabel: "Thêm triệu chứng",
        emptyMessage: "Không có triệu chứng nào.",
        deleteMessage: "Bạn có chắc muốn xoá triệu chứng này?",
        fields: [
            { name: "ten_trieu_chung", label: "Tên triệu chứng", grid: { xs: 12 }, required: true },
            { name: "mo_ta", label: "Mô tả", grid: { xs: 12 }, multiline: true, rows: 3 },
        ],
        initForm: { ten_trieu_chung: "", mo_ta: "" },
        modeTitles: {
            create: "Thêm triệu chứng",
            edit: "Sửa triệu chứng",
            view: "Chi tiết triệu chứng",
        },
    },
};

export default function DanhMucPage() {
    const [tab, setTab] = useState(0);

    return (
        <Stack spacing={3}>
            <Box>
                <Typography variant="h1" sx={{ color: "text.primary" }}>
                    Danh mục nhóm bệnh & triệu chứng
                </Typography>
                <Typography sx={{ mt: 0.75, color: "text.secondary" }}>
                    Quản lý danh mục nhóm bệnh và triệu chứng khám bệnh.
                </Typography>
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                    value={tab}
                    onChange={(_, v) => setTab(v)}
                    textColor="primary"
                    indicatorColor="primary"
                >
                    <Tab label="Nhóm bệnh" />
                    <Tab label="Triệu chứng" />
                </Tabs>
            </Box>

            <DanhMucList key={tab} config={TAB_CONFIG[tab]} />
        </Stack>
    );
}

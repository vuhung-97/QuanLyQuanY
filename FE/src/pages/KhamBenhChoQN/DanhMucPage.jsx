import { useState } from "react";
import { Box, Stack, Tab, Tabs, Typography } from "@mui/material";
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

const BENH_CONFIG = {
    url: "/dm_benh",
    idField: "ma_benh",
    nameField: "ten_benh",
    searchFields: ["ten_benh", "ma_benh", "mo_ta", "ma_nhom_benh"],
    service: {
        get: danhMucService.getBenh,
        create: danhMucService.createBenh,
        update: danhMucService.updateBenh,
        delete: danhMucService.deleteBenh,
    },
    addLabel: "Thêm bệnh",
    emptyMessage: "Không có bệnh nào.",
    deleteMessage: "Bạn có chắc muốn xoá bệnh này?",
    fields: [
        {
            name: "ma_nhom_benh",
            label: "Nhóm bệnh",
            grid: { xs: 12 },
            type: "select",
            optionsUrl: "/dm_nhom_benh",
            valueField: "ma_nhom",
            labelField: "ten_nhom",
        },
        { name: "ten_benh", label: "Tên bệnh", grid: { xs: 12 }, required: true },
        { name: "mo_ta", label: "Mô tả", grid: { xs: 12 }, multiline: true, rows: 3 },
    ],
    initForm: { ten_benh: "", ma_nhom_benh: "", mo_ta: "" },
    modeTitles: {
        create: "Thêm bệnh",
        edit: "Sửa bệnh",
        view: "Chi tiết bệnh",
    },
};

const TRIEU_CHUNG_CONFIG = {
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
        {
            name: "ten_trieu_chung",
            label: "Tên triệu chứng",
            grid: { xs: 12 },
            required: true,
        },
        { name: "mo_ta", label: "Mô tả", grid: { xs: 12 }, multiline: true, rows: 3 },
    ],
    initForm: { ten_trieu_chung: "", mo_ta: "" },
    modeTitles: {
        create: "Thêm triệu chứng",
        edit: "Sửa triệu chứng",
        view: "Chi tiết triệu chứng",
    },
};

const TABS = [
    { value: "nhom-benh", label: "Nhóm bệnh", config: NHOM_BENH_CONFIG },
    { value: "benh", label: "Bệnh", config: BENH_CONFIG },
    { value: "trieu-chung", label: "Triệu chứng", config: TRIEU_CHUNG_CONFIG },
];

export default function DanhMucPage() {
    const [tab, setTab] = useState("nhom-benh");

    const activeConfig =
        TABS.find((t) => t.value === tab)?.config || NHOM_BENH_CONFIG;

    return (
        <Stack spacing={3}>
            <Box>
                <Typography variant="h1" sx={{ color: "text.primary" }}>
                    Danh mục
                </Typography>
                <Typography sx={{ mt: 0.75, color: "text.secondary" }}>
                    Quản lý danh mục nhóm bệnh, bệnh và triệu chứng.
                </Typography>
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                    value={tab}
                    onChange={(_e, v) => setTab(v)}
                    textColor="primary"
                    indicatorColor="primary"
                >
                    {TABS.map((t) => (
                        <Tab key={t.value} value={t.value} label={t.label} />
                    ))}
                </Tabs>
            </Box>

            <DanhMucList key={activeConfig.url} config={activeConfig} />
        </Stack>
    );
}
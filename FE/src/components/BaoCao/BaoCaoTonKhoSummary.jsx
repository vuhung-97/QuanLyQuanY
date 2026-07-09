import { Stack, Typography } from "@mui/material";

export default function BaoCaoTonKhoSummary({ data }) {
    const items = [
        { label: "Tổng tồn đầu", value: data.tong_ton_dau },
        { label: "Tổng nhập", value: data.tong_nhap },
        { label: "Tổng xuất", value: data.tong_xuat },
        { label: "Tổng tồn cuối", value: data.tong_ton_cuoi },
    ];

    return (
        <Stack direction="row" spacing={4} sx={{ mt: 2, justifyContent: "flex-end" }}>
            {items.map((item) => (
                <Typography key={item.label} variant="subtitle2" color="text.secondary">
                    {item.label}: <strong>{item.value?.toLocaleString("vi-VN") ?? 0}</strong>
                </Typography>
            ))}
        </Stack>
    );
}

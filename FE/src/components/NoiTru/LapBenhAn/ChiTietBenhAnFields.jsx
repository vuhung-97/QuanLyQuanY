import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react";
import { Stack } from "@mui/material";
import NormalToggleField from "@/components/common/NormalToggleField";

const CHI_TIET_FIELDS = [
    { label: "Bệnh sử", name: "benh_su", minRows: 3 },
    { label: "Tiền sử bản thân", name: "tien_su_ban_than", minRows: 3 },
    { label: "Tiền sử gia đình", name: "tien_su_gia_dinh", minRows: 3 },
    { label: "Tóm tắt bệnh án", name: "tom_tat_benh_an", minRows: 3, normalText: "Không có" },
    { label: "Chẩn đoán bệnh chính", name: "chan_doan_chinh", minRows: 2 },
    { label: "Chẩn đoán bệnh kèm theo", name: "chan_doan_kem_theo", minRows: 2, normalText: "Không có" },
    { label: "Chẩn đoán phân biệt", name: "chan_doan_phan_biet", minRows: 2, normalText: "Không có" },
];

const DEFAULTS = {
    benh_su: "",
    tien_su_ban_than: "",
    tien_su_gia_dinh: "",
    tom_tat_benh_an: "",
    chan_doan_chinh: "",
    chan_doan_kem_theo: "",
    chan_doan_phan_biet: "",
};

const ChiTietBenhAnFields = forwardRef(function ChiTietBenhAnFields({ initialValues }, ref) {
    const [chiTiet, setChiTiet] = useState({ ...DEFAULTS, ...initialValues });

    useEffect(() => {
        if (initialValues) {
            setChiTiet((prev) => ({ ...prev, ...initialValues }));
        }
    }, [initialValues]);

    const handleChiTietChange = useCallback((e) => {
        const { name, value } = e.target;
        setChiTiet((prev) => ({ ...prev, [name]: value }));
    }, []);

    useImperativeHandle(ref, () => ({ getValues: () => chiTiet }), [chiTiet]);

    return (
        <Stack spacing={2}>
            {CHI_TIET_FIELDS.map((field) => (
                <NormalToggleField
                    key={field.name}
                    label={field.label}
                    name={field.name}
                    value={chiTiet[field.name]}
                    onChange={handleChiTietChange}
                    normalText={field.normalText}
                    multiline
                    minRows={field.minRows}
                    size="medium"
                />
            ))}
        </Stack>
    );
});

export default ChiTietBenhAnFields;

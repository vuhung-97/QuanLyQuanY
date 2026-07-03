import { useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { khoDuocService } from "@/services/khoDuocService.js";

export default function ThuocSearchSelect({ value, onChange, label, sx }) {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleInputChange = async (_, val) => {
        if (!val || val.length < 2) {
            setOptions([]);
            return;
        }
        setLoading(true);
        try {
            const res = await khoDuocService.searchThuocVtyt(val, 20);
            setOptions(res.data || []);
        } catch {
            setOptions([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Autocomplete
            value={value || null}
            onChange={(_, newVal) => onChange(newVal)}
            onInputChange={handleInputChange}
            options={options}
            loading={loading}
            getOptionLabel={(opt) =>
                opt.ten_thuoc_vtyt
                    ? `${opt.ten_thuoc_vtyt}${opt.phan_loai ? ` (${opt.phan_loai})` : ""}`
                    : ""
            }
            isOptionEqualToValue={(opt, val) =>
                opt.ma_thuoc_vtyt === val.ma_thuoc_vtyt
            }
            renderInput={(params) => (
                <TextField {...params} label={label || "Tìm thuốc / VTYT"} size="small" />
            )}
            sx={{ minWidth: 280, ...sx }}
        />
    );
}

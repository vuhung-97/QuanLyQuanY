import { useState, useEffect, useCallback } from "react";
import {
    Autocomplete,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { noiTruService } from "@/services/noiTruService.js";

export default function ThemThuocDialog({ open, onClose, onConfirm }) {
    const [inputValue, setInputValue] = useState("");
    const [options, setOptions] = useState([]);
    const [selected, setSelected] = useState(null);
    const [soLuong, setSoLuong] = useState(1);

    useEffect(() => {
        if (!open) {
            setInputValue("");
            setOptions([]);
            setSelected(null);
            setSoLuong(1);
            return;
        }
    }, [open]);

    useEffect(() => {
        if (inputValue.length < 1) {
            setOptions([]);
            return;
        }
        const timer = setTimeout(async () => {
            try {
                const res = await noiTruService.searchThuoc(inputValue, 20);
                setOptions(res.data || []);
            } catch {
                setOptions([]);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [inputValue]);

    const handleConfirm = useCallback(() => {
        if (!selected) return;
        onConfirm({
            ma_thuoc_vtyt: selected.ma_thuoc_vtyt,
            ten_thuoc_vtyt: selected.ten_thuoc_vtyt,
            don_vi_tinh: selected.don_vi_tinh,
        });
        onClose();
    }, [selected, onConfirm, onClose]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Thêm thuốc / VTYT</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ pt: 1 }}>
                    <Autocomplete
                        size="small"
                        options={options}
                        inputValue={inputValue}
                        onInputChange={(_, v) => setInputValue(v)}
                        getOptionLabel={(o) =>
                            `${o.ten_thuoc_vtyt} (${o.don_vi_tinh || "?"})`
                        }
                        isOptionEqualToValue={(o, v) =>
                            o.ma_thuoc_vtyt === v.ma_thuoc_vtyt
                        }
                        value={selected}
                        onChange={(_, newVal) => setSelected(newVal)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Tìm thuốc / VTYT"
                                autoFocus
                            />
                        )}
                        noOptionsText={
                            inputValue.length < 1
                                ? "Gõ để tìm kiếm..."
                                : "Không tìm thấy"
                        }
                    />
                    {selected && (
                        <TextField
                            label="Số lượng"
                            type="number"
                            value={soLuong}
                            onChange={(e) =>
                                setSoLuong(
                                    Math.max(1, parseInt(e.target.value) || 1),
                                )
                            }
                            slotProps={{ htmlInput: { min: 1 } }}
                        />
                    )}
                    {selected && (
                        <Typography variant="body2" color="text.secondary">
                            Đơn vị tính: {selected.don_vi_tinh || "--"}
                        </Typography>
                    )}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} sx={{ textTransform: "none" }}>
                    Hủy
                </Button>
                <Button
                    variant="contained"
                    onClick={handleConfirm}
                    disabled={!selected}
                    sx={{ textTransform: "none" }}
                >
                    Thêm
                </Button>
            </DialogActions>
        </Dialog>
    );
}

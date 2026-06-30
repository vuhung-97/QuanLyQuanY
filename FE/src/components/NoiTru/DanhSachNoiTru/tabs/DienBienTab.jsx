import { Button, Stack } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import PhieuChamSocList from "../PhieuChamSocList.jsx";

export default function DienBienTab({ records, readOnly = false, onAddNew, onEdit }) {
    return (
        <Stack spacing={2}>
            {!readOnly && (
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={onAddNew}
                    sx={{ textTransform: "none", alignSelf: "flex-start" }}
                >
                    Thêm phiếu chăm sóc
                </Button>
            )}
            <PhieuChamSocList records={records} readOnly={readOnly} onEdit={onEdit} />
        </Stack>
    );
}

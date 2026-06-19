import { Dialog } from "@mui/material";
import PlaceHolderPage from "../common/PlaceHolderPage.jsx";

export default function LichSuKhamBenh({ open, onClose }) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <PlaceHolderPage title="Chức năng lịch sử khám" />
        </Dialog>
    );
}

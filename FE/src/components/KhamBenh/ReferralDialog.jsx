import { Dialog } from "@mui/material";
import PlaceHolderPage from "../common/PlaceHolderPage.jsx";

export default function ReferralDialog({ open, onClose }) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <PlaceHolderPage title="Chức năng chuyển tuyến" />
        </Dialog>
    );
}

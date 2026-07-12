import PrintDialog from "@/components/common/print/PrintDialog.jsx";
import BaoCaoQuanSoKhoePrint from "./BaoCaoQuanSoKhoePrint.jsx";

export default function BaoCaoQuanSoKhoePrintDialog({ open, onClose, data }) {
    return (
        <PrintDialog
            open={open}
            onClose={onClose}
            title="In báo cáo quân số khỏe"
            screenClass="quan-so-khoe-print"
        >
            <BaoCaoQuanSoKhoePrint data={data} />
        </PrintDialog>
    );
}

import PrintDialog from "@/components/common/print/PrintDialog.jsx";
import KetQuaKhamPrint from "./KetQuaKhamPrint.jsx";

export default function KetQuaKhamPrintDialog({ open, onClose, data }) {
    return (
        <PrintDialog
            open={open}
            onClose={onClose}
            title="In báo cáo"
            screenClass="ket-qua-kham-print"
        >
            <KetQuaKhamPrint data={data} />
        </PrintDialog>
    );
}

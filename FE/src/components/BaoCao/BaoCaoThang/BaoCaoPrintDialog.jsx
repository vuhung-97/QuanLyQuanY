import PrintDialog from "@/components/common/print/PrintDialog.jsx";
import BaoCaoThangPrint from "./BaoCaoThangPrint.jsx";

export default function BaoCaoPrintDialog({ open, onClose, data }) {
    return (
        <PrintDialog
            open={open}
            onClose={onClose}
            title="In báo cáo"
            screenClass="bao-cao-thang-print"
        >
            <BaoCaoThangPrint data={data} />
        </PrintDialog>
    );
}

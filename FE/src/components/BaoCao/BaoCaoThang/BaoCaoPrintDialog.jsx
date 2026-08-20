import PrintDialog from "@/components/common/print/PrintDialog.jsx";
import BaoCaoThangPrint from "./BaoCaoThangPrint.jsx";

export default function BaoCaoPrintDialog({ open, onClose, data }) {
    return (
        <PrintDialog
            open={open}
            onClose={onClose}
            title="In báo cáo"
            documentTitle={`Bao_cao_thong_ke_quan_y_${data?.thang ? `thang_${data.thang}_` : ""}nam_${data?.nam ?? "YYYY"}`}
            screenClass="bao-cao-thang-print"
        >
            <BaoCaoThangPrint data={data} />
        </PrintDialog>
    );
}

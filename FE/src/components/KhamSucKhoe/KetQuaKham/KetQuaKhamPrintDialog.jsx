import PrintDialog from "@/components/common/print/PrintDialog.jsx";
import KetQuaKhamPrint from "./KetQuaKhamPrint.jsx";
import { toFileDate } from "@/utils/printUtils.js";

export default function KetQuaKhamPrintDialog({ open, onClose, data }) {
    const schedule = data?.schedule;
    const documentTitle = schedule?.thoi_gian_bat_dau
        ? `Bao_cao_ket_qua_kham_suc_khoe_dot_${toFileDate(schedule.thoi_gian_bat_dau)}_den_${toFileDate(schedule.thoi_gian_ket_thuc)}`
        : schedule?.nam
          ? `Bao_cao_ket_qua_kham_suc_khoe_nam_${schedule.nam}`
          : "Bao_cao_ket_qua_kham_suc_khoe";

    return (
        <PrintDialog
            open={open}
            onClose={onClose}
            title="In báo cáo"
            documentTitle={documentTitle}
            screenClass="ket-qua-kham-print"
        >
            <KetQuaKhamPrint data={data} />
        </PrintDialog>
    );
}

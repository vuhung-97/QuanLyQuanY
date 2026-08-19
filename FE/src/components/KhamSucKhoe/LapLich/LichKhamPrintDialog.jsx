import { useEffect, useState } from "react";
import PrintDialog from "@/components/common/print/PrintDialog.jsx";
import LichKhamPrint from "./LichKhamPrint.jsx";
import { khamSucKhoeService } from "@/services/khamSucKhoeService.js";

export default function LichKhamPrintDialog({
    open,
    onClose,
    schedule,
    chiTietList,
    unitOptions,
}) {
    const [assignments, setAssignments] = useState([]);

    useEffect(() => {
        if (!open || !schedule?.ma_lich_kham) {
            setAssignments([]);
            return;
        }
        let ignore = false;
        khamSucKhoeService
            .getAssignments(schedule.ma_lich_kham)
            .then((res) => {
                if (!ignore) {
                    setAssignments(Array.isArray(res.data) ? res.data : []);
                }
            })
            .catch(() => {
                if (!ignore) setAssignments([]);
            });
        return () => {
            ignore = true;
        };
    }, [open, schedule]);

    return (
        <PrintDialog
            open={open}
            onClose={onClose}
            title="In lịch khám sức khỏe định kỳ"
            maxWidth="lg"
            screenClass="lich-kham-print-overlay"
        >
            <LichKhamPrint
                schedule={schedule}
                chiTietList={chiTietList}
                unitOptions={unitOptions}
                assignments={assignments}
            />
        </PrintDialog>
    );
}
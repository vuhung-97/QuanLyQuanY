import ChonQuanNhanDialog from "@/components/common/ChonQuanNhanDialog.jsx";
import { khamBenhService } from "@/services/khamBenhService.js";

export default function TiepNhanQnDialog(props) {
    return (
        <ChonQuanNhanDialog
            title="Danh sách quân nhân"
            fetchFn={khamBenhService.getQuanNhanDanhSach}
            {...props}
        />
    );
}

import PrintOverlay from "@/components/common/print/PrintOverlay.jsx";
import PrintHeaderDonVi from "@/components/common/print/PrintHeaderDonVi.jsx";
import { getStatus } from "@/components/KhamSucKhoe/KhamSucKhoeUtils.js";

export default function KhamSucKhoePrint({ data, paperSize = "A4" }) {
    const {
        soldiers,
        nam,
        phieuMap,
        unitLookup,
        totalQuanSo = 0,
        daKhamCount = 0,
        chuaKhamCount = 0,
        donViCount = 0,
    } = data;
    const title = `DANH SÁCH QUÂN NHÂN CHƯA KHÁM SỨC KHỎE NĂM ${nam || ""}`;

    const headers = [
        "STT",
        "Họ tên",
        "Đơn vị",
        "Cấp bậc",
        "Chức vụ",
        "Tình trạng khám",
    ];

    return (
        <PrintOverlay
            className="kham-suc-khoe-print"
            paperSize={paperSize}
            fontSize="13pt"
        >
            <PrintHeaderDonVi />
            <div style={{ margin: "12pt 0", textAlign: "center" }}>
                <p
                    style={{
                        fontSize: "16pt",
                        textTransform: "uppercase",
                        fontWeight: "bold",
                        margin: 0,
                    }}
                >
                    {title}
                </p>
            </div>
            <table>
                <thead>
                    <tr>
                        {headers.map((h, i) => (
                            <th key={i}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {soldiers.map((qn, idx) => {
                        const donVi =
                            unitLookup?.get(qn.ma_don_vi) || qn.ma_don_vi || "";
                        return (
                            <tr key={qn.ma_quan_nhan}>
                                <td style={{ textAlign: "center" }}>
                                    {idx + 1}
                                </td>
                                <td>{qn.ho_ten || ""}</td>
                                <td>{donVi}</td>
                                <td>{qn.cap_bac || ""}</td>
                                <td>{qn.chuc_vu || ""}</td>
                                <td style={{ textAlign: "center" }}>
                                    {getStatus(phieuMap?.[qn.ma_quan_nhan])}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {/* Tổng hợp */}
            <div style={{ marginTop: "12pt", lineHeight: 1.6 }}>
                <div style={{ fontWeight: "bold" }}>Tổng hợp:</div>
                <div style={{ textIndent: "24pt" }}>
                    - Tổng quân số: {totalQuanSo} người.
                </div>
                <div style={{ textIndent: "24pt" }}>
                    - Đã khám: {daKhamCount} người.
                </div>
                <div style={{ textIndent: "24pt" }}>
                    - Chưa khám: {chuaKhamCount} người.
                </div>
            </div>

            {/* Yêu cầu */}
            <div style={{ marginTop: "12pt", lineHeight: 1.6 }}>
                <div style={{ fontWeight: "bold" }}>Yêu cầu:</div>
                <div style={{ textIndent: "24pt" }}>
                    - Các cá nhân chưa khám thực hiện khám bổ sung theo lịch đã
                    gửi.
                </div>
                <div style={{ textIndent: "24pt" }}>
                    - Chỉ huy đơn vị chịu trách nhiệm đôn đốc, nhắc nhở.
                </div>
            </div>

            {/* Chân trang / Chữ ký */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginTop: "20pt",
                }}
            >
                {/* Nơi nhận (Bên trái) */}
                <div style={{ lineHeight: 1.5, fontSize: "11pt" }}>
                    <div style={{ fontWeight: "bold", fontStyle: "italic" }}>
                        Nơi nhận:
                    </div>
                    <div style={{ fontStyle: "italic" }}>
                        - Các cơ quan, đơn vị;
                    </div>
                    <div style={{ fontStyle: "italic" }}>
                        - Lưu: {donViCount} bản.
                    </div>
                </div>

                {/* Chữ ký (Bên phải) */}
                <div style={{ textAlign: "center", minWidth: "200px" }}>
                    <div
                        style={{
                            fontWeight: "bold",
                            textTransform: "uppercase",
                        }}
                    >
                        CHỦ NHIỆM QUÂN Y
                    </div>
                </div>
            </div>
        </PrintOverlay>
    );
}

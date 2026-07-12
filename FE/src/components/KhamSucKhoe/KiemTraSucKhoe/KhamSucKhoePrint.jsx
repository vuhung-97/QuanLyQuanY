import PrintOverlay from "@/components/common/print/PrintOverlay.jsx";
import PrintHeaderDonVi from "@/components/common/print/PrintHeaderDonVi.jsx";
import PrintSignature from "@/components/common/print/PrintSignature.jsx";

const TRANG_THAI_LABEL = {
    chua_kham: "Chưa khám",
    dang_kham: "Đang khám",
    da_kham: "Đã khám",
};

function getStatusLabel(phieu) {
    if (!phieu) return "Chưa khám";
    return TRANG_THAI_LABEL[phieu.trang_thai] || "Chưa khám";
}

export default function KhamSucKhoePrint({ data, paperSize = "A4" }) {
    const { soldiers, type, nam, phieuMap, unitLookup } = data;
    const isChuaLayMau = type === "chua_lay_mau";
    const title = isChuaLayMau
        ? `DANH SÁCH QUÂN NHÂN CHƯA LẤY MÁU NĂM ${nam || ""}`
        : `DANH SÁCH QUÂN NHÂN CHƯA KHÁM SỨC KHỎE NĂM ${nam || ""}`;

    const headers = isChuaLayMau
        ? ["STT", "Họ tên", "Đơn vị", "Cấp bậc", "Chức vụ"]
        : ["STT", "Họ tên", "Đơn vị", "Cấp bậc", "Chức vụ", "Tình trạng khám"];

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
                            unitLookup?.get(qn.ma_don_vi) ||
                            qn.ma_don_vi ||
                            "";
                        return (
                            <tr key={qn.ma_quan_nhan}>
                                <td style={{ textAlign: "center" }}>
                                    {idx + 1}
                                </td>
                                <td>{qn.ho_ten || ""}</td>
                                <td>{donVi}</td>
                                <td>{qn.cap_bac || ""}</td>
                                <td>{qn.chuc_vu || ""}</td>
                                {!isChuaLayMau && (
                                    <td style={{ textAlign: "center" }}>
                                        {getStatusLabel(
                                            phieuMap?.[qn.ma_quan_nhan],
                                        )}
                                    </td>
                                )}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <PrintSignature
                justify="space-between"
                items={[
                    { label: "NGƯỜI LẬP" },
                    { label: "CHỦ NHIỆM QUÂN Y", date: true },
                ]}
                style={{ padding: "0 20px" }}
            />
        </PrintOverlay>
    );
}

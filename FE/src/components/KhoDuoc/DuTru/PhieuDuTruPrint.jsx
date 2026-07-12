import dayjs from "dayjs";
import PrintOverlay from "@/components/common/print/PrintOverlay.jsx";
import PrintHeaderDonVi from "@/components/common/print/PrintHeaderDonVi.jsx";
import PrintSignature from "@/components/common/print/PrintSignature.jsx";

export default function PhieuDuTruPrint({ data }) {
    return (
        <PrintOverlay
            className="phieu-du-tru-print"
            paperSize="A4"
            fontSize="14pt"
            fixed={false}
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
                    PHIẾU DỰ TRÙ
                </p>
                <p style={{ margin: 0 }}>
                    <strong>Mã:</strong> {data.maPhieu}
                </p>
                <p style={{ margin: 0 }}>
                    <strong>Ngày lập: </strong>
                    {dayjs(data.ngayLap).format("DD/MM/YYYY")}
                </p>
            </div>

            {data.ghiChu && (
                <p>
                    <strong>Ghi chú:</strong> {data.ghiChu}
                </p>
            )}

            <p>
                <strong>Danh sách thuốc / VTYT</strong>
            </p>
            <table>
                <thead>
                    <tr>
                        <th style={{ width: 50 }}>STT</th>
                        <th>Tên thuốc / VTYT</th>
                        <th style={{ width: 80 }}>ĐVT</th>
                        <th style={{ width: 100 }}>Số lượng</th>
                    </tr>
                </thead>
                <tbody>
                    {data.items.map((item, idx) => (
                        <tr key={idx}>
                            <td style={{ textAlign: "center" }}>{idx + 1}</td>
                            <td>{item.tenThuoc}</td>
                            <td style={{ textAlign: "center" }}>
                                {item.donViTinh || "—"}
                            </td>
                            <td className="so-luong">{item.soLuong}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <PrintSignature
                justify="space-between"
                items={[{ label: "NGƯỜI LẬP" }, { label: "CHỦ NHIỆM QUÂN Y" }]}
                style={{ padding: "0 20px" }}
            />
        </PrintOverlay>
    );
}

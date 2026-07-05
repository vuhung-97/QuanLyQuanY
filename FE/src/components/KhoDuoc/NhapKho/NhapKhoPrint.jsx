import dayjs from "dayjs";
import PrintOverlay from "@/components/common/print/PrintOverlay.jsx";
import PrintHeaderDonVi from "@/components/common/print/PrintHeaderDonVi.jsx";
import PrintSignature from "@/components/common/print/PrintSignature.jsx";

export default function NhapKhoPrint({ data }) {
    return (
        <PrintOverlay className="nhap-kho-print" paperSize="A4" fontSize="20pt">
            <PrintHeaderDonVi />

            <div style={{ margin: "12pt 0", textAlign: "center" }}>
                <p
                    style={{
                        fontSize: "22pt",
                        textTransform: "uppercase",
                        fontWeight: "bold",
                        margin: 0,
                    }}
                >
                    PHIẾU NHẬP KHO
                </p>
                <p style={{ margin: 0 }}>
                    <strong>Mã phiếu nhập:</strong> {data.maPhieuNhap}
                </p>
                <p style={{ margin: 0 }}>
                    <strong>Mã phiếu dự trù:</strong> {data.maPhieuDuTru}
                </p>
                <p style={{ margin: 0 }}>
                    <strong>Ngày nhập: </strong>
                    {dayjs(data.ngayNhap).format("DD/MM/YYYY")}
                </p>
            </div>

            <p>
                <strong>Người nhập:</strong> {data.nguoiNhap || "—"}
            </p>

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
                            <td>{item.ten_thuoc_vtyt}</td>
                            <td style={{ textAlign: "center" }}>
                                {item.don_vi_tinh || "—"}
                            </td>
                            <td className="so-luong">{item.so_luong}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <PrintSignature
                justify="space-between"
                items={[{ label: "NGƯỜI NHẬP" }, { label: "CHỦ NHIỆM QUÂN Y" }]}
                style={{ padding: "0 20px" }}
            />
        </PrintOverlay>
    );
}

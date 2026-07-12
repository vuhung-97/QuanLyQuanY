import dayjs from "dayjs";
import PrintOverlay from "@/components/common/print/PrintOverlay.jsx";
import PrintHeaderDonVi from "@/components/common/print/PrintHeaderDonVi.jsx";
import PrintSignature from "@/components/common/print/PrintSignature.jsx";

export default function PhieuXuatPrint({ data, paperSize = "A4" }) {
    return (
        <PrintOverlay
            className="phieu-xuat-print"
            paperSize={paperSize}
            fontSize="14pt"
        >
            <PrintHeaderDonVi />

            <div style={{ margin: "12pt 0", textAlign: "center" }}>
                <p
                    style={{
                        fontSize: "16pt",
                        textTransform: "uppercase",
                        fontWeight: "bold",
                        m: 0,
                    }}
                >
                    PHIẾU XUẤT KHO
                </p>
                <p style={{ margin: 0 }}>
                    <strong>Mã:</strong> {data.maPhieu}
                </p>
                <p style={{ margin: 0 }}>
                    <strong>Ngày: </strong>{" "}
                    {dayjs(data.ngayThangNam).format("DD/MM/YYYY")}
                </p>
            </div>
            <p>
                <strong>I. Thông tin người nhận</strong>
            </p>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "6pt",
                    marginLeft: "12pt",
                    marginBottom: "6pt",
                }}
            >
                <p style={{ margin: 0 }}>
                    <strong>Người nhận:</strong> {data.hoTenNguoiNhan || "—"}
                </p>
                <p style={{ margin: 0 }}>
                    <strong>Cấp bậc:</strong> {data.capBac || "—"}
                </p>
                <p style={{ margin: 0 }}>
                    <strong>Chức vụ:</strong> {data.chucVu || "—"}
                </p>

                <p style={{ margin: 0 }}>
                    <strong>Đơn vị:</strong> {data.qnTenDonVi || "—"}
                </p>
                <p style={{ margin: 0 }}>
                    <strong>Đơn vị nhận:</strong> {data.tenDonViNhan || "—"}
                </p>

                <p style={{ margin: 0, gridColumn: "1 / -1" }}>
                    <strong>Lý do xuất:</strong> {data.lyDoXuat || "—"}
                </p>
                <p style={{ margin: 0, gridColumn: "1 / -1" }}>
                    <strong>Ghi chú:</strong> {data.ghiChu || "—"}
                </p>
            </div>
            <p>
                <strong>II. Danh sách thuốc / VTYT</strong>
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
                        <tr key={item.ma_thuoc_vtyt}>
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
                items={[
                    { label: "NGƯỜI NHẬN" },
                    { label: "NGƯỜI XUẤT" },
                    { label: "CHỦ NHIỆM QUÂN Y", date: true },
                ]}
            />
        </PrintOverlay>
    );
}

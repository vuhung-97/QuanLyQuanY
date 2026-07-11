import { formatDate } from "@/utils/date.js";
import PrintOverlay from "@/components/common/print/PrintOverlay.jsx";
import PrintHeaderDonVi from "@/components/common/print/PrintHeaderDonVi.jsx";
import PrintSignature from "@/components/common/print/PrintSignature.jsx";

export default function DonThuocPrint({ data, paperSize = "A5" }) {
    return (
        <PrintOverlay
            className="don-thuoc-print"
            paperSize={paperSize}
            fontSize="11pt"
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "flex-start",
                    marginBottom: "6pt",
                }}
            >
                <PrintHeaderDonVi />
                <div style={{ textAlign: "center" }}>
                    <div
                        style={{
                            fontSize: "13pt",
                            textTransform: "uppercase",
                            fontWeight: "bold",
                        }}
                    >
                        ĐƠN THUỐC
                    </div>
                    <p style={{ margin: 0 }}>
                        <strong>Mã KB:</strong> {data.maKB}
                    </p>
                    <p style={{ margin: 0 }}>
                        <strong>Ngày khám:</strong> {formatDate(data.ngayKham)}
                    </p>
                </div>
            </div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                <p>
                    <strong>Họ tên:</strong> {data.hoTenQN || "—"}
                </p>
                <p>
                    <strong>Cấp bậc:</strong> {data.capBac || "—"}
                </p>
            </div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                <p>
                    <strong> Chức vụ:</strong> {data.chucVu || "—"}
                </p>
                <p>
                    <strong> Đơn vị:</strong> {data.tenDonVi || "—"}
                </p>
            </div>

            {data.chanDoan && (
                <p>
                    <strong>Chẩn đoán:</strong> {data.chanDoan}
                </p>
            )}

            {data.phuongPhapDieuTri && (
                <p>
                    <strong>Phương pháp điều trị:</strong>{" "}
                    {data.phuongPhapDieuTri}
                </p>
            )}

            <table>
                <thead>
                    <tr>
                        <th style={{ width: "7%" }}>STT</th>
                        <th style={{ width: "30%" }}>Thuốc-SL-ĐVT</th>
                        <th style={{ width: "63%" }}>Hướng dẫn sử dụng</th>
                    </tr>
                </thead>
                <tbody>
                    {data.prescriptionRows.map((row, idx) => (
                        <tr key={idx}>
                            <td style={{ textAlign: "center" }}>{idx + 1}</td>
                            <td style={{ fontWeight: "bold" }}>
                                {row.ten_thuoc || row.ten_thuoc_vtyt || "--"}:{" "}
                                {row.so_luong} {row.don_vi_tinh || "--"}
                            </td>
                            <td>
                                <div>
                                    {row.lieu} | {row.cach_dung || "Uống"} |{" "}
                                    {row.thoi_diem || "Sau ăn"}
                                </div>

                                {row.ghi_chu && (
                                    <div>
                                        <strong>Ghi chú:</strong> {row.ghi_chu}
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <PrintSignature
                justify="flex-end"
                items={[
                    {
                        label: "NGƯỜI CẤP THUỐC",
                        name: data.nguoiCapThuoc,
                    },
                ]}
                date
            />
        </PrintOverlay>
    );
}

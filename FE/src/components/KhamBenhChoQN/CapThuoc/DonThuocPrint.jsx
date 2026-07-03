import { formatDate } from "@/utils/date.js";
import PrintOverlay from "@/components/common/print/PrintOverlay.jsx";
import PrintHeaderDonVi from "@/components/common/print/PrintHeaderDonVi.jsx";
import PrintSignature from "@/components/common/print/PrintSignature.jsx";

export default function DonThuocPrint({ data, paperSize = "A5" }) {
    return (
        <PrintOverlay className="don-thuoc-print" paperSize={paperSize}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "flex-start",
                    marginBottom: "12pt",
                }}
            >
                <PrintHeaderDonVi />
                <div style={{ textAlign: "center" }}>
                    <div
                        style={{
                            fontSize: "18pt",
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

            <p>
                <strong>Họ tên:</strong> {data.hoTenQN || "—"}
            </p>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                <p>
                    <strong>Cấp bậc:</strong> {data.capBac || "—"}
                </p>
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
                        <th style={{ width: 40 }}>STT</th>
                        <th>Tên thuốc</th>
                        <th style={{ width: 50 }}>SL</th>
                        <th style={{ width: 50 }}>ĐVT</th>
                        <th>Hướng dẫn sử dụng</th>
                    </tr>
                </thead>
                <tbody>
                    {data.prescriptionRows.map((row, idx) => (
                        <tr key={idx}>
                            <td style={{ textAlign: "center" }}>{idx + 1}</td>
                            <td style={{ fontWeight: "bold" }}>
                                {row.ten_thuoc || row.ten_thuoc_vtyt || "--"}
                            </td>
                            <td className="so-luong">{row.so_luong}</td>
                            <td style={{ textAlign: "center" }}>
                                {row.don_vi_tinh || "—"}
                            </td>
                            <td>
                                {row.lieu && (
                                    <div>
                                        <strong>Liều:</strong> {row.lieu}
                                    </div>
                                )}
                                <div>
                                    <strong>Cách dùng:</strong>{" "}
                                    {row.cach_dung || "Uống"} |{" "}
                                    <strong>Thời điểm:</strong>{" "}
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

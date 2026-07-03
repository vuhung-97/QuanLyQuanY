import dayjs from "dayjs";

const styles = `
.phieu-xuat-print { display: none; }
@media print {
    html, body { height: auto; overflow: visible; }
    body * { visibility: hidden !important; }
    .phieu-xuat-print, .phieu-xuat-print * { visibility: visible !important; }
    .phieu-xuat-print { display: block !important; position: fixed; left: 0; top: 0; width: 100%; padding: 2cm 1.5cm 2cm 3cm; font-size: 14pt; font-family: Times New Roman; background: #fff; z-index: 9999; }
    .phieu-xuat-print p { margin: 3pt 0; line-height: 1.4; }
    .phieu-xuat-print table { width: 100%; border-collapse: collapse; margin-top: 6pt; }
    .phieu-xuat-print th, .phieu-xuat-print td { border: 1px solid #000; padding: 6px 10px; text-align: left; }
    .phieu-xuat-print th { font-weight: bold; text-align: center; }
    .phieu-xuat-print td.so-luong { text-align: right; }
}
`;

export default function PhieuXuatPrint({ data }) {
    return (
        <>
            <style>{styles}</style>
            <div className="phieu-xuat-print">
                <div style={{ textAlign: "center" }}>
                    <div style={{ textTransform: "uppercase" }}>
                        LỮ ĐOÀN 170
                    </div>
                    <div
                        style={{
                            fontWeight: "bold",
                            textTransform: "uppercase",
                        }}
                    >
                        PHÒNG HC-KT
                    </div>
                </div>
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
                        <strong>Ngày, tháng, năm:</strong>{" "}
                        {dayjs(data.ngayThangNam).format("DD/MM/YYYY")}
                    </p>
                </div>

                <p>
                    <strong>Họ tên người nhận:</strong>{" "}
                    {data.hoTenNguoiNhan || "—"}
                </p>
                <p>
                    <strong>Cấp bậc:</strong> {data.capBac || "—"}
                </p>
                <p>
                    <strong>Chức vụ:</strong> {data.chucVu || "—"}
                </p>
                <p>
                    <strong>Đơn vị:</strong> {data.qnTenDonVi || "—"}
                </p>
                <p>
                    <strong>Đơn vị nhận:</strong> {data.tenDonViNhan || "—"}
                </p>
                <p>
                    <strong>Lý do xuất:</strong> {data.lyDoXuat || "—"}
                </p>
                <p>
                    <strong>Ghi chú:</strong> {data.ghiChu || "—"}
                </p>

                <h3 style={{ fontWeight: "bold", margin: "16px 0 8px" }}>
                    Danh sách thuốc và vật tư y tế
                </h3>

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
                                <td style={{ textAlign: "center" }}>
                                    {idx + 1}
                                </td>
                                <td>{item.ten_thuoc_vtyt}</td>
                                <td style={{ textAlign: "center" }}>
                                    {item.don_vi_tinh || "—"}
                                </td>
                                <td className="so-luong">{item.so_luong}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: 40,
                        padding: "0 20px",
                    }}
                >
                    <div style={{ textAlign: "center", fontWeight: "bold" }}>
                        NGƯỜI NHẬN
                    </div>
                    <div style={{ textAlign: "center", fontWeight: "bold" }}>
                        NGƯỜI XUẤT
                    </div>
                    <div style={{ textAlign: "center", fontWeight: "bold" }}>
                        CHỦ NHIỆM QUÂN Y
                    </div>
                </div>
            </div>
        </>
    );
}

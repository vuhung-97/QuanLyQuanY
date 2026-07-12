import PrintOverlay from "@/components/common/print/PrintOverlay.jsx";
import PrintHeaderDonVi from "@/components/common/print/PrintHeaderDonVi.jsx";
import PrintSignature from "@/components/common/print/PrintSignature.jsx";

const cellCenter = { textAlign: "center" };
const cellRight = { textAlign: "right" };

export default function BaoCaoQuanSoKhoePrint({ data, paperSize = "A4" }) {
    const { thang, nam, don_vi, tong_quan } = data;

    return (
        <PrintOverlay
            className="quan-so-khoe-print"
            paperSize={paperSize}
            fontSize="13pt"
        >
            <PrintHeaderDonVi />

            <div style={{ margin: "12pt 0", textAlign: "center" }}>
                <p
                    style={{
                        fontSize: "16pt",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        margin: 0,
                    }}
                >
                    BÁO CÁO QUÂN SỐ KHỎE
                </p>
                <p style={{ margin: "4pt 0" }}>
                    Tháng {thang} / Năm {nam}
                </p>
            </div>

            <table>
                <thead>
                    <tr>
                        <th style={{ width: 40 }}>STT</th>
                        <th>Đơn vị</th>
                        <th style={{ width: 100 }}>Tổng quân số</th>
                        <th style={{ width: 90 }}>Người ốm</th>
                        <th style={{ width: 90 }}>Lượt ốm</th>
                        <th style={{ width: 100 }}>Quân số khỏe</th>
                        <th style={{ width: 80 }}>Tỷ lệ (%)</th>
                    </tr>
                </thead>
                <tbody>
                    {don_vi.map((dv, idx) => (
                        <tr key={dv.ma_don_vi}>
                            <td style={cellCenter}>{idx + 1}</td>
                            <td>{dv.ten_don_vi}</td>
                            <td style={cellCenter}>{dv.quan_so}</td>
                            <td style={cellCenter}>{dv.so_nguoi_om}</td>
                            <td style={cellCenter}>{dv.so_luot_om}</td>
                            <td style={cellCenter}>{dv.quan_so_khoe}</td>
                            <td style={cellRight}>{dv.ty_le_khoe}%</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <table style={{ marginTop: 0 }}>
                <tbody>
                    <tr style={{ fontWeight: "bold" }}>
                        <td style={{ width: 40, border: "none" }}></td>
                        <td style={{ border: "none" }}>Tổng cộng</td>
                        <td style={{ width: 100, border: "none", textAlign: "center" }}>
                            {tong_quan.tong_quan_so}
                        </td>
                        <td style={{ width: 90, border: "none", textAlign: "center" }}>
                            {tong_quan.tong_nguoi_om}
                        </td>
                        <td style={{ width: 90, border: "none", textAlign: "center" }}>
                            {tong_quan.tong_luot_om}
                        </td>
                        <td style={{ width: 100, border: "none", textAlign: "center" }}>
                            {tong_quan.quan_so_khoe}
                        </td>
                        <td style={{ width: 80, border: "none", textAlign: "right" }}>
                            {tong_quan.ty_le_khoe}%
                        </td>
                    </tr>
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

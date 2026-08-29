import PrintOverlay from "@/components/common/print/PrintOverlay.jsx";
import { formatDateTime } from "@/utils/date.js";
import { UNIT_NAME } from "@/components/layout/common/constants.js";

const tableHeadStyle = {
    fontWeight: "bold",
    textAlign: "center",
    border: "1px solid #000",
    padding: "3pt 3pt",
};
const tableCellStyle = { border: "1px solid #000", padding: "3pt 3pt" };
const tableCellCenter = { ...tableCellStyle, textAlign: "center" };
const tableCellRight = { ...tableCellStyle, textAlign: "right" };

function Table({ headers, widths, children }) {
    return (
        <table
            style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "6pt",
                tableLayout: "fixed",
            }}
        >
            <thead>
                <tr>
                    {headers.map((h, i) => (
                        <th
                            key={i}
                            style={{
                                ...tableHeadStyle,
                                width: widths?.[i],
                            }}
                        >
                            {h}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>{children}</tbody>
        </table>
    );
}

function formatRange(batDau, ketThuc) {
    const s = formatDateTime(batDau);
    const e = formatDateTime(ketThuc);
    if (s === "--" && e === "--") return "--";
    return `${s} - ${e}`;
}

export default function LichKhamPrint({ schedule, chiTietList, unitOptions }) {
    const unitMap = new Map((unitOptions ?? []).map((u) => [u.ma_don_vi, u]));
    const chiTiet = Array.isArray(chiTietList) ? chiTietList : [];

    const namHienThi =
        schedule?.nam ||
        (schedule?.thoi_gian_bat_dau
            ? new Date(schedule.thoi_gian_bat_dau).getFullYear()
            : new Date().getFullYear());

    const getRange = (d, fieldBatDau, fieldKetThuc) =>
        formatRange(
            d?.[fieldBatDau] || schedule?.[fieldBatDau],
            d?.[fieldKetThuc] || schedule?.[fieldKetThuc],
        );

    return (
        <PrintOverlay
            className="lich-kham-print-overlay"
            paperSize="A4"
            fontSize="14pt"
        >
            {/* Header: Left (Đơn vị) & Right (Quốc hiệu tiêu ngữ) */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "12pt",
                }}
            >
                <div style={{ textAlign: "center" }}>
                    <div
                        style={{
                            textTransform: "uppercase",
                        }}
                    >
                        {UNIT_NAME.toUpperCase()}
                    </div>
                    <div
                        style={{
                            textTransform: "uppercase",
                            fontWeight: "bold",
                        }}
                    >
                        PHÒNG HC-KT
                    </div>
                </div>
                <div style={{ textAlign: "center" }}>
                    <div
                        style={{
                            textTransform: "uppercase",
                            fontWeight: "bold",
                        }}
                    >
                        CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                    </div>
                    <div style={{ fontWeight: "bold" }}>
                        Độc lập - Tự do - Hạnh phúc
                    </div>
                    <div style={{ fontStyle: "italic", marginTop: "2pt" }}>
                        ..., Ngày ... tháng ... năm ....
                    </div>
                </div>
            </div>

            {/* Dòng trống & Tiêu đề báo cáo */}
            <div style={{ margin: "16pt 0 12pt 0", textAlign: "center" }}>
                <p
                    style={{
                        fontSize: "16pt",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        margin: 0,
                    }}
                >
                    THÔNG BÁO LỊCH KHÁM SỨC KHỎE ĐỊNH KỲ NĂM {namHienThi}
                </p>
            </div>

            {/* Nội dung dẫn nhập */}
            <div style={{ lineHeight: 1.6, marginBottom: "12pt" }}>
                <div style={{ textIndent: "24pt" }}>
                    Căn cứ kế hoạch khám sức khỏe năm {namHienThi} của đơn vị;
                </div>
                <div style={{ textIndent: "24pt" }}>
                    Nhằm đảm bảo công tác theo dõi, quản lý và nâng cao chất
                    lượng sức khỏe cho cán bộ, chiến sĩ,
                </div>
                <div style={{ textIndent: "24pt" }}>
                    Quân y thông báo lịch khám sức khỏe như sau:
                </div>
            </div>

            {/* Bảng lịch khám */}
            <Table
                headers={[
                    "STT",
                    "Tên đơn vị",
                    "Quân số",
                    "Thời gian chi tiết",
                    "Địa điểm",
                ]}
                widths={["7%", "15%", "7%", "61%", "10%"]}
            >
                {chiTiet.length === 0 ? (
                    <tr>
                        <td
                            colSpan={5}
                            style={{ ...tableCellCenter, fontStyle: "italic" }}
                        >
                            Không có dữ liệu
                        </td>
                    </tr>
                ) : (
                    chiTiet.map((d, idx) => {
                        const unit = unitMap.get(d.ma_don_vi) || {};
                        const rLayMau = getRange(
                            d,
                            "thoi_gian_lay_mau_bat_dau",
                            "thoi_gian_lay_mau_ket_thuc",
                        );
                        const rKham = getRange(
                            d,
                            "thoi_gian_bat_dau",
                            "thoi_gian_ket_thuc",
                        );
                        const rDuTruLayMau = getRange(
                            d,
                            "thoi_gian_du_tru_lay_mau_bat_dau",
                            "thoi_gian_du_tru_lay_mau_ket_thuc",
                        );
                        const rDuTruKham = getRange(
                            d,
                            "thoi_gian_du_tru_kham_bat_dau",
                            "thoi_gian_du_tru_kham_ket_thuc",
                        );

                        return (
                            <tr key={d.ma_don_vi}>
                                <td style={tableCellCenter}>{idx + 1}</td>
                                <td style={tableCellStyle}>
                                    {unit.ten_don_vi || d.ma_don_vi || "--"}
                                </td>
                                <td style={tableCellRight}>
                                    {unit.tong_quan_so || 0}
                                </td>
                                <td style={tableCellStyle}>
                                    <div style={{ lineHeight: 1.5 }}>
                                        <div>
                                            <b>Lấy máu:</b> {rLayMau}
                                        </div>
                                        <div>
                                            <b>Khám:</b> {rKham}
                                        </div>
                                        <div>
                                            <b>Dự trù lấy máu:</b>{" "}
                                            {rDuTruLayMau}
                                        </div>
                                        <div>
                                            <b>Dự trù khám:</b> {rDuTruKham}
                                        </div>
                                    </div>
                                </td>
                                <td style={tableCellStyle}>
                                    {d.dia_diem || "--"}
                                </td>
                            </tr>
                        );
                    })
                )}
            </Table>

            {/* Nội dung yêu cầu các đơn vị */}
            <div style={{ marginTop: "12pt", lineHeight: 1.6 }}>
                <div style={{ fontWeight: "bold", textIndent: "24pt" }}>
                    Yêu cầu các đơn vị:
                </div>
                <div style={{ textIndent: "24pt" }}>
                    - Cắt cử cán bộ, chiến sĩ tham gia đúng thời gian quy định,
                </div>
                <div style={{ textIndent: "24pt" }}>
                    - Chuẩn bị đầy đủ giấy tờ: Thẻ bảo hiểm y tế, Chứng minh thư
                    sĩ quan,
                </div>
                <div style={{ textIndent: "24pt" }}>
                    - Phối hợp quân y đảm bảo công tác khám diễn ra thuận lợi,
                </div>
                <div style={{ textIndent: "24pt" }}>
                    - Mọi chi tiết liên hệ: ......
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
                <div style={{ fontSize: "11pt", lineHeight: 1.5 }}>
                    <div style={{ fontWeight: "bold", fontStyle: "italic" }}>
                        Nơi nhận:
                    </div>
                    <div style={{ fontStyle: "italic" }}>
                        - Các cơ quan, đơn vị;
                    </div>
                    <div style={{ fontStyle: "italic" }}>
                        - Lưu: {chiTiet.length} bản.
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

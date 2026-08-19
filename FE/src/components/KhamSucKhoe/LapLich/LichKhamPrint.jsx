import PrintOverlay from "@/components/common/print/PrintOverlay.jsx";
import PrintHeaderDonVi from "@/components/common/print/PrintHeaderDonVi.jsx";
import PrintSignature from "@/components/common/print/PrintSignature.jsx";
import { formatDateTime } from "@/utils/date.js";

const tableHeadStyle = {
    fontWeight: "bold",
    textAlign: "center",
    border: "1px solid #000",
    padding: "3pt 3pt",
};
const tableCellStyle = { border: "1px solid #000", padding: "3pt 3pt" };
const tableCellCenter = { ...tableCellStyle, textAlign: "center" };
const tableCellRight = { ...tableCellStyle, textAlign: "right" };

const sectionStyle = {
    fontWeight: "bold",
    fontSize: "14pt",
    margin: "12pt 0 6pt 0",
};

function Table({ headers, children }) {
    return (
        <table
            style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "6pt",
            }}
        >
            <thead>
                <tr>
                    {headers.map((h, i) => (
                        <th key={i} style={tableHeadStyle}>
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

export default function LichKhamPrint({
    schedule,
    chiTietList,
    unitOptions,
    assignments,
}) {
    const unitMap = new Map((unitOptions ?? []).map((u) => [u.ma_don_vi, u]));

    const chiTiet = Array.isArray(chiTietList) ? chiTietList : [];
    const phanCong = Array.isArray(assignments) ? assignments : [];

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
                    LỊCH KHÁM SỨC KHỎE ĐỊNH KỲ NĂM {namHienThi}
                </p>
            </div>

            {/* I. THÔNG TIN CHUNG */}
            <p style={sectionStyle}>I. THÔNG TIN CHUNG</p>
            <Table headers={["Chỉ tiêu thời gian", "Thời gian"]}>
                <tr>
                    <td style={tableCellStyle}>Thời gian lấy máu</td>
                    <td style={tableCellStyle}>
                        {formatRange(
                            schedule?.thoi_gian_lay_mau_bat_dau,
                            schedule?.thoi_gian_lay_mau_ket_thuc,
                        )}
                    </td>
                </tr>
                <tr>
                    <td style={tableCellStyle}>Thời gian khám</td>
                    <td style={tableCellStyle}>
                        {formatRange(
                            schedule?.thoi_gian_bat_dau,
                            schedule?.thoi_gian_ket_thuc,
                        )}
                    </td>
                </tr>
                <tr>
                    <td style={tableCellStyle}>Dự trù lấy máu</td>
                    <td style={tableCellStyle}>
                        {formatRange(
                            schedule?.thoi_gian_du_tru_lay_mau_bat_dau,
                            schedule?.thoi_gian_du_tru_lay_mau_ket_thuc,
                        )}
                    </td>
                </tr>
                <tr>
                    <td style={tableCellStyle}>Dự trù khám</td>
                    <td style={tableCellStyle}>
                        {formatRange(
                            schedule?.thoi_gian_du_tru_kham_bat_dau,
                            schedule?.thoi_gian_du_tru_kham_ket_thuc,
                        )}
                    </td>
                </tr>
            </Table>

            {/* II. PHÂN CÔNG NHIỆM VỤ */}
            {phanCong.length > 0 && (
                <>
                    <p style={sectionStyle}>II. PHÂN CÔNG NHIỆM VỤ</p>
                    <Table headers={["STT", "Họ và tên", "Vai trò"]}>
                        {phanCong.map((a, idx) => (
                            <tr key={a.id || idx}>
                                <td style={tableCellCenter}>{idx + 1}</td>
                                <td style={tableCellStyle}>
                                    {a.chuc_vu
                                        ? `${a.chuc_vu} ${a.ten_nguoi_dung}`
                                        : a.ten_nguoi_dung ||
                                          a.id_nguoi_dung ||
                                          "--"}
                                </td>
                                <td style={tableCellStyle}>
                                    {a.ten_vai_tro || a.ma_vai_tro || "--"}
                                </td>
                            </tr>
                        ))}
                    </Table>
                </>
            )}

            {/* III. LỊCH KHÁM CÁC ĐƠN VỊ */}
            <p style={sectionStyle}>
                {phanCong.length > 0
                    ? "III. LỊCH KHÁM CÁC ĐƠN VỊ"
                    : "II. LỊCH KHÁM CÁC ĐƠN VỊ"}
            </p>
            <Table
                headers={[
                    "STT",
                    "Tên đơn vị",
                    "Quân số",
                    "Thời gian chi tiết",
                    "Địa điểm",
                ]}
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

            <PrintSignature
                justify="space-between"
                items={[
                    { label: "NGƯỜI LẬP LỊCH" },
                    { label: "CHỈ HUY ĐƠN VỊ", date: true },
                ]}
            />
        </PrintOverlay>
    );
}

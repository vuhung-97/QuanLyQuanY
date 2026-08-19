import PrintOverlay from "@/components/common/print/PrintOverlay.jsx";
import PrintHeaderDonVi from "@/components/common/print/PrintHeaderDonVi.jsx";
import PrintSignature from "@/components/common/print/PrintSignature.jsx";
import { formatDate } from "@/utils/date.js";

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

function EmptyRow({ colSpan }) {
    return (
        <tr>
            <td
                colSpan={colSpan}
                style={{ ...tableCellCenter, fontStyle: "italic" }}
            >
                Không có dữ liệu
            </td>
        </tr>
    );
}

export default function KetQuaKhamPrint({ data, paperSize = "A4" }) {
    const {
        schedule,
        stats,
        phanBoPhanLoai,
        lamSangBatThuong,
        benhTat,
        donViData,
    } = data;

    const scheduleInfo = schedule
        ? `${formatDate(schedule.thoi_gian_bat_dau)} → ${formatDate(schedule.thoi_gian_ket_thuc)}`
        : "";

    return (
        <PrintOverlay
            className="ket-qua-kham-print"
            paperSize={paperSize}
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
                    BÁO CÁO KẾT QUẢ KHÁM SỨC KHỎE
                </p>
                {scheduleInfo && (
                    <p style={{ margin: "4pt 0" }}>{scheduleInfo}</p>
                )}
            </div>

            <p style={sectionStyle}>I. TỔNG QUAN</p>
            <Table headers={["STT", "Nội dung", "Số lượng"]}>
                {[
                    ["1", "Tổng quân số", stats.tong_quan_so],
                    ["2", "Đã khám", stats.da_kham],
                    ["3", "Đang khám", stats.dang_kham],
                    ["4", "Đã lấy máu", stats.da_lay_mau],
                    ["5", "Chưa lấy máu", stats.con_lai],
                ].map(([stt, label, value], i) => (
                    <tr key={i}>
                        <td style={tableCellCenter}>{stt}</td>
                        <td style={tableCellStyle}>{label}</td>
                        <td style={tableCellRight}>{value}</td>
                    </tr>
                ))}
            </Table>

            <p style={sectionStyle}>II. PHÂN BỐ PHÂN LOẠI SỨC KHỎE</p>
            <Table headers={["STT", "Phân loại", "Số lượng", "Tỉ lệ (%)"]}>
                {!phanBoPhanLoai || phanBoPhanLoai.length === 0 ? (
                    <EmptyRow colSpan={4} />
                ) : (
                    phanBoPhanLoai.map((item, i) => (
                        <tr key={i}>
                            <td style={tableCellCenter}>{i + 1}</td>
                            <td style={tableCellStyle}>{item.name}</td>
                            <td style={tableCellRight}>{item.value}</td>
                            <td style={tableCellRight}>{item.ty_le}</td>
                        </tr>
                    ))
                )}
            </Table>

            <p style={sectionStyle}>III. LÂM SÀNG BẤT THƯỜNG</p>
            <Table headers={["STT", "Chuyên khoa", "Số lượng"]}>
                {!lamSangBatThuong || lamSangBatThuong.length === 0 ? (
                    <EmptyRow colSpan={3} />
                ) : (
                    lamSangBatThuong.map((item, i) => (
                        <tr key={i}>
                            <td style={tableCellCenter}>{i + 1}</td>
                            <td style={tableCellStyle}>{item.label}</td>
                            <td style={tableCellRight}>{item.value}</td>
                        </tr>
                    ))
                )}
            </Table>

            <p style={sectionStyle}>IV. BỆNH TẬT PHÁT HIỆN</p>
            <Table headers={["STT", "Bệnh tật", "Số lượng"]}>
                {!benhTat || benhTat.length === 0 ? (
                    <EmptyRow colSpan={3} />
                ) : (
                    benhTat.map((item, i) => (
                        <tr key={i}>
                            <td style={tableCellCenter}>{i + 1}</td>
                            <td style={tableCellStyle}>{item.ten}</td>
                            <td style={tableCellRight}>{item.so_luong}</td>
                        </tr>
                    ))
                )}
            </Table>

            <p style={sectionStyle}>V. KẾT QUẢ THEO ĐƠN VỊ</p>
            <Table
                headers={[
                    "STT",
                    "Đơn vị",
                    "Quân số",
                    "Đã khám",
                    "Đang khám",
                    "Chưa lấy máu",
                    "Tỉ lệ đã khám (%)",
                ]}
            >
                {!donViData || donViData.length === 0 ? (
                    <EmptyRow colSpan={7} />
                ) : (
                    donViData.map((item, i) => (
                        <tr key={i}>
                            <td style={tableCellCenter}>{i + 1}</td>
                            <td style={tableCellStyle}>{item.ten_don_vi}</td>
                            <td style={tableCellRight}>{item.tong_quan_so}</td>
                            <td style={tableCellRight}>{item.da_kham}</td>
                            <td style={tableCellRight}>{item.dang_kham}</td>
                            <td style={tableCellRight}>{item.con_lai}</td>
                            <td style={tableCellRight}>{item.ty_le_da_kham}</td>
                        </tr>
                    ))
                )}
            </Table>

            <PrintSignature
                justify="space-between"
                items={[
                    { label: "NGƯỜI LẬP" },
                    { label: "CHỦ NHIỆM QUÂN Y", date: true },
                ]}
            />
        </PrintOverlay>
    );
}

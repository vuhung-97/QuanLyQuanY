import PrintOverlay from "@/components/common/print/PrintOverlay.jsx";
import PrintHeaderDonVi from "@/components/common/print/PrintHeaderDonVi.jsx";
import PrintSignature from "@/components/common/print/PrintSignature.jsx";

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

export default function BaoCaoThangPrint({ data, paperSize = "A4" }) {
    const {
        thang,
        nam,
        tong_quan,
        phan_loai_benh_kham,
        phan_loai_benh_noi_tru,
        so_sanh_thang_truoc,
        thuoc_da_su_dung,
        thuoc_da_nhap,
    } = data;

    const prevThang = thang > 1 ? thang - 1 : 12;
    const prevNam = thang > 1 ? nam : nam - 1;

    return (
        <PrintOverlay
            className="bao-cao-thang-print"
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
                    BÁO CÁO THỐNG KÊ QUÂN Y
                </p>
                <p style={{ margin: "4pt 0" }}>
                    {thang ? `Tháng ${thang} / Năm ${nam}` : `Năm ${nam}`}
                </p>
            </div>

            <p style={sectionStyle}>I. TỔNG QUAN</p>
            <Table headers={["STT", "Nội dung", "Số lượng"]}>
                {[
                    ["1", "Lượt khám", tong_quan.tong_luot_kham],
                    ["2", "Nội trú", tong_quan.tong_noi_tru],
                    ["3", "Chuyển tuyến", tong_quan.tong_chuyen_tuyen],
                    ["4", "Đơn thuốc", tong_quan.tong_don_thuoc],
                ].map(([stt, label, value], i) => (
                    <tr key={i}>
                        <td style={tableCellCenter}>{stt}</td>
                        <td style={tableCellStyle}>{label}</td>
                        <td style={tableCellRight}>{value}</td>
                    </tr>
                ))}
            </Table>

            <p style={sectionStyle}>II. PHÂN LOẠI BỆNH KHÁM NGOẠI TRÚ</p>
            <Table headers={["STT", "Nhóm bệnh", "Số ca", "Tỉ lệ (%)"]}>
                {phan_loai_benh_kham.map((item, i) => (
                    <tr key={i}>
                        <td style={tableCellCenter}>{i + 1}</td>
                        <td style={tableCellStyle}>{item.ten_nhom}</td>
                        <td style={tableCellRight}>{item.so_ca}</td>
                        <td style={tableCellRight}>{item.ty_le}</td>
                    </tr>
                ))}
            </Table>

            <p style={sectionStyle}>III. PHÂN LOẠI BỆNH NỘI TRÚ</p>
            <Table headers={["STT", "Nhóm bệnh", "Số ca", "Tỉ lệ (%)"]}>
                {phan_loai_benh_noi_tru.map((item, i) => (
                    <tr key={i}>
                        <td style={tableCellCenter}>{i + 1}</td>
                        <td style={tableCellStyle}>{item.ten_nhom}</td>
                        <td style={tableCellRight}>{item.so_ca}</td>
                        <td style={tableCellRight}>{item.ty_le}</td>
                    </tr>
                ))}
            </Table>

            {so_sanh_thang_truoc && (
                <>
                    <p style={sectionStyle}>IV. SO SÁNH VỚI THÁNG TRƯỚC</p>
                    <Table
                        headers={[
                            "STT",
                            "Chỉ tiêu",
                            `Tháng ${prevThang}/${prevNam}`,
                            `Tháng ${thang}/${nam}`,
                            "Thay đổi",
                        ]}
                    >
                        {[
                            ["1", "Lượt khám", so_sanh_thang_truoc.luot_kham],
                            ["2", "Nội trú", so_sanh_thang_truoc.noi_tru],
                            [
                                "3",
                                "Chuyển tuyến",
                                so_sanh_thang_truoc.chuyen_tuyen,
                            ],
                        ].map(([stt, label, vals], i) => (
                            <tr key={i}>
                                <td style={tableCellCenter}>{stt}</td>
                                <td style={tableCellStyle}>{label}</td>
                                <td style={tableCellRight}>
                                    {vals.thang_truoc}
                                </td>
                                <td style={tableCellRight}>{vals.thang_nay}</td>
                                <td style={tableCellRight}>{vals.thay_doi}</td>
                            </tr>
                        ))}
                    </Table>
                </>
            )}

            <p style={sectionStyle}>V. THUỐC / VTYT ĐÃ SỬ DỤNG</p>
            <Table
                headers={["STT", "Tên thuốc", "ĐVT", "Phân loại", "Số lượng"]}
            >
                {!thuoc_da_su_dung || thuoc_da_su_dung.length === 0 ? (
                    <tr>
                        <td
                            colSpan={5}
                            style={{ ...tableCellCenter, fontStyle: "italic" }}
                        >
                            Không có dữ liệu
                        </td>
                    </tr>
                ) : (
                    thuoc_da_su_dung.map((item, i) => (
                        <tr key={i}>
                            <td style={tableCellCenter}>{i + 1}</td>
                            <td style={tableCellStyle}>{item.ten_thuoc}</td>
                            <td style={tableCellCenter}>{item.don_vi_tinh}</td>
                            <td style={tableCellCenter}>{item.phan_loai}</td>
                            <td style={tableCellRight}>{item.so_luong}</td>
                        </tr>
                    ))
                )}
            </Table>

            <p style={sectionStyle}>VI. THUỐC / VTYT ĐÃ NHẬP</p>
            <Table
                headers={["STT", "Tên thuốc", "ĐVT", "Phân loại", "Số lượng"]}
            >
                {!thuoc_da_nhap || thuoc_da_nhap.length === 0 ? (
                    <tr>
                        <td
                            colSpan={5}
                            style={{ ...tableCellCenter, fontStyle: "italic" }}
                        >
                            Không có dữ liệu
                        </td>
                    </tr>
                ) : (
                    thuoc_da_nhap.map((item, i) => (
                        <tr key={i}>
                            <td style={tableCellCenter}>{i + 1}</td>
                            <td style={tableCellStyle}>{item.ten_thuoc}</td>
                            <td style={tableCellCenter}>{item.don_vi_tinh}</td>
                            <td style={tableCellCenter}>{item.phan_loai}</td>
                            <td style={tableCellRight}>{item.so_luong}</td>
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

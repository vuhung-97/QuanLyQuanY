import { useMemo } from "react";
import PrintOverlay from "@/components/common/print/PrintOverlay.jsx";
import PrintHeaderDonVi from "@/components/common/print/PrintHeaderDonVi.jsx";
import PrintSignature from "@/components/common/print/PrintSignature.jsx";
import { buildTree, flattenTree, aggregateTree } from "@/utils/treeUtils.js";

const cellCenter = { textAlign: "center" };
const cellRight = { textAlign: "right" };

const sectionStyle = {
    fontWeight: "bold",
    fontSize: "14pt",
    margin: "12pt 0 6pt 0",
};

function prepareTreeWithCoQuan(nodes) {
    for (const node of nodes) {
        if (node.children && node.children.length > 0) {
            prepareTreeWithCoQuan(node.children);

            const selfQuanSo = node.quan_so || 0;
            const selfNguoiOm = node.so_nguoi_om || 0;
            const selfNhapBenhXa = node.so_luot_nhap_benh_xa || 0;
            const selfChuyenTuyen = node.so_luot_chuyen_tuyen || 0;
            const selfLuotOm = node.so_luot_om || 0;
            const selfQK = Math.max(0, selfQuanSo - selfNguoiOm);
            const selfTL =
                selfQuanSo > 0
                    ? Math.round((selfQK / selfQuanSo) * 1000) / 10
                    : 100.0;

            const coQuanNode = {
                ma_don_vi: `${node.ma_don_vi}_co_quan`,
                ten_don_vi: "Cơ quan",
                ma_don_vi_truc_thuoc: node.ma_don_vi,
                quan_so: selfQuanSo,
                so_nguoi_om: selfNguoiOm,
                so_luot_nhap_benh_xa: selfNhapBenhXa,
                so_luot_chuyen_tuyen: selfChuyenTuyen,
                so_luot_om: selfLuotOm,
                quan_so_khoe: selfQK,
                ty_le_khoe: selfTL,
                children: [],
            };

            node.children.unshift(coQuanNode);

            node.quan_so = 0;
            node.so_nguoi_om = 0;
            node.so_luot_nhap_benh_xa = 0;
            node.so_luot_chuyen_tuyen = 0;
            node.so_luot_om = 0;
        }
    }
    return nodes;
}

export default function BaoCaoQuanSoKhoePrint({ data, paperSize = "A4" }) {
    const { thang, nam, don_vi, tong_quan } = data;

    const printRows = useMemo(() => {
        if (!don_vi) return [];
        const rawTree = buildTree(don_vi);
        const preparedTree = prepareTreeWithCoQuan(rawTree);
        const tree = aggregateTree(preparedTree);
        return flattenTree(tree);
    }, [don_vi]);

    const lowestUnits = useMemo(() => {
        if (!don_vi) return [];
        return [...don_vi]
            .filter((u) => u.quan_so > 0)
            .sort(
                (a, b) =>
                    (a.ty_le_khoe || 0) - (b.ty_le_khoe || 0) ||
                    (b.so_nguoi_om || 0) - (a.so_nguoi_om || 0),
            )
            .slice(0, 5);
    }, [don_vi]);

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

            <p style={sectionStyle}>I. TỔNG QUAN TOÀN ĐƠN VỊ</p>

            <table>
                <thead>
                    <tr>
                        <th style={{ width: 35 }}>STT</th>
                        <th>Đơn vị</th>
                        <th style={{ width: 60 }}>Tổng quân số</th>
                        <th style={{ width: 60 }}>Người ốm</th>
                        <th style={{ width: 60 }}>Lượt nhập bệnh xá</th>
                        <th style={{ width: 60 }}>Lượt chuyển tuyến</th>
                        <th style={{ width: 60 }}>Quân số khỏe</th>
                        <th style={{ width: 60 }}>Tỷ lệ (%)</th>
                    </tr>
                </thead>
                <tbody>
                    {printRows.map((dv, idx) => {
                        const isLevel1OrParent =
                            dv.level === 0 || dv.children?.length > 0;
                        return (
                            <tr
                                key={dv.ma_don_vi}
                                style={
                                    isLevel1OrParent
                                        ? {
                                              fontWeight: "bold",
                                              backgroundColor: "#F5F5F5",
                                          }
                                        : undefined
                                }
                            >
                                <td style={cellCenter}>{idx + 1}</td>
                                <td style={{ paddingLeft: dv.level * 16 + 6 }}>
                                    {dv.level > 0 ? "– " : ""}
                                    {dv.ten_don_vi}
                                </td>
                                <td style={cellCenter}>{dv.quan_so}</td>
                                <td style={cellCenter}>{dv.so_nguoi_om}</td>
                                <td style={cellCenter}>
                                    {dv.so_luot_nhap_benh_xa ?? 0}
                                </td>
                                <td style={cellCenter}>
                                    {dv.so_luot_chuyen_tuyen ?? 0}
                                </td>
                                <td style={cellCenter}>{dv.quan_so_khoe}</td>
                                <td style={cellRight}>{dv.ty_le_khoe}%</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <table style={{ marginTop: 0 }}>
                <tbody>
                    <tr style={{ fontWeight: "bold" }}>
                        <td style={{ width: 35, border: "none" }}></td>
                        <td style={{ border: "none" }}>Tổng cộng</td>
                        <td
                            style={{
                                width: 90,
                                border: "none",
                                textAlign: "center",
                            }}
                        >
                            {tong_quan.tong_quan_so}
                        </td>
                        <td
                            style={{
                                width: 80,
                                border: "none",
                                textAlign: "center",
                            }}
                        >
                            {tong_quan.tong_nguoi_om}
                        </td>
                        <td
                            style={{
                                width: 100,
                                border: "none",
                                textAlign: "center",
                            }}
                        >
                            {tong_quan.tong_luot_nhap_benh_xa ?? 0}
                        </td>
                        <td
                            style={{
                                width: 100,
                                border: "none",
                                textAlign: "center",
                            }}
                        >
                            {tong_quan.tong_luot_chuyen_tuyen ?? 0}
                        </td>
                        <td
                            style={{
                                width: 90,
                                border: "none",
                                textAlign: "center",
                            }}
                        >
                            {tong_quan.quan_so_khoe}
                        </td>
                        <td
                            style={{
                                width: 75,
                                border: "none",
                                textAlign: "right",
                            }}
                        >
                            {tong_quan.ty_le_khoe}%
                        </td>
                    </tr>
                </tbody>
            </table>

            <p style={sectionStyle}>II. ĐÁNH GIÁ TÌNH HÌNH</p>

            <p style={{ margin: "4pt 0", fontWeight: "bold" }}>
                5 đơn vị có tỷ lệ quân số khỏe thấp nhất:
            </p>
            {lowestUnits.length === 0 ? (
                <p style={{ margin: "4pt 0", fontStyle: "italic" }}>
                    Không có dữ liệu
                </p>
            ) : (
                <ol style={{ margin: "4pt 0 12pt 20pt", padding: 0 }}>
                    {lowestUnits.map((u, i) => (
                        <li key={u.ma_don_vi || i} style={{ margin: "2pt 0" }}>
                            <strong>{u.ten_don_vi}:</strong> {u.ty_le_khoe}%
                            (Quân số: {u.quan_so}, Ốm: {u.so_nguoi_om} người)
                        </li>
                    ))}
                </ol>
            )}

            <p style={{ margin: "8pt 0 4pt 0", fontWeight: "bold" }}>
                Ghi chú đánh giá bổ sung:
            </p>
            {Array.from({ length: 5 }).map((_, i) => (
                <div
                    key={i}
                    style={{
                        borderBottom: "1px dotted #000",
                        height: "1.6em",
                        margin: "4pt 0",
                    }}
                />
            ))}

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

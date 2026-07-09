import { memo } from "react";
import { tinhTuoi } from "@/utils/date.js";
import PrintOverlay from "@/components/common/print/PrintOverlay.jsx";
import PrintHeaderDonVi from "@/components/common/print/PrintHeaderDonVi.jsx";
import PrintSignature from "@/components/common/print/PrintSignature.jsx";

const dottedStyle = {
    borderBottom: "1px dotted #000",
    display: "inline-block",
};

function DottedField({ label, value, numrows = 2 }) {
    return (
        <div style={{ marginBottom: "12pt" }}>
            <div style={{ display: "flex", gap: "3pt" }}>
                <strong>{label}:</strong> 
                <span style={{ flex: 1, borderBottom: "1px dotted #000" }}>
                    {value || ""} 
                </span>
            </div>
            {Array.from({ length: numrows }).map((_, i) => (
                <div
                    key={i}
                    style={{
                        borderBottom: "1px dotted #000",
                        height: "1.5em",
                        margin: "6pt 0",
                    }}
                ></div>
            ))}
        </div>
    );
}

const ChuyenTuyenPrint = memo(function ChuyenTuyenPrint({
    selectedExam,
    examDetail,
    tenBenhVien,
    yKienDeNghi,
    paperSize = "A5",
}) {
    return (
        <PrintOverlay className="chuyen-tuyen-print" paperSize={paperSize}>
            {/* ----- PAGE 1 ----- */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "flex-start",
                }}
            >
                <PrintHeaderDonVi
                    title="QUÂN ĐỘI NHÂN DÂN VIỆT NAM"
                    childTitle="ĐƠN VỊ LỮ ĐOÀN 170"
                />
                <div style={{ textAlign: "center", paddingTop: "24pt" }}>
                    <p
                        style={{
                            fontSize: "18pt",
                            fontWeight: "bold",
                            textAlign: "center",
                            textTransform: "uppercase",
                        }}
                    >
                        GIẤY GIỚI THIỆU
                    </p>
                    <p>Đi khám bệnh, đi bệnh viện</p>
                </div>
            </div>
            <p style={{ textAlign: "center" }}>
                <strong>Kính gửi:</strong>{" "}
                {tenBenhVien ||
                    ".................................................."}
            </p>
            <div style={{ display: "flex", gap: "8pt" }}>
                <p style={{ width: "60%" }}>
                    <strong>Họ và tên:</strong> {selectedExam?.ho_ten || "—"}
                </p>
                <p>
                    <strong>Tuổi:</strong>{" "}
                    {tinhTuoi(selectedExam?.ngay_sinh) || "—"}
                </p>
            </div>
            <div style={{ display: "flex", gap: "8pt" }}>
                <p style={{ width: "60%" }}>
                    <strong>Cấp bậc:</strong> {selectedExam?.cap_bac || "—"}
                </p>
                <p>
                    <strong>Chức vụ:</strong> {selectedExam?.chuc_vu || "—"}
                </p>
            </div>
            <p>
                <strong>Đơn vị:</strong> {selectedExam?.ten_don_vi || "—"}
            </p>
            <DottedField label="Triệu chứng" value={examDetail?.trieu_chung} />
            <DottedField label="Chẩn đoán" value={examDetail?.chan_doan} />
            <DottedField label="Ý kiến đề nghị" value={yKienDeNghi} />
            <PrintSignature
                justify="flex-end"
                items={[
                    {
                        label: "Chủ nhiệm quân y",
                        subLabel: "(ký, ghi rõ họ tên)",
                    },
                ]}
                date
            />

            {/* ----- PAGE 2 ----- */}
            <div
                style={{
                    pageBreakBefore: "always",
                    display: "flex",
                    flexDirection: "column",
                    margin: "2cm 0",
                }}
            >
                <DottedField label="Thời gian đến bệnh xá" numrows={1} />

                <DottedField label="Chẩn đoán" numrows={3} />
                <DottedField label="Quyết định của y sinh" numrows={7} />

                <PrintSignature
                    justify="flex-end"
                    items={[
                        {
                            label: "Y sinh",
                            subLabel: "(ký, ghi rõ họ tên)",
                        },
                    ]}
                    date
                />
            </div>
        </PrintOverlay>
    );
});

export default ChuyenTuyenPrint;

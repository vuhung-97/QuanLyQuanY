import { memo } from "react";
import PrintOverlay from "@/components/common/print/PrintOverlay.jsx";
import PrintHeaderDonVi from "@/components/common/print/PrintHeaderDonVi.jsx";
import PrintSignature from "@/components/common/print/PrintSignature.jsx";
import { UNIT_NAME } from "@/components/layout/common/constants.js";

function FieldLine({ label, value }) {
    if (value) {
        return (
            <div
                style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "4pt",
                    marginBottom: "12pt",
                }}
            >
                <strong style={{ whiteSpace: "nowrap" }}>{label}:</strong>
                <span style={{ flex: 1 }}>{value}</span>
            </div>
        );
    }
    return (
        <div
            style={{
                display: "flex",
                alignItems: "baseline",
                gap: "4pt",
                marginBottom: "12pt",
            }}
        >
            <strong style={{ whiteSpace: "nowrap" }}>{label}:</strong>
            <span
                style={{
                    flex: 1,
                    borderBottom: "1px dotted #000",
                    minHeight: "1.4em",
                    padding: "0 4pt",
                }}
            >
                &nbsp;
            </span>
        </div>
    );
}

const RaBenhXaPrint = memo(function RaBenhXaPrint({
    data = {},
    paperSize = "A5",
    preview = false,
}) {
    return (
        <PrintOverlay
            className="ra-benh-xa-print"
            paperSize={paperSize}
            fontSize="12pt"
            preview={preview}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "10pt",
                }}
            >
                <PrintHeaderDonVi
                    title={UNIT_NAME}
                    childTitle="PHÒNG HC-KT"
                    align="center"
                />
                <div style={{ textAlign: "center" }}>
                    <div
                        style={{
                            fontWeight: "bold",
                            textTransform: "uppercase",
                            fontSize: "12pt",
                        }}
                    >
                        CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                    </div>
                    <div
                        style={{
                            borderBottom: "1px solid #000",
                            display: "inline-block",
                            lineHeight: "1.4",
                            padding: "0 8pt 2pt",
                        }}
                    >
                        Độc lập - Tự do - Hạnh phúc
                    </div>
                </div>
            </div>

            <div style={{ height: "10pt" }} />

            <div
                style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: "15pt",
                    textTransform: "uppercase",
                    marginBottom: "14pt",
                }}
            >
                GIẤY RA BỆNH XÁ
            </div>

            <FieldLine label="Họ tên" value={data.hoTen} />
            <FieldLine label="Cấp bậc" value={data.capBac} />
            <FieldLine label="Đơn vị" value={data.tenDonVi} />
            <FieldLine label="Mã thẻ BHYT" value={data.soTheBhyt} />
            <FieldLine label="Vào bệnh xá lúc" value={data.ngayVao} />
            <FieldLine label="Ra bệnh xá lúc" value={data.ngayRa} />
            <FieldLine label="Chẩn đoán" value={data.chanDoan} />
            <FieldLine
                label="Phương pháp điều trị"
                value={data.phuongPhapDieuTri}
            />
            <FieldLine label="Ghi chú" value="" />

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
        </PrintOverlay>
    );
});

export default RaBenhXaPrint;

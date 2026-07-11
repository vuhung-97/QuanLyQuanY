import { UNIT_NAME } from "@/components/layout/common/constants.js";

export default function PrintHeaderDonVi({
    subText,
    title = UNIT_NAME,
    childTitle = "PHÒNG HC-KT",
    align = "center",
}) {
    const containerStyle = {
        textAlign: align,
    };

    return (
        <div style={containerStyle}>
            {subText && (
                <div style={{ textTransform: "uppercase" }}>{subText}</div>
            )}
            <div style={{ textTransform: "uppercase" }}>{title}</div>
            <div style={{ fontWeight: "bold", textTransform: "uppercase" }}>
                {childTitle}
            </div>
        </div>
    );
}

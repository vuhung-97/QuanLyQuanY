export default function PrintSignature({
    justify = "flex-end",
    items = [],
    date,
    style: extraStyle,
}) {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: justify,
                marginTop: 40,
                ...extraStyle,
            }}
        >
            {items.map((item, idx) => (
                <div key={idx} style={{ textAlign: "center" }}>
                    {date && <div>Ngày ..... tháng ..... năm .....</div>}
                    <div
                        style={{
                            fontWeight: "bold",
                            marginBottom: item.name ? "48pt" : 0,
                        }}
                    >
                        {item.label}
                    </div>
                    {item.subLabel && <div>{item.subLabel}</div>}
                    {item.name && (
                        <div style={{ marginTop: 4 }}>{item.name}</div>
                    )}
                </div>
            ))}
        </div>
    );
}

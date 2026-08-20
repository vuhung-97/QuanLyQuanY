const paperSizes = {
    A4: {
        padding: "2cm 1.5cm 2cm 2.5cm",
        pageSize: "A4 portrait",
    },
    A5: {
        padding: "1cm 0.9cm 1cm 1.1cm",
        pageSize: "A5 portrait",
    },
};

const styles = (className, padding, fontFamily, pageSize, fontSize, preview) => `
.${className} { ${preview ? "display: block;" : "display: none;"} }
@page { margin: ${padding}; size: ${pageSize}; }
@media print {
    html, body { height: auto; overflow: visible; margin: 0; padding: 0; }
    body * { visibility: hidden !important; }
    .${className}, .${className} * { visibility: visible !important; }
    .${className} { display: block; width: 100%; font-size: ${fontSize}; font-family: ${fontFamily}; box-sizing: border-box; }
    .${className} p { margin: 3pt 0; line-height: 1.4; }
    .${className} table { width: 100%; border-collapse: collapse; margin-top: 6pt; }
    .${className} th, .${className} td { border: 1px solid #000; padding: 3pt 3pt; text-align: left; }
    .${className} th { font-weight: bold; text-align: center; }
    .${className} td.so-luong { text-align: center; }
}
@media screen {
    .${className} {
        background: #fff;
        padding: ${padding};
        margin: 0 auto;
        max-width: 21cm;
        box-sizing: border-box;
        border: 1px solid #ccc;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
    }
}
`;

export default function PrintOverlay({
    className = "print-overlay",
    paperSize = "A4",
    padding: customPadding,
    fontFamily = "'Times New Roman', Times, serif",
    children,
    fontSize = "13pt",
    preview = false,
}) {
    const config = paperSizes[paperSize] || paperSizes.A4;
    const padding = customPadding || config.padding;

    return (
        <>
            <style>
                {styles(
                    className,
                    padding,
                    fontFamily,
                    config.pageSize,
                    fontSize,
                    preview,
                )}
            </style>
            <div className={className}>{children}</div>
        </>
    );
}

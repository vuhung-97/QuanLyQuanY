const paperSizes = {
    A4: {
        padding: "2cm 2cm 2cm 2.5cm",
        pageSize: "A4 portrait",
        fixed: true,
    },
    A5: {
        padding: "1cm 0.9cm 1cm 1.1cm",
        pageSize: "A5 portrait",
        fixed: false,
    },
};

const fixedStyles = (className, padding, fontFamily, pageSize, fontSize) => `
.${className} { display: none; }
@page { margin: 0; size: ${pageSize}; }
@media print {
    html, body { height: auto; overflow: visible; }
    body * { visibility: hidden !important; }
    .${className}, .${className} * { visibility: visible !important; }
    .${className} { display: block !important; position: fixed; left: 0; top: 0; width: 100%; padding: ${padding}; font-size: ${fontSize}; font-family: ${fontFamily}; box-sizing: border-box; background: #fff; z-index: 9999; }
    .${className} p { margin: 3pt 0; line-height: 1.4; }
    .${className} table { width: 100%; border-collapse: collapse; margin-top: 6pt; }
    .${className} th, .${className} td { border: 1px solid #000; padding: 3pt 3pt; text-align: left; }
    .${className} th { font-weight: bold; text-align: center; }
    .${className} td.so-luong { text-align: center; }
}
`;

const flowStyles = (className, padding, fontFamily, pageSize, fontSize) => `
.${className} { display: none; }
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
`;

export default function PrintOverlay({
    className = "print-overlay",
    paperSize = "A4",
    padding: customPadding,
    fontFamily = "'Times New Roman', Times, serif",
    children,
    fontSize = "13pt",
    fixed: fixedOverride,
}) {
    const config = paperSizes[paperSize] || paperSizes.A4;
    const padding = customPadding || config.padding;
    const useFixed = fixedOverride !== undefined ? fixedOverride : config.fixed;
    const styles = useFixed ? fixedStyles : flowStyles;

    return (
        <>
            <style>
                {styles(
                    className,
                    padding,
                    fontFamily,
                    config.pageSize,
                    fontSize,
                )}
            </style>
            <div className={className}>{children}</div>
        </>
    );
}

const fieldRanges = {
    hong_cau: { min: 4.0, max: 5.4, tooltip: "4.0 \u2013 5.4 T/L" },
    bach_cau: { min: 4.0, max: 10.0, tooltip: "4.0 \u2013 10.0 G/L" },
    tieu_cau: { min: 150, max: 400, tooltip: "150 \u2013 400 G/L" },
    glucose_mau: { min: 3.9, max: 6.4, tooltip: "3.9 \u2013 6.4 mmol/l" },
    ure: { min: 2.5, max: 7.5, tooltip: "2.5 \u2013 7.5 mmol/l" },
    creatinin: { min: 62, max: 120, tooltip: "62 \u2013 120 umol/l" },
    ast: { max: 37, tooltip: "< 37 U/L" },
    alt: { max: 40, tooltip: "< 40 U/L" },
    nuoc_tieu_glucose: {
        normalValues: ["Âm tính"],
        tooltip: "Âm tính l\u00e0 b\u00ecnh th\u01b0\u1eddng",
    },
    nuoc_tieu_protein: {
        normalValues: ["Âm tính"],
        tooltip: "Âm tính l\u00e0 b\u00ecnh th\u01b0\u1eddng",
    },
    nuoc_tieu_te_bao: { min: 0, max: 5, tooltip: "< 5" },
    mach: { min: 60, max: 100, tooltip: "60 \u2013 100 l\u1ea7n/ph\u00fat" },
    huyet_ap_tam_thu: { min: 90, max: 120, tooltip: "90 \u2013 120 mmHg" },
    huyet_ap_tam_truong: { min: 60, max: 80, tooltip: "60 \u2013 80 mmHg" },
};

function isOutOfRange(fieldName, value) {
    const range = fieldRanges[fieldName];
    if (!range) return false;
    if (range.normalValues) return !range.normalValues.includes(value);
    const num = parseFloat(value);
    if (isNaN(num) || value === "") return false;
    if (range.min != null && num < range.min) return true;
    if (range.max != null && num > range.max) return true;
    return false;
}

export { fieldRanges, isOutOfRange };

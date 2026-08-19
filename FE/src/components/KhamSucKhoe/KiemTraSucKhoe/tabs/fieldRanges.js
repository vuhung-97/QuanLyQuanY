const fieldRanges = {
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

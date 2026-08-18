const FIELD_LABELS = {
    ten_thuoc_vtyt: "Tên thuốc / VTYT",
    loai: "Loại",
    don_vi_tinh: "ĐVT",
    phan_loai: "Phân loại",
    hoat_chat: "Hoạt chất",
    so_luong: "Số lượng tồn",
    mo_ta: "Mô tả",
    don_gia: "Đơn giá",
};

const snakeToTitle = (str) =>
    str
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
        .trim();

const getFieldLabel = (field) => FIELD_LABELS[field] || snakeToTitle(field);

const formatValidationError = (item) => {
    if (typeof item === "string") return item;
    if (!item || typeof item !== "object") return "";

    const loc = Array.isArray(item.loc) ? item.loc : [];
    const field = loc.filter((p) => p !== "body").join(".");
    const label = getFieldLabel(field);
    const ctx = item.ctx || {};

    switch (item.type) {
        case "greater_than_equal":
            return ctx.ge != null
                ? `${label} phải lớn hơn hoặc bằng ${ctx.ge}`
                : `${label} không hợp lệ`;
        case "less_than_equal":
            return ctx.le != null
                ? `${label} phải nhỏ hơn hoặc bằng ${ctx.le}`
                : `${label} không hợp lệ`;
        case "greater_than":
            return ctx.gt != null
                ? `${label} phải lớn hơn ${ctx.gt}`
                : `${label} không hợp lệ`;
        case "less_than":
            return ctx.lt != null
                ? `${label} phải nhỏ hơn ${ctx.lt}`
                : `${label} không hợp lệ`;
        case "missing":
        case "string_too_short":
            return `${label} không được để trống`;
        case "string_too_long":
            return `${label} quá dài`;
        case "int_parsing":
        case "decimal_parsing":
        case "float_parsing":
            return `${label} phải là số hợp lệ`;
        default:
            return item.msg
                ? `${label}: ${item.msg}`
                : `${label} không hợp lệ`;
    }
};

export function getErrorMessage(err, fallback = "Lỗi không xác định") {
    const detail = err?.response?.data?.detail;
    if (!detail) return fallback;

    let errors = detail;
    if (typeof detail === "string") {
        try {
            errors = JSON.parse(detail);
        } catch {
            return detail;
        }
    }

    if (Array.isArray(errors)) {
        const messages = errors.map(formatValidationError).filter(Boolean);
        return messages.length > 0 ? messages.join("\n") : fallback;
    }

    return typeof detail === "string" ? detail : fallback;
}
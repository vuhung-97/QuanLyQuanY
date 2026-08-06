export function formatDate(value) {
    if (!value) return "--";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "--";
    return new Intl.DateTimeFormat("vi-VN").format(d);
}

export function tinhTuoi(ngaySinh) {
    if (!ngaySinh) return "--";
    const d = new Date(ngaySinh);
    if (Number.isNaN(d.getTime())) return "--";
    return new Date().getFullYear() - d.getFullYear();
}

export function formatDateTime(value) {
    if (!value) return "--";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "--";
    return new Intl.DateTimeFormat("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(d);
}

export function formatDate(value) {
    if (!value) return "--";
    return new Intl.DateTimeFormat("vi-VN").format(new Date(value));
}

export function tinhTuoi(ngaySinh) {
    if (!ngaySinh) return "--";
    return new Date().getFullYear() - new Date(ngaySinh).getFullYear();
}

export function formatDateTime(value) {
    if (!value) return "--";
    return new Intl.DateTimeFormat("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(new Date(value));
}

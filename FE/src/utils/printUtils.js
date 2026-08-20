export const PRINT_STYLES = `
@media print {
    #root { display: none !important; }
    .MuiBackdrop-root { display: none !important; }
    .MuiModal-root { display: contents !important; }
    .MuiDialog-container { display: contents !important; }
    .MuiDialog-paper { display: contents !important; }
    .MuiDialogContent-root { display: contents !important; }
}
`;

export const PRINT_DIALOG_CONTENT_SX = {
    "@media print": {
        border: "none !important",
        p: "0 !important",
        height: "auto !important",
        overflow: "visible !important",
    },
};

export function toFileDate(value) {
    if (!value) return "";
    let d;
    if (typeof value === "object" && value?.format) {
        d = value.toDate();
    } else if (value instanceof Date) {
        d = value;
    } else {
        d = new Date(value);
    }
    if (Number.isNaN(d.getTime())) return "";
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
}

export function triggerPrint(title) {
    if (document.activeElement?.blur) document.activeElement.blur();

    const originalTitle = document.title;
    if (title) document.title = title;

    let restored = false;
    const restore = () => {
        if (restored) return;
        restored = true;
        document.title = originalTitle;
        window.removeEventListener("afterprint", restore);
        const mql = window.matchMedia("print");
        mql.removeEventListener?.("change", onMqlChange);
    };
    const onMqlChange = (e) => {
        if (!e.matches) restore();
    };

    window.addEventListener("afterprint", restore);
    const mql = window.matchMedia("print");
    mql.addEventListener?.("change", onMqlChange);

    setTimeout(() => {
        window.print();
        setTimeout(restore, 3000);
    }, 0);
}

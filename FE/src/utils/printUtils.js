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

export function triggerPrint() {
    if (document.activeElement?.blur) document.activeElement.blur();
    setTimeout(() => window.print(), 0);
}

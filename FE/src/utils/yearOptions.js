export function getNamOptions(fromYear = 2025) {
    const current = new Date().getFullYear();
    const years = [];
    for (let y = current; y >= fromYear; y--) {
        years.push(y);
    }
    return years;
}

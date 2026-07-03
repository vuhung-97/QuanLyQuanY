export function buildTree(units) {
    const map = {};
    for (const u of units) map[u.ma_don_vi] = { ...u, children: [] };
    const roots = [];
    for (const u of units) {
        if (u.ma_don_vi_truc_thuoc && map[u.ma_don_vi_truc_thuoc]) {
            map[u.ma_don_vi_truc_thuoc].children.push(map[u.ma_don_vi]);
        } else {
            roots.push(map[u.ma_don_vi]);
        }
    }
    return roots;
}

export function flattenTree(nodes, level = 0) {
    const result = [];
    for (const node of nodes) {
        result.push({ ...node, level });
        result.push(...flattenTree(node.children, level + 1));
    }
    return result;
}

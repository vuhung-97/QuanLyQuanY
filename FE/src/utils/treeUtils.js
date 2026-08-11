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

export function aggregateTree(tree) {
    function walk(node) {
        for (const child of node.children) {
            walk(child);
            node.quan_so = (node.quan_so || 0) + (child.quan_so || 0);
            node.so_nguoi_om = (node.so_nguoi_om || 0) + (child.so_nguoi_om || 0);
            node.so_luot_nhap_benh_xa = (node.so_luot_nhap_benh_xa || 0) + (child.so_luot_nhap_benh_xa || 0);
            node.so_luot_chuyen_tuyen = (node.so_luot_chuyen_tuyen || 0) + (child.so_luot_chuyen_tuyen || 0);
            node.so_luot_om = (node.so_luot_om || 0) + (child.so_luot_om || 0);
        }
        node.quan_so_khoe = Math.max(0, node.quan_so - node.so_nguoi_om);
        node.ty_le_khoe = node.quan_so > 0
            ? Math.round(node.quan_so_khoe / node.quan_so * 1000) / 10
            : 100.0;
    }
    for (const root of tree) walk(root);
    return tree;
}

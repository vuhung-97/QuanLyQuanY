import api from "../../services/api";

export default function usePermissionDiff(
    rolePermissions,
    setRolePermissions,
    selectedRoleId,
    selectedPermissionIds,
) {
    const savePermissions = async () => {
        if (!selectedRoleId) return false;

        const currentIds = rolePermissions
            .filter((item) => item.id_vai_tro === selectedRoleId)
            .map((item) => item.id_quyen);
        const selectedIds = Array.from(selectedPermissionIds);
        const toAdd = selectedIds.filter((id) => !currentIds.includes(id));
        const toRemove = currentIds.filter(
            (id) => !selectedPermissionIds.has(id),
        );

        await Promise.all([
            ...toAdd.map((id_quyen) =>
                api.post("/vai_tro_quyen", {
                    id_vai_tro: selectedRoleId,
                    id_quyen,
                }),
            ),
            ...toRemove.map((id_quyen) =>
                api.delete(`/vai_tro_quyen/${selectedRoleId},${id_quyen}`),
            ),
        ]);

        setRolePermissions((prev) => [
            ...prev.filter((item) => item.id_vai_tro !== selectedRoleId),
            ...selectedIds.map((id_quyen) => ({
                id_vai_tro: selectedRoleId,
                id_quyen,
            })),
        ]);
        return true;
    };

    return { savePermissions };
}

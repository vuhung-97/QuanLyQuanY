import { Card, CardContent, LinearProgress, List, ListItemButton, ListItemText, Typography } from "@mui/material"
import { Edit as EditIcon } from "@mui/icons-material"
import Button from "@mui/material/Button"

export default function RoleListPanel({ roles, selectedRoleId, onSelectRole, onEditRole, loading }) {
    return (
        <Card sx={{ borderRadius: 3, height: "100%" }}>
            {loading && <LinearProgress />}
            <CardContent sx={{ p: "22px !important" }}>
                <Typography variant="h2" sx={{ mb: 2 }}>Vai trò</Typography>
                <List disablePadding>
                    {roles.map((role) => (
                        <ListItemButton
                            key={role.id}
                            selected={role.id === selectedRoleId}
                            onClick={() => onSelectRole(role.id)}
                            sx={{ borderRadius: 2, mb: 1 }}
                        >
                            <ListItemText
                                primary={role.ten_vai_tro || role.id}
                                secondary={role.id}
                                slotProps={{
                                    primaryTypography: { fontWeight: 700 },
                                }}
                                sx={{ flex: "1 1 auto" }}
                            />
                            <Button
                                size="small"
                                startIcon={<EditIcon />}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onEditRole(role)
                                }}
                            >
                                Sửa
                            </Button>
                        </ListItemButton>
                    ))}
                </List>
            </CardContent>
        </Card>
    )
}

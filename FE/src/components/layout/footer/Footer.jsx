import { Box, Stack, Typography, Divider, Link } from "@mui/material";
import { APP_NAME, APP_VERSION, FONT_SIZE_XS } from "../common/constants.js";

export default function Footer({
    copyrightName = APP_NAME,
    version = APP_VERSION,
    securityLabel = "Bảo mật quân sự",
    links = [],
    extraInfo,
    showDivider = true,
    compact = false,
    children,
    sx,
}) {
    const year = new Date().getFullYear();
    const copyrightText = `\u00A9 ${year} ${copyrightName}. Mọi quyền được bảo lưu.`;
    const versionText = `Phiên bản ${version}${securityLabel ? " \u00B7 " + securityLabel : ""}`;

    return (
        <Box
            component="footer"
            sx={{
                mt: 4,
                py: compact ? 1.25 : 2,
                px: 4,
                bgcolor: "background.paper",
                borderTop: "1px solid rgba(0,0,0,0.05)",
                color: "text.secondary",
                fontSize: FONT_SIZE_XS,
                ...sx,
            }}
        >
            {showDivider && <Divider sx={{ mb: 1.5, display: "none" }} />}
            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                sx={{ justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" } }}
            >
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    {copyrightText}
                </Typography>

                {children ? (
                    children
                ) : (
                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{ alignItems: "center", flexWrap: "wrap" }}
                    >
                        {extraInfo}
                        {links.length > 0 &&
                            links.map((link) => (
                                <Link
                                    key={link.href || link.label}
                                    href={link.href}
                                    underline="hover"
                                    color="inherit"
                                    sx={{ fontSize: FONT_SIZE_XS }}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        <Typography variant="caption" sx={{ color: "text.secondary" }}>
                            {versionText}
                        </Typography>
                    </Stack>
                )}
            </Stack>
        </Box>
    );
}

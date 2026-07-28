import { DialogTitle, Typography } from "@mui/material";

export default function DialogTitleWrapper({
    children,
    wrap = true,
    sx,
    typographySx,
    ...rest
}) {
    return (
        <DialogTitle
            sx={{
                pb: 2,
                ...(wrap
                    ? {}
                    : { fontSize: 20, fontWeight: 600, textAlign: "center" }),
                ...sx,
                backgroundColor: "background.default",
            }}
            {...rest}
        >
            {wrap ? (
                <Typography
                    sx={{
                        fontSize: 20,
                        fontWeight: 600,
                        textAlign: "center",
                        ...typographySx,
                    }}
                >
                    {children}
                </Typography>
            ) : (
                children
            )}
        </DialogTitle>
    );
}

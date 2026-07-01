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
                pb: 0,
                mb: 2,
                ...(wrap ? {} : { fontSize: 20, fontWeight: 600, textAlign: "center" }),
                ...sx,
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

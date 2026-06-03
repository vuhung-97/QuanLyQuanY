import { alpha, styled } from "@mui/material/styles";
import { InputBase } from "@mui/material";
import { SEARCH_INPUT_WIDTH } from "../common/constants.js";

export const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius * 2,
    backgroundColor: alpha(theme.palette.common.white, 0.1),
    "&:hover": {
        backgroundColor: alpha(theme.palette.common.white, 0.15),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(3),
        width: "auto",
    },
}));

export const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: alpha(theme.palette.common.white, 0.6),
}));

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
        padding: theme.spacing(1.25, 1, 1.25, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create("width"),
        width: "100%",
        fontSize: "0.9rem",
        [theme.breakpoints.up("md")]: {
            width: SEARCH_INPUT_WIDTH,
        },
        "&::placeholder": {
            color: alpha(theme.palette.common.white, 0.5),
            opacity: 1,
        },
    },
}));

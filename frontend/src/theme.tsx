import { createTheme } from "@mui/material/styles";

export const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            light: '#757ce8',
            main: '#3f50b5',
            dark: '#002884',
            contrastText: '#fff',
    },
        background: {
            default: "#000000ff",
            paper: "rgba(13, 13, 13, 1)",
            hover: "rgba(26, 26, 26, 1)",
        },
    },
});
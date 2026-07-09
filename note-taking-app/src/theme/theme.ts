import { createTheme } from "@mui/material";

export const getTheme = (darkMode: boolean) =>
  createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",

      primary: {
        main: "#accbed",
        dark: "#6596c6",
      },

      background: {
        default: darkMode ? "#000000" : "#f5f5f5",
        paper: darkMode ? "#121212" : "#ffffff",
      },

      text: {
        primary: darkMode ? "#ffffff" : "#000000",
        secondary: darkMode ? "#cccccc" : "#666666",
      },
    },
  });
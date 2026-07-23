import { createTheme } from "@mui/material";

export const getTheme = (darkMode: boolean) =>
  createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",

      primary: {
        main: "#973aa8",
        light: "#dec9e9",
        dark: "#7a2d8a",
        contrastText: "#ffffff",
      },

      secondary: {
        main: "#f3e8ff",
        dark: "#dec9e9",
        contrastText: "#973aa8",
      },

      background: {
        default: darkMode ? "#1a1520" : "#faf7fc",
        paper: darkMode ? "#241c2c" : "#ffffff",
      },

      divider: darkMode ? "#3a3145" : "#ece8f0",

      text: {
        primary: darkMode ? "#ffffff" : "#212529",
        secondary: darkMode ? "#cac9cd" : "#5c5666",
      },
    },
  });

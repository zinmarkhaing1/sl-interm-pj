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
    shape: {
      borderRadius: 16,
    },
    typography: {
      fontFamily: ['Inter', 'Segoe UI', 'Roboto', 'sans-serif'].join(","),
      h1: { fontWeight: 700 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 700 },
      h4: { fontWeight: 700 },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 700 },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: 999,
            boxShadow: "none",
            fontWeight: 600,
            padding: "10px 16px",
          },
          contained: {
            boxShadow: "0 10px 24px rgba(151, 58, 168, 0.18)",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 18,
            boxShadow: "0 12px 30px rgba(15, 23, 42, 0.06)",
            border: "1px solid rgba(151, 58, 168, 0.08)",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 18,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 999,
            fontWeight: 600,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: "none",
          },
        },
      },
    },
  });

import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";

interface ThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useThemeContext must be used inside ThemeProvider");
  }

  return context;
};

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);

  const theme = useMemo(
    () =>
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
          borderRadius: 12,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: "none",
                borderRadius: 8,
                fontWeight: 600,
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: "none",
              },
            },
          },
          MuiTextField: {
            defaultProps: {
              variant: "outlined",
              fullWidth: true,
              size: "medium",
            },
          },
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                backgroundColor: darkMode ? "#241c2c" : "#ffffff",
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#dec9e9",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#973aa8",
                  borderWidth: 1.5,
                },
              },
            },
          },
          MuiFormHelperText: {
            styleOverrides: {
              root: {
                marginLeft: 4,
              },
            },
          },
          MuiAlert: {
            styleOverrides: {
              root: {
                borderRadius: 12,
              },
            },
          },
        },
      }),
    [darkMode]
  );

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        toggleDarkMode: () => setDarkMode((prev) => !prev),
      }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

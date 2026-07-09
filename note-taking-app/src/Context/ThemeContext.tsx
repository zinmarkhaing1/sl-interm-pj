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
            main: "#accbed",
            dark: "#6596c6",
          },

          background: {
            default: darkMode ? "#212529" : "#f6f7fb",
            paper: darkMode ? "#212529" : "#ffffff",
          },

          text: {
            primary: darkMode ? "#ffffff" : "#212529",
            secondary: darkMode ? "#cac9cd" : "#403d39",
          },
        },
        components:{
          MuiPaper:{
            styleOverrides:{
              root:{
                backgroundColor:"#f4f5f6",
                color:"#212529",
              }
            }
          }
        }
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
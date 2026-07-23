import { Box, useTheme, useMediaQuery } from "@mui/material";
import { useState } from "react";
import { HeaderBar } from "../header_bar/HeaderBar";
import { SideMenu } from "../sidemenu_bar/SideMenu";

interface MainLayoutprops {
  children: React.ReactNode;
}

const DRAWER_WIDTH = 240;
const COLLAPSED_WIDTH = 72;
const HEADER_HEIGHT = { xs: 56, sm: 64 };

export const MainLayout = ({ children }: MainLayoutprops) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [menuOpen, setMenuOpen] = useState(true);

  const handleToggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const currentWidth = isDesktop
    ? menuOpen
      ? DRAWER_WIDTH
      : COLLAPSED_WIDTH
    : 0;

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <HeaderBar onMenuClick={handleToggleMenu} />

      <SideMenu
        open={menuOpen}
        isDesktop={isDesktop}
        onClose={() => setMenuOpen(false)}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: { xs: `${HEADER_HEIGHT.xs}px`, sm: `${HEADER_HEIGHT.sm}px` },
          px: { xs: 2, sm: 3, md: 4 },
          pt: { xs: 2, sm: 3 },
          pb: 4,
          width: `calc(100% - ${currentWidth}px)`,
          minWidth: 0,
          minHeight: {
            xs: `calc(100vh - ${HEADER_HEIGHT.xs}px)`,
            sm: `calc(100vh - ${HEADER_HEIGHT.sm}px)`,
          },
          transition: "width 0.3s ease",
          boxSizing: "border-box",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

import { Box } from "@mui/material";
import { HeaderBar } from "../header_bar/HeaderBar";
import { SideMenu } from "../sidemenu_bar/SideMenu";

interface MainLayoutprops {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutprops) => {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#dee4ea",
        overflowX: "hidden",
      }}
    >
      <SideMenu />
      <Box sx={{ flexGrow: 1, minWidth: 0, width: "100%", overflowX: "hidden" }}>
        <HeaderBar />
        <Box
          component="main"
          sx={{
            width: "100%",
            minWidth: 0,
            px: { xs: 2, sm: 3, md: 4 },
            pt: { xs: 14, sm: 11 },
            pb: { xs: 2, sm: 3 },
            display:"flex",
            minHeight:"100vh",
            overflowX: "hidden",
            overflowY: "hidden",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};



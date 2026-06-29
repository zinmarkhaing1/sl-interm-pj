import React, { useState } from "react";
import { Box,useTheme, useMediaQuery } from "@mui/material";
import { HeaderBar } from "../header_bar/HeaderBar";
import { SideMenu } from "../sidemenu_bar/SideMenu";

interface MainLayoutprops {
  children: React.ReactNode;
}

// const drawerWidth = 240;
// const collapsedWidth = 72;

export const MainLayout = ({ children }: MainLayoutprops) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  
  // Sidebar ပွင့်/ပိတ် State ကို Layout မှာ သိမ်းထားပါတယ်
  const [menuOpen, setMenuOpen] = useState(true);

  const handleToggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        // bgcolor: "#dee4ea",
        backgroundColor:"#f4f6f8",
        overflow: "hidden",
      }}
    >
   
      <HeaderBar onMenuClick={handleToggleMenu} />
      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          mt: "64px", // ⚠️ အရေးကြီးဆုံးအချက်: HeaderBar ရဲ့ Height (64px) အတိုင်း အောက်ကို တွန်းချလိုက်တာမို့ ကွက်လပ် လုံးဝ မကျန်တော့ပါဘူး
          position: "relative",
        }}
      >
      <SideMenu 
      open={menuOpen} 
        isDesktop={isDesktop} 
        onClose={() => setMenuOpen(false)}/>
      {/* <Box sx={{ flexGrow: 1, minWidth: 0, width: "100%", overflowX: "hidden" }}>
        <HeaderBar /> */}
        <Box
          component="main"
          sx={{
            // width: "100%",
            // minWidth: 0,
            // px: { xs: 2, sm: 3, md: 4 },
            // pt: { xs: 14, sm: 11 },
            // pb: { xs: 2, sm: 3 },
            // display:"flex",
            // minHeight:"100vh",
            // overflowX: "hidden",
            // overflowY: "hidden",
            flexGrow: 1,
          // p: 3,
          width: "100%",
          // pt: "84px",
          overflowY: "auto",
           minWidth: 0,
            px: { xs: 2, sm: 3, md: 4 },
            pt: { xs: 14, sm: 11 },
            pb: { xs: 2, sm: 3 },
            display:"flex", 
          transition: "margin 0.3s ease",
          minHeight: "100vh",
          boxSizing: "border-box",
          }}
        >
          {children}
        </Box>
      </Box>
      </Box>
      

  );
};



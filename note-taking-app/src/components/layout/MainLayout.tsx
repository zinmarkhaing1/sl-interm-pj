// import React, { useState } from "react";
// import { Box,useTheme, useMediaQuery } from "@mui/material";
// import { HeaderBar } from "../header_bar/HeaderBar";
// import { SideMenu } from "../sidemenu_bar/SideMenu";

// interface MainLayoutprops {
//   children: React.ReactNode;
// }

// // const drawerWidth = 240;
// // const collapsedWidth = 72;

// export const MainLayout = ({ children }: MainLayoutprops) => {
//   const theme = useTheme();
//   const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  
//   const [menuOpen, setMenuOpen] = useState(true);

//   const handleToggleMenu = () => {
//     setMenuOpen(!menuOpen);
//   };
//   return (
//     <Box
//       sx={{
//         display: "flex",
//         minHeight: "100vh",     
//         bgcolor: "background.default",
//          overflowX: "hidden",
         
//       }}
//     >
   
//       <HeaderBar onMenuClick={handleToggleMenu} />
//       <Box
//         sx={{
//           display: "flex",
//           flexGrow: 1,
//           mt: "50px", 
//           position: "relative",
//         }}
//       >
//       <SideMenu 
//       open={menuOpen} 
//         isDesktop={isDesktop} 
//         onClose={() => setMenuOpen(false)}/>
//       {/* <Box sx={{ flexGrow: 1, minWidth: 0, width: "100%", overflowX: "hidden" }}>
//         <HeaderBar /> */}
//         <Box
//           component="main"
//           sx={{
            
//           //   flexGrow: 1,
//           // width: "100%",
        
//           //   px: { xs: 2, sm: 3, md: 4 },
//           //   pt: { xs: 14, sm: 11 },
//           //   pb: { xs: 2, sm: 3 },
//           //   display:"flex", 
//           // transition: "margin 0.3s ease",
//           // minHeight: "100vh",
//           // boxSizing: "border-box",
          
//           flexGrow: 1,
//     width: "100%",
//     minWidth: 0,
//     px: { xs: 2, sm: 3, md: 4 },
//     pt: { xs: 2, sm: 2 },
//     pb: 2,
//     boxSizing: "border-box",
//     overflow:"visible"
//           }}
//         >
//           {children}
//         </Box>
//       </Box>
//       </Box>
      

//   );
// };


// import React, { useState } from "react";
// import { Box, useTheme, useMediaQuery } from "@mui/material";
// import { HeaderBar } from "../header_bar/HeaderBar";
// import { SideMenu } from "../sidemenu_bar/SideMenu";

// interface MainLayoutprops {
//   children: React.ReactNode;
// }

// const DRAWER_WIDTH = 240;
// const COLLAPSED_WIDTH = 72;

// export const MainLayout = ({ children }: MainLayoutprops) => {
//   const theme = useTheme();
//   const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  
//   const [menuOpen, setMenuOpen] = useState(true);

//   const handleToggleMenu = () => {
//     setMenuOpen(!menuOpen);
//   };

  


//   const drawerWidth = menuOpen && isDesktop ? DRAWER_WIDTH : COLLAPSED_WIDTH;

//   return (
//     <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
   
//       <HeaderBar onMenuClick={handleToggleMenu} />
      
//       {/* SideMenu */}
//       <SideMenu 
//         open={menuOpen} 
//         isDesktop={isDesktop} 
//         onClose={() => setMenuOpen(false)}
//       />
      
//       {/* Main Content */}
//       <Box
//         component="main"
//         sx={{
//           flexGrow: 1,
//           mt: '64px', // HeaderBar height
//           ml: `${drawerWidth}px`, // SideMenu width အတိုင်း
//           px: { xs: 2, sm: 3, md: 4 },
//           pt: { xs: 2, sm: 3 },
//           pb: 4,
//           width: `calc(100% - ${drawerWidth}px)`,
//           minHeight: 'calc(100vh - 64px)',
//           transition: 'margin 0.3s ease, width 0.3s ease',
//           boxSizing: 'border-box',
//           bgcolor: 'background.default',
//         }}
//       >
//         {children}
//       </Box>
//     </Box>
//   );
// };

import {Box,useTheme,useMediaQuery } from "@mui/material";
import { useState } from "react";
import { HeaderBar } from "../header_bar/HeaderBar";
import { SideMenu } from "../sidemenu_bar/SideMenu";
interface MainLayoutprops {
  children: React.ReactNode;
}


export const MainLayout = ({ children }: MainLayoutprops) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  
  
  
  const [menuOpen, setMenuOpen] = useState(true);
const DRAWER_WIDTH = 240;
const COLLAPSED_WIDTH = 72;
  const handleToggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

 
  const currentWidth = isDesktop 
    ? (menuOpen ? DRAWER_WIDTH : COLLAPSED_WIDTH) 
    : 0; 

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
   
      <HeaderBar onMenuClick={handleToggleMenu} />
      
      {/* SideMenu */}
      <SideMenu 
        open={menuOpen} 
        isDesktop={isDesktop} 
        onClose={() => setMenuOpen(false)}
      />
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: { xs: '56px', sm: '64px' }, 
          px: { xs: 2, sm: 3, md: 4 },
          pt: { xs: 2, sm: 3 },
          pb: 4,
          width: `calc(100% - ${currentWidth}px)`,
          minHeight: '100vh',
          transition: 'margin 0.3s ease, width 0.3s ease',
          boxSizing: 'border-box',
          bgcolor: 'background.default',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
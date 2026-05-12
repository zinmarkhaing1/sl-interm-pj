


// import React, { useState } from 'react';
// import { Box } from "@mui/material";
// import { CreateNotePage } from "../../pages/CreateNotePage";
// import { NoteCategory } from "../note_layout/NoteCategory";
// import { SideMenu } from "../sidemenu_bar/SideMenu"; 

// export const MainLayout = () => {
  
//   const [activeView, setActiveView] = useState<"create" | "list" | "categories">("create");

//   return (
//     <Box sx={{ minHeight: "100vh", bgcolor: "#c4e8f5", display: "flex" }}>
      
      
//       <SideMenu setView={setActiveView} />

//       <Box sx={{ flexGrow: 1, p: 3 }}>
     
//         <Box sx={{ display: "flex", justifyContent: "center" }}>
//           {activeView === "create" && <CreateNotePage />}
//           {activeView === "list" && <NoteCategory />}
       
//         </Box>
//       </Box>
//     </Box>
//   );
// };


import {   Box } from "@mui/material"
import { HeaderBar } from "../header_bar/HeaderBar"
import { SideMenu } from "../sidemenu_bar/SideMenu"
interface MainLayoutprops {
children: React.ReactNode
}
export const MainLayout = ({children}: MainLayoutprops) => {
    
    return(
            <Box sx={{display:'flex'}}>
            <SideMenu/>
            <Box sx={{flexGrow:1}}>
                <HeaderBar/>
            {children}

            </Box >
        </Box>


    )
}   
        

// import { Box } from "@mui/material"
// import { HeaderBar } from "../header_bar/HeaderBar"
// import { SideMenu } from "../sidemenu_bar/SideMenu"

// export const MainLayout = () => {
//     return(
//         <Box sx={{display:'flex'}}>
//             <HeaderBar/>
//             <SideMenu/>
//         </Box>

//     )
// }




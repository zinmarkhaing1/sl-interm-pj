// import React, { useState, useEffect } from "react";

import {
  Drawer,
  List,
  Toolbar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,

} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
// import NoteIcon from "@mui/icons-material/Note";
import EventNoteIcon from '@mui/icons-material/EventNote';
import CategoryIcon from "@mui/icons-material/Category";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';


import { useNavigate,useLocation } from "react-router-dom";

const drawerWidth = 240;
const collapsedWidth = 72;

interface SideMenuProps {
  open: boolean;
  isDesktop: boolean;
  onClose: () => void;
}

export const SideMenu = ({ open, isDesktop, onClose }: SideMenuProps) => {
  // const [open, setOpen] = React.useState(false);
  // const theme = useTheme();

  // const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  // const toggleDrawer = (newOpen: boolean) => () => {
  //   setOpen(newOpen);
  // };
  const navigate = useNavigate();
  const location = useLocation();
  // const handleLogout = () => {
  //   localStorage.removeItem("token");
  //   navigate("/login");
  // };
  // const [scrolled, setScrolled] = useState(false);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (window.scrollY > 10) {
  //       setScrolled(true);
  //     } else {
  //       setScrolled(false);
  //     }
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);
  const menuStyle = (path:string) => ({
     flexDirection: isDesktop && !open ? "column" : "row",
  py: 1,
  px: isDesktop && !open ? 1 : 2,
  justifyContent: isDesktop && !open ? "center" : "flex-start",
  alignItems: "center",
  mx:2.5,
  my:0.5,
  borderRadius : "12px",

  color: location.pathname === path ? "#973aa8" : "#000",
  // backgroundColor:location.pathname === path ? "#ffe5ec" : "transparent",

  "& .MuiListItemIcon-root": {
    color: location.pathname === path ? "#973aa8" : "#000",
  },

  "&:hover": {
    // backgroundColor: "#ffe5ec",
    color: "#973aa8",

    "& .MuiListItemIcon-root": {
      color: "#973aa8",
    },
  },
  })

  const DraweList = (
    <Box
      role="presentation"
      sx={{
       
        width: isDesktop && !open ? collapsedWidth : drawerWidth,
        height: "100%",
        
        backgroundColor:"#f4f6f8",
        overflowX: "hidden",
        transition: "width 0.3s ease",
        "&::-webkit-scrollbar": {
          width: "4px",
        },
        "&::-webkit-scrollbar-track": {
          background: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#b0bec5", 
          borderRadius: "10px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          background: "#90a4ae",
        },
      }}
      onClick={isDesktop ? undefined : onClose}
    >
      <Toolbar />
      <List>
        {/* dashboard  */}
        <ListItemButton
          onClick={() => navigate("/")}
         sx={menuStyle("/")}
        >
          <ListItemIcon
           sx={{
              minWidth: isDesktop && !open ? 0 : 40,
              justifyContent: "center",
              
              
            }}
          >
            <DashboardIcon  />
          </ListItemIcon>
          <ListItemText
          primary="Home"
          sx={{
            display: isDesktop && !open ? "none" : "block",
            ml: isDesktop && !open ? 0 : 1,
          }}
/>
        </ListItemButton>

        {/* <Divider sx={{ my: 1 }} /> */}

        <ListItemButton
          onClick={() => navigate("/note-form")}
           sx={menuStyle("/note-form")}
          // sx={{
          // //   flexDirection: isDesktop && !open ? "column" : "row",
          // //   py: 1.5,
          // //   px: isDesktop && !open ? 1 : 2,
          // // justifyContent: isDesktop && !open ? "center" : "flex-start",
          // // alignItems: "center",
         
          // }}
        >
          <ListItemIcon
            sx={{
              minWidth: isDesktop && !open ? 0 : 40,
              justifyContent: "center",
              
            }}
          >
            <EventNoteIcon />
          </ListItemIcon>
          <ListItemText
            primary="Note Form"
          sx={{
            display: isDesktop && !open ? "none" : "block",
            ml: isDesktop && !open ? 0 : 1,
          }}
/>
          
        </ListItemButton>

        <ListItemButton
          onClick={() => navigate("/tasks-note")}
          sx={menuStyle("/tasks-note")}
          // sx={{
          //   flexDirection: isDesktop && !open ? "column" : "row",
          //   py: 1.5,
          //   px: isDesktop && !open ? 1 : 2,
          // justifyContent: isDesktop && !open ? "center" : "flex-start",
          // alignItems: "center",
          // }}
        >
          <ListItemIcon
            sx={{
              minWidth: isDesktop && !open ? 0 : 40,
              justifyContent: "center",
              
            }}
          >
            <TaskAltIcon />
          </ListItemIcon>
          <ListItemText
            primary="Task Notes"
          sx={{
            display: isDesktop && !open ? "none" : "block", 
            ml: isDesktop && !open ? 0 : 1,
          }}
/>
          
        </ListItemButton>

        <ListItemButton onClick={() => navigate("/category")}
         sx={menuStyle("/category")}>
          <ListItemIcon
            sx={{
              minWidth: isDesktop && !open ? 0 : 40,
              justifyContent: "center",
             
            }}
          >
            <CategoryIcon />
          </ListItemIcon>
          <ListItemText
             primary="Categories"
          sx={{
            display: isDesktop && !open ? "none" : "block", 
            ml: isDesktop && !open ? 0 : 1,
          }}
/>
        </ListItemButton>

        <ListItemButton
          onClick={() => navigate("/board")}
          sx={menuStyle("/board")}
          // sx={{
          //   flexDirection: isDesktop && !open ? "column" : "row",
          //   py: 1.5,
          //   px: isDesktop && !open ? 1 : 2,
          // justifyContent: isDesktop && !open ? "center" : "flex-start",
          // alignItems: "center",
          // }}
        >
          <ListItemIcon
            sx={{
              minWidth: isDesktop && !open ? 0 : 40,
              justifyContent: "center",
             
            }}
          >
            <LeaderboardIcon />
          </ListItemIcon>
          <ListItemText
           primary="Board"
          sx={{
            display: isDesktop && !open ? "none" : "block",
            ml: isDesktop && !open ? 0 : 1,
          }}
/>
        </ListItemButton>

        <ListItemButton
          onClick={() => navigate("/my-tasks")}
         sx={menuStyle("/my-tasks")}
        >
          <ListItemIcon
           sx={{
              minWidth: isDesktop && !open ? 0 : 40,
              justifyContent: "center",
              
              
            }}
          >
            <AssignmentIndOutlinedIcon/>
          </ListItemIcon>
          <ListItemText
          primary="My Tasks"
          sx={{
            display: isDesktop && !open ? "none" : "block",
            ml: isDesktop && !open ? 0 : 1,
          }}
/>
        </ListItemButton>
         <ListItemButton
          onClick={() => navigate("/my-project")}
         sx={menuStyle("/my-project")}
        >
          <ListItemIcon
           sx={{
              minWidth: isDesktop && !open ? 0 : 40,
              justifyContent: "center",
              
              
            }}
          >
            <BusinessCenterOutlinedIcon/>
          </ListItemIcon>
          <ListItemText
          primary="Projects"
          sx={{
            display: isDesktop && !open ? "none" : "block",
            ml: isDesktop && !open ? 0 : 1,
          }}
/>
        </ListItemButton>


        {/* logout  */}
        {/* <ListItemButton
          onClick={handleLogout}
        
          sx={{
            flexDirection: isDesktop && !open ? "column" : "row",
            py: 1,
            px: isDesktop && !open ? 1 : 2,
          justifyContent: isDesktop && !open ? "center" : "flex-start",
            alignItems: "center",
            mx:2.5,
            my:0.5,
            borderRadius:"12px",
            color:"000",
            "& .MuiListItemIcon-root": {
      color: "#000",
    },
     "&:hover": {
      // backgroundColor: "#ffe5ec",
      color: "#973aa8",

      "& .MuiListItemIcon-root": {
        color: "#973aa8",
      },
    },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: isDesktop && !open ? 0 : 40,
              justifyContent: "center",
              // mb: isDesktop && !open ? 0.5 : 0,
            }}
          >
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText
           primary="Logout"
          sx={{
            display: isDesktop && !open ? "none" : "block", 
            ml: isDesktop && !open ? 0 : 1,
          }}
/>
        </ListItemButton> */}
      </List>
    </Box>
  );
  return (
    <Box
      component="nav"
      sx={{
        width: isDesktop ? (open ? drawerWidth : collapsedWidth) : 0,
        flexShrink: 0,
        transition: "width 0.3s ease",

      }}
    >
      
      <Drawer
        variant={isDesktop ? "permanent" : "temporary"}
        open={isDesktop ? true : open}
        onClose={isDesktop ? undefined :onClose}
        sx={{
         
          zIndex: (theme) => theme.zIndex.appBar - 1,
          "& .MuiDrawer-paper": {
            width:isDesktop ? (open ? drawerWidth : collapsedWidth) : drawerWidth,
            maxWidth: "82vw",
            boxSizing: "border-box",
            borderRight: "1px solid #ccc",
            bgcolor: "#dee4ea",
            transition: "width 0.3s ease",
            overflowX: "hidden",
          },
        
        }}
      >
    
        
         <Box sx={{ height: "10px", minHeight: 0 }} />
        {DraweList}
      </Drawer>
    </Box>
  );
};

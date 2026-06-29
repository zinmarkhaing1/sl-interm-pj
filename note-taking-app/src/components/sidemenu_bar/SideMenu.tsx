// import React, { useState, useEffect } from "react";

import {
  Drawer,
  List,
  Toolbar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,

} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
// import NoteIcon from "@mui/icons-material/Note";
import EventNoteIcon from '@mui/icons-material/EventNote';
import CategoryIcon from "@mui/icons-material/Category";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import TaskAltIcon from '@mui/icons-material/TaskAlt';

import { useNavigate } from "react-router-dom";

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
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
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
          background: "#b0bec5", // Scrollbar အရောင်
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
          sx={{
            flexDirection: isDesktop && !open ? "column" : "row",
            py: 1.5,
          px: isDesktop && !open ? 1 : 2, // Spacing 
          justifyContent: isDesktop && !open ? "center" : "flex-start", 
          alignItems: "center",
          }}
        >
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText
          primary="Home"
          sx={{
            display: isDesktop && !open ? "none" : "block",
            ml: isDesktop && !open ? 0 : 1,
          }}
/>
        </ListItemButton>

        <Divider sx={{ my: 1 }} />

        <ListItemButton
          onClick={() => navigate("/note-form")}
          sx={{
            flexDirection: isDesktop && !open ? "column" : "row",
            py: 1.5,
            px: isDesktop && !open ? 1 : 2,
          justifyContent: isDesktop && !open ? "center" : "flex-start",
          alignItems: "center",
          }}
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
          sx={{
            flexDirection: isDesktop && !open ? "column" : "row",
            py: 1.5,
            px: isDesktop && !open ? 1 : 2,
          justifyContent: isDesktop && !open ? "center" : "flex-start",
          alignItems: "center",
          }}
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
            display: isDesktop && !open ? "none" : "block", // စာသားဖျောက်ရန်
            ml: isDesktop && !open ? 0 : 1,
          }}
/>
          
        </ListItemButton>

        <ListItemButton onClick={() => navigate("/category")}
          sx={{
          flexDirection: isDesktop && !open ? "column" : "row",
          py: 1.5,
          px: isDesktop && !open ? 1 : 2,
          justifyContent: isDesktop && !open ? "center" : "flex-start",
          alignItems: "center",
        }}>
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
          sx={{
            flexDirection: isDesktop && !open ? "column" : "row",
            py: 1.5,
            px: isDesktop && !open ? 1 : 2,
          justifyContent: isDesktop && !open ? "center" : "flex-start",
          alignItems: "center",
          }}
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

        {/* logout  */}
        <ListItemButton
          onClick={handleLogout}
          sx={{
            flexDirection: isDesktop && !open ? "column" : "row",
            py: 1.5,
            px: isDesktop && !open ? 1 : 2,
          justifyContent: isDesktop && !open ? "center" : "flex-start",
            alignItems: "center",
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
        </ListItemButton>
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

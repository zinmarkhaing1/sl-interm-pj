import React, { useState, useEffect } from "react";

import {
  Drawer,
  List,
  Toolbar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import NoteIcon from "@mui/icons-material/Note";
import CategoryIcon from '@mui/icons-material/Category';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

export const SideMenu = () => {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();

  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const DraweList = (
    <Box
      role="presentation"
      sx={{
        width: drawerWidth,
        maxWidth: "82vw",
        // boxShadow: scrolled ? 4 : 0,
        transition: "0.3s",
        // minHeight: "100vh",
        height: "calc(100vh - 64px)",
        overflowY:"auto",
        bgcolor:"#dee4ea",
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
      onClick={isDesktop ? undefined : toggleDrawer(false)}
    >
      <List>
        {/* dashboard  */}
        <ListItemButton onClick={() => navigate("/")}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>

        <Divider sx={{ my: 1 }} />
        

        <ListItemButton onClick={() => navigate("/note-form")}>
          <ListItemIcon>
           <NoteIcon />
          </ListItemIcon>
          <ListItemText primary="Note" />
        </ListItemButton>

        <ListItemButton onClick={() => navigate("/category")}>
          <ListItemIcon>
            <CategoryIcon/>
          </ListItemIcon>
          <ListItemText primary="Categories" />
        </ListItemButton>

    
        <ListItemButton onClick={() => navigate("/board")}>
          <ListItemIcon>
            <LeaderboardIcon/>
          </ListItemIcon>
          <ListItemText primary="Board" />
        </ListItemButton>


       

        {/* logout  */}
        <ListItemButton onClick={handleLogout}>
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Box>
  );
  return (
    <Box
    component="nav"
      sx={{
        // bgcolor: "#dee4ea",
        width: { xs: 0, md: drawerWidth },
        flexShrink: 0,
        // position: "sticky",
        // top: 0,
        // minHeight: "100vh",
        // boxShadow: scrolled ? 4 : 0,
        // transition: "0.3s",
      }}
    >
      {!isDesktop && (
      <IconButton
        onClick={toggleDrawer(true)}
        sx={{
          position: "fixed",
          top: { xs: 12, sm: 24 },
          left: { xs: 12, sm: 16 },
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: "#dee4ea",
          "&:hover": {
            bgcolor: "#cfd8e3",
          },
        }}
      >
        <MenuIcon />
      </IconButton>
      )};
      <Drawer
        variant={isDesktop ? "permanent" : "temporary"}
        open= {isDesktop ? true : open}
        onClose={isDesktop ? undefined : toggleDrawer(false)}
        sx={{
          // width: drawerWidth,
          // flexShrink: 0,
          zIndex: (theme) => theme.zIndex.appBar - 1,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            maxWidth: "82vw",
            boxSizing: "border-box",
            borderRight:"1px solid #ccc",
            bgcolor:"#dee4ea",
          },
          position: "fixed",
        }}
      >
        <Toolbar/>
        {DraweList}
      </Drawer>
    </Box>
  );

};

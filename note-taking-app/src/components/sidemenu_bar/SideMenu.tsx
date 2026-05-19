import React, { useState, useEffect } from "react";

import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  IconButton,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import NoteIcon from "@mui/icons-material/Note";
import LabelIcon from "@mui/icons-material/Label";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";

const drawerWidth = 150;
const railWidth = 72;

export const SideMenu = () => {
  const [open, setOpen] = React.useState(false);
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
        boxShadow: scrolled ? 4 : 0,
        transition: "0.3s",
        minHeight: "100vh",
      }}
      onClick={toggleDrawer(false)}
    >
      <List>
        {/* dashboard  */}
        <ListItemButton sx={{ position: "static" }} onClick={() => navigate("/")}>
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
            <LabelIcon />
          </ListItemIcon>
          <ListItemText primary="Categories" />
        </ListItemButton>

    
        <ListItemButton onClick={() => navigate("/board")}>
          <ListItemIcon>
            <LabelIcon />
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
      sx={{
        bgcolor: "#dee4ea",
        width: { xs: 0, sm: railWidth },
        flexShrink: 0,
        position: "sticky",
        top: 0,
        minHeight: "100vh",
        boxShadow: scrolled ? 4 : 0,
        transition: "0.3s",
      }}
    >
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
      <Drawer
        open={open}
        onClose={toggleDrawer(false)}
        variant="temporary"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            maxWidth: "82vw",
            boxSizing: "border-box",
          },
          position: "fixed",
        }}
      >
        {/* <Toolbar/> */}
        {DraweList}
      </Drawer>
    </Box>
  );
};

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
import DeleteIcon from "@mui/icons-material/Delete";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
// import { CategoriesPage } from '../tag_categories/CategoriesPage';

const drawerWidth = 150;
// interface SideMenuProps {
//     setView: (view:'create' | 'list' |'categories') => void;
// }
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
      sx={{
        width: 150,
        role: "presentation",
        bgcolor: scrolled ? "#d0e0ef" : "rgba(208,224,239,0.4)",
        backdropFilter: "blur(10px)",
        transition: "0.3s",
        minHeight: "100vh",
        // position: "static",
      }}
      onClick={toggleDrawer(false)}
    >
      <List>
        {/* dashboard  */}
        <ListItemButton sx={{position: 'static'}}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText onClick={() => navigate("/")} primary="Dashboard" />
        </ListItemButton>

        <Divider sx={{ my: 1 }} />
        {/* Categories  */}
        <ListItemButton>
          <ListItemIcon>
            <LabelIcon />
          </ListItemIcon>
          <ListItemText
            onClick={() => navigate("/category")}
            primary="Tags / Categories"
          />
        </ListItemButton>

        <ListItemButton>
          <ListItemIcon>
            <LabelIcon />
          </ListItemIcon>
          <ListItemText
            onClick={() => navigate("/create")}
            primary="Create Note"
          />
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <LabelIcon />
          </ListItemIcon>
          <ListItemText
            onClick={() => navigate("/note")}
            primary="Note Category"
          />
        </ListItemButton>

        {/* FlashCard  */}
        <ListItemButton>
          <ListItemIcon>
            <NoteIcon />
          </ListItemIcon>
          <ListItemText primary="FlashCard" />
        </ListItemButton>

        {/* Trash  */}
        <ListItemButton>
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText onClick={() => navigate("/trash")} primary="Trash" />
        </ListItemButton>

        {/* logout  */}
        <ListItemButton>
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText onClick={handleLogout} primary="Logout" />
        </ListItemButton>
      </List>
    </Box>
  );
  return (
    <Box sx={{ bgcolor: "#dee4ea", position:'sticky', minHeight:'100vh' }}>
      <IconButton onClick={toggleDrawer(true)} sx={{ m: 3, position:'sticky' }}>
        <MenuIcon />
      </IconButton>
      <Drawer
        open={open}
        onClose={toggleDrawer(false)}
        variant="temporary"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "&.MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
          position: "fixed",
        }}
      >
        {/* <Toolbar/> */}
        {DraweList}
      </Drawer>
    </Box>
  );
};

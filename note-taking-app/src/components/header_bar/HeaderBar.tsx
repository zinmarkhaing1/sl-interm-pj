// import React from 'react'
import {
  AppBar,
  InputBase,
  styled,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Badge,
  Avatar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import NotificationsIcon from "@mui/icons-material/Notifications";

import { useState } from "react";
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "#f1f1f1",
  marginLeft: 20,
  width: "300px",
  display: "flex",
  alignItems: "center",
  padding: "0 10px",
}));

export const HeaderBar = () => {
  const [darkMode, setDarkMode] = useState(false);
  return (
      <AppBar 
      position="static"
      sx={{ bgcolor: darkMode ? "#3b5673" : "#2f78c1",mt:3 }}
    >
      <Toolbar >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {" "}
          Note Book
        </Typography>
        <Search>
          <SearchIcon sx={{ color: "gray", mr: 1 }} />
          <InputBase placeholder="Search..." fullWidth />
          </Search>
          <Box sx={{ flexGrow: 1 }} />

          <IconButton color="inherit" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>

          <IconButton color="inherit">
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <IconButton sx={{ ml: 1 }}>
            <Avatar alt="User" src="https://i.pravatar.cc/300" />
          </IconButton>
        
      </Toolbar>
    </AppBar>

    
  );
};

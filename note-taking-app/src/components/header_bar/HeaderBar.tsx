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
  Stack,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import NotificationsIcon from "@mui/icons-material/Notifications";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
  // const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
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
  const token = localStorage.getItem("token");
  // const handleLogout = () => {
  //   localStorage.removeItem('token');
  //   navigate('/login');
  // }
  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: darkMode ? "#59789a" : "#dee4ea",
        boxShadow: scrolled ? 3 : 0,
        opacity: scrolled ? 0.9 : 1,
        transition: "0.3s",
      }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "black" }}>
          {" "}
          Note Book
        </Typography>
        <Search>
          <SearchIcon sx={{ color: "gray", mr: 1 }} />
          <InputBase
            placeholder="Search..."
            fullWidth
            sx={{ color: "black" }}
          />
        </Search>
        <Box sx={{ flexGrow: 1 }} />

        <IconButton
          sx={{ color: "gray" }}
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>

        <IconButton sx={{ color: "gray" }}>
          <Badge badgeContent={3} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        {token ? (
          <Stack direction="row" spacing={2} sx={{ m: 2 }}>
            <IconButton>
              <Avatar
                alt="User"
                src="https://i.pravatar.cc/300"
                component={Link}
                to="/profile"
              />
            </IconButton>
            {/* <Button variant="contained" color="info" onClick={handleLogout}>Logout</Button> */}
          </Stack>
        ) : (
          <Stack spacing={2} direction="row" sx={{ m: 2 }}>
            <Button variant="contained" component={Link} to="/login">
              Login
            </Button>
            <Button variant="contained" component={Link} to="/signup">
              Sign Up
            </Button>
          </Stack>
        )}

        {/* <Stack spacing={2} direction='row' sx={{m:2}}>
            <Button variant="contained" sx={{ m:2 }}  component={Link} to='/signup'>Sign Up</Button>
          </Stack>
          <IconButton sx={{ ml: 1 }}>
            <Avatar alt="User" src="https://i.pravatar.cc/300" />
          </IconButton> */}
      </Toolbar>
    </AppBar>
  );
};

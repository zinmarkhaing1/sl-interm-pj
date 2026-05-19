
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Stack,
  Button,
} from "@mui/material";

import Brightness7Icon from "@mui/icons-material/Brightness7";
import Brightness4Icon from "@mui/icons-material/Brightness4";


import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface UserProfile {
  firstName?: string;
  photo?: string;
}

const sideRailWidth = 72;



export const HeaderBar = () => {
  // const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        setUser(null);
        return;
      }

      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
        localStorage.removeItem("user");
      }
    };

    const handleProfileUpdated = (event: Event) => {
      const updatedUser = (event as CustomEvent<UserProfile>).detail;
      if (updatedUser) {
        setUser(updatedUser);
        return;
      }

      loadUser();
    };

    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    loadUser();
    window.addEventListener("profileUpdated", handleProfileUpdated);
    window.addEventListener("storage", loadUser);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdated);
      window.removeEventListener("storage", loadUser);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const token = localStorage.getItem("token");
  
  return (
    <AppBar
      position="fixed"
      sx={{
        bgcolor: darkMode ? "#59789a" : "#dee4ea",
        boxShadow: scrolled ? 3:"none",
        left: { xs: 0, sm: sideRailWidth },
        right: 0,
        width: { xs: "100%", sm: `calc(100% - ${sideRailWidth}px)` },
        transition: "0.3s",
      }}
    >
      <Toolbar
        sx={{
          maxHeight:25,
          py: 0,
          gap: { xs: 1, sm: 2 },
          flexWrap: { xs: "wrap", sm: "nowrap" },
          // py: { xs: 1, sm: 0 },
          pl: { xs: 7, sm: 2 },
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: "black",
            fontSize: { xs: "1.25rem", sm: "1.5rem" },
            whiteSpace: "nowrap",
          }}
        >
          {" "}
          Note Book
        </Typography>
        
        <Box sx={{ flexGrow: 1 }} />

        <IconButton
          sx={{ color: "gray" }}
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>

        
        {token ? (
          <Stack direction="row" spacing={1} sx={{ my: { xs: 0, sm: 2 } }}>
            <IconButton component={Link} to="/profile">
              <Avatar
                alt={user?.firstName || "User"}
                src={user?.photo || "https://i.pravatar.cc/300"}
                key={user?.photo || "default-avatar"}
              />
            </IconButton>
          </Stack>
        ) : (
          <Stack spacing={1} direction="row" sx={{ my: { xs: 0, sm: 2 } }}>
            <Button size="small" variant="contained" component={Link} to="/login">
              Login
            </Button>
            <Button size="small" variant="contained" component={Link} to="/signup">
              Sign Up
            </Button>
          </Stack>
        )}

        
      </Toolbar>
    </AppBar>
  );
};

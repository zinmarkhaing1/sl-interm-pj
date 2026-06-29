
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
import MenuIcon from "@mui/icons-material/Menu";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Brightness4Icon from "@mui/icons-material/Brightness4";


import { useState, useEffect } from "react";
import { Link } from "react-router-dom";


interface UserProfile {
  firstName?: string;
  photo?: string;
}

interface HeaderBarProps {
  onMenuClick : () => void;
}




export const HeaderBar = ({onMenuClick} : HeaderBarProps) => {
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

        backgroundColor:darkMode ? "#78828e" : "#f4f6f8",
        // boxShadow: scrolled ? 0.5:"none",
        // left: { xs: 0, sm: sideRailWidth },
        left:0,
        right: 0,
       zIndex:(theme) => theme.zIndex.drawer + 1,
        // width: { xs: "100%", sm: `calc(100% - ${sideRailWidth}px)` },
        // transition: "0.3s",
        borderBottom: scrolled ? "1px solid rgba(0,0,0,0.05)" : "1px solid transparent",
      }}
    >
      <Toolbar
        sx={{
          // maxHeight:25,
          // py: 0,
          // gap: { xs: 1, sm: 2 },
          // flexWrap: { xs: "wrap", sm: "nowrap" },
          // // py: { xs: 1, sm: 0 },
          // pl: { xs: 7, sm: 2 },
          height: 64,
          px: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
      <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5, 
          }}
        >
          {/* Hamburger Menu Button */}
          <IconButton 
            onClick={onMenuClick} 
            sx={{ 
              color: "black", 
              p: 1 
            }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "black",
              fontSize: { xs: "1.2rem", sm: "1.4rem" },
              whiteSpace: "nowrap",
              lineHeight: 1,
              letterSpacing: "0.5px",
            }}
          >
            Note Book
          </Typography>
        </Box>
        
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
                src={user?.photo || ""}
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

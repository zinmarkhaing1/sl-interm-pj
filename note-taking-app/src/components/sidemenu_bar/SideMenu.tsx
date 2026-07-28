import {
  Drawer,
  List,
  ListSubheader,
  Toolbar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CategoryIcon from "@mui/icons-material/Category";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { useNavigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { SpeakerNotesOutlined } from "@mui/icons-material";

const drawerWidth = 240;
const collapsedWidth = 72;

interface SideMenuProps {
  open: boolean;
  isDesktop: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: ReactNode;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { label: "Home", path: "/", icon: <HomeOutlinedIcon /> },
      { label: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
    ],
  },
  {
    title: "Work",
    items: [
      {
        label: "Projects",
        path: "/my-project",
        icon: <BusinessCenterOutlinedIcon />,
      },
      { label: "Board", path: "/board", icon: <LeaderboardIcon /> },
    ],
  },
  {
    title: "Tasks",
    items: [
      { label: "Task Notes", path: "/tasks-note", icon: <TaskAltIcon /> },
      {
        label: "My Tasks",
        path: "/my-tasks",
        icon: <AssignmentIndOutlinedIcon />,
      },
    ],
  },
  {
    title: "Organize",
    items: [
      { label: "Categories", path: "/category", icon: <CategoryIcon /> },
      { label: "Notes", path: "/note-form", icon: <SpeakerNotesOutlined/> },
    ],
  },
];

export const SideMenu = ({ open, isDesktop, onClose }: SideMenuProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const collapsed = isDesktop && !open;

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const menuStyle = (path: string) => {
    const active = isActive(path);

    return {
      flexDirection: collapsed ? "column" : "row",
      py: 1,
      px: collapsed ? 1 : 2,
      justifyContent: collapsed ? "center" : "flex-start",
      alignItems: "center",
      mx: 1.5,
      my: 0.5,
      borderRadius: "12px",
      color: active ? "primary.main" : "text.primary",
      bgcolor: active ? "secondary.main" : "transparent",
      "& .MuiListItemIcon-root": {
        color: active ? "primary.main" : "text.primary",
      },
      "&:hover": {
        bgcolor: active ? "secondary.main" : "rgba(151, 58, 168, 0.06)",
        color: "primary.main",
        "& .MuiListItemIcon-root": {
          color: "primary.main",
        },
      },
    };
  };

  const DraweList = (
    <Box
      role="presentation"
      sx={{
        width: collapsed ? collapsedWidth : drawerWidth,
        height: "100%",
        bgcolor: "background.paper",
        color: "text.primary",
        overflowX: "hidden",
        transition: "width 0.3s ease",
        "&::-webkit-scrollbar": {
          width: "4px",
        },
        "&::-webkit-scrollbar-track": {
          background: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#cfc4d8",
          borderRadius: "10px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          background: "#b5a5c0",
        },
      }}
      onClick={isDesktop ? undefined : onClose}
    >
      <Toolbar />
      {navGroups.map((group) => (
        <List
          key={group.title}
          dense
          subheader={
            !collapsed ? (
              <ListSubheader
                component="div"
                disableSticky
                sx={{
                  bgcolor: "transparent",
                  color: "text.secondary",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  lineHeight: "28px",
                  px: 3,
                  mt: 1,
                }}
              >
                {group.title}
              </ListSubheader>
            ) : undefined
          }
          sx={{ color: "text.primary", py: 0 }}
        >
          {group.items.map((item) => (
            <ListItemButton
              key={item.path}
              onClick={() => navigate(item.path)}
              sx={menuStyle(item.path)}
            >
              <ListItemIcon
                sx={{
                  minWidth: collapsed ? 0 : 40,
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                sx={{
                  display: collapsed ? "none" : "block",
                  ml: collapsed ? 0 : 1,
                }}
              />
            </ListItemButton>
          ))}
        </List>
      ))}
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
        onClose={isDesktop ? undefined : onClose}
        sx={{
          zIndex: (theme) => theme.zIndex.appBar - 1,
          "& .MuiDrawer-paper": {
            width: isDesktop
              ? open
                ? drawerWidth
                : collapsedWidth
              : drawerWidth,
            maxWidth: "82vw",
            boxSizing: "border-box",
            borderRight: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            transition: "width 0.3s ease",
            overflowX: "hidden",
          },
        }}
      >
        {DraweList}
      </Drawer>
    </Box>
  );
};

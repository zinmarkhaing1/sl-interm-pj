

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
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import NoteAltOutlinedIcon from '@mui/icons-material/NoteAltOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';


import { useNavigate,useLocation } from "react-router-dom";

const drawerWidth = 240;
const collapsedWidth = 72;

interface SideMenuProps {
  open: boolean;
  isDesktop: boolean;
  onClose: () => void;
}

export const SideMenu = ({ open, isDesktop, onClose }: SideMenuProps) => {
 
  const navigate = useNavigate();
  const location = useLocation();
  
  const menuStyle = (path:string) => ({
     flexDirection: isDesktop && !open ? "column" : "row",
  py: 1,
  px: isDesktop && !open ? 1 : 2,
  justifyContent: isDesktop && !open ? "center" : "flex-start",
  alignItems: "center",
  mx:2.5,
  my:0.5,
  borderRadius : "12px",

  color: location.pathname === path ? "#973aa8" : "text.primary",
 

  "& .MuiListItemIcon-root": {
    color: location.pathname === path ? "#973aa8" : "text.primary",
  },

  "&:hover": {
    
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
        
       bgcolor: "background.default",
        color:"text.primary",
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
      <List sx={{ color:"text.primary",}}>
        {/* dashboard  */}
          <ListItemButton
          onClick={() => navigate("/dashboard")}
           sx={menuStyle("/dashboard")}
         
        >
          <ListItemIcon
            sx={{
              minWidth: isDesktop && !open ? 0 : 40,
              justifyContent: "center",
              
            }}
          >
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText
            primary="Dashboard"
          sx={{
            display: isDesktop && !open ? "none" : "block",
            ml: isDesktop && !open ? 0 : 1,
          }}
/>
          
        </ListItemButton>
        {/* Home Page  */}
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
            <HomeOutlinedIcon sx={{fontSize:28}} />
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
          onClick={() => navigate("/note-create-form")}
           sx={menuStyle("/note-create-form")}
         
        >
          <ListItemIcon
            sx={{
              minWidth: isDesktop && !open ? 0 : 40,
              justifyContent: "center",
              
            }}
          >
            <NoteAltOutlinedIcon />
          </ListItemIcon>
          <ListItemText
            primary="New Notes"
          sx={{
            display: isDesktop && !open ? "none" : "block",
            ml: isDesktop && !open ? 0 : 1,
          }}
/>
          
        </ListItemButton>

        <ListItemButton
          onClick={() => navigate("/note-form")}
           sx={menuStyle("/note-form")}
         
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

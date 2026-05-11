// import React from 'react'

import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar,Divider } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import NoteIcon from "@mui/icons-material/Note";
import LabelIcon from "@mui/icons-material/Label";
import DeleteIcon from "@mui/icons-material/Delete";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";




const drawerWidth = 250;
export const SideMenu = () => {
  return (
    <Drawer variant="permanent" sx={{width:drawerWidth, flexShrink:0,"&.MuiDrawer-paper":{width:drawerWidth,boxSizing:"border-box"},bgcolor:'#c4e8f5'}}>
        <Toolbar/>
        <List >
            {/* dashboard  */}
            <ListItemButton>
                <ListItemIcon>
                    <DashboardIcon/>
                </ListItemIcon>
                <ListItemText primary="Dashboard"/>
            </ListItemButton>

            <Divider sx={{my:1}}/>
            {/* Categories  */}
            <ListItemButton>
                <ListItemIcon>
                    <LabelIcon/>
                </ListItemIcon>
                <ListItemText primary="Tags / Categories"/>
            </ListItemButton>

            {/* FlashCard  */}
            <ListItemButton>
                <ListItemIcon>
                    <NoteIcon/>
                </ListItemIcon>
                <ListItemText primary="FlashCard"/>
            </ListItemButton>

            {/* Trash  */}
            <ListItemButton>
                <ListItemIcon>
                    <DeleteIcon/>
                </ListItemIcon>
                <ListItemText primary="Trash"/>
            </ListItemButton>

            {/* logout  */}
            <ListItemButton>
                <ListItemIcon>
                    <ExitToAppIcon/>
                </ListItemIcon>
                <ListItemText primary="Logout"/>
            </ListItemButton>



        </List>
    </Drawer>
  )
}

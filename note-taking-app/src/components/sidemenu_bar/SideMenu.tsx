import React, {useState} from 'react'

import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar,Divider, Box, IconButton } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import NoteIcon from "@mui/icons-material/Note";
import LabelIcon from "@mui/icons-material/Label";
import DeleteIcon from "@mui/icons-material/Delete";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import MenuIcon from "@mui/icons-material/Menu";
import {  useNavigate } from 'react-router-dom';
// import { CategoriesPage } from '../tag_categories/CategoriesPage';


const drawerWidth = 200;
export const SideMenu = () => {
const [open,setOpen] = React.useState(false);
const toggleDrawer = (newOpen:boolean) =>()=> {
    setOpen(newOpen);
};
const navigate= useNavigate();


const DraweList = (
    <Box sx={{width:200, role:"presentation", bgcolor:'#c4e8f5'}}  onClick={toggleDrawer(false)}>
    <List>
            {/* dashboard  */}
            <ListItemButton>
                <ListItemIcon>
                    <DashboardIcon/>
                </ListItemIcon>
                <ListItemText onClick={() => navigate('/')} primary="Dashboard"/>
            </ListItemButton>

            <Divider sx={{my:1}}/>
            {/* Categories  */}
            <ListItemButton>
                <ListItemIcon>
                    <LabelIcon/>
                </ListItemIcon>
                <ListItemText onClick={() => navigate("/category")} primary="Tags / Categories"/>
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
</Box>
)
  return (
    <Box sx={{bgcolor:'#c4e8f5'}}>
    <IconButton onClick={toggleDrawer(true)} sx={{m:3}}><MenuIcon/></IconButton>
    <Drawer open={open} onClose={toggleDrawer(false)} variant="temporary" sx={{width:drawerWidth, flexShrink:0,"&.MuiDrawer-paper":{width:drawerWidth,boxSizing:"border-box"},}}>
        {/* <Toolbar/> */}
        {DraweList}
        
    </Drawer>
    </Box>
  )
}

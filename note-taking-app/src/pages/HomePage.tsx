// import React from 'react'
import { SideMenu } from "../components/sidemenu_bar/SideMenu"
import { HeaderBar } from "../components/header_bar/HeaderBar"
import { NoteCategory } from "../components/note_layout/NoteCategory"
import { Box } from "@mui/material"

export const HomePage = () => {
  return (
    <Box sx={{bgcolor:'#c4e8f5',width:'100%',minHeight:'100vh'}}>
      <Box sx={{display:'flex'}}>
      <SideMenu/>
      <Box sx={{flexGrow:1}}>
        <HeaderBar/>
        <Box sx={{p:2}}>
          <NoteCategory/>
        </Box>
      </Box>
    </Box>
    </Box>
  )
}

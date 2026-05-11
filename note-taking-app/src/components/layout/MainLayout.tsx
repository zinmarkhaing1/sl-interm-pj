import { Box } from "@mui/material"
import { HeaderBar } from "../header_bar/HeaderBar"
import { SideMenu } from "../sidemenu_bar/SideMenu"

export const MainLayout = () => {
    return(
        <Box sx={{display:'flex'}}>
            <HeaderBar/>
            <SideMenu/>
        </Box>
    )
}
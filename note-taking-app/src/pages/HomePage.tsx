
import { Box } from "@mui/material"
import { MainLayout } from "../components/layout/MainLayout"


export const HomePage = () => {
  return (
    <Box sx={{ bgcolor: "#dee4ea", minHeight: "100vh", width: "100%" }}>
      <MainLayout>
        <Box sx={{ width: "100%" }} />
      </MainLayout>
    </Box>
  )
}

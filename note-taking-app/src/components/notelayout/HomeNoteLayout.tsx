import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Fab, 
  Grid,
  CircularProgress
} from "@mui/material";


import { AutoStories,Add  } from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import { useGetNotesQuery } from "../../services/noteApi";
import { NoteLayout } from "./NoteLayout";




  



export const HomeNoteLayout = () => {
const navigate = useNavigate();
  const { data: notes = [], isLoading } = useGetNotesQuery();
  


  //   (Dashboard Stats)
  const totalNotes = notes.length;
  const highPriorityCount = notes.filter((n: any) => n.priority === "High").length;
  const todoCount = notes.filter((n: any) => n.task === "Todo" || n.task === "In Progress").length;
     if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }
  return (
     <Box sx={{ width: "100%" }}>
          
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{  color: "text.primary" }}>
            <AutoStories sx={{fontSize:"20px",mr:1,color:"#973aa8"}}/>
              My Workspace 
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Review your notes and tasks for today.
            </Typography>
          </Box>

       {/* Notes Grid Content */}
         <NoteLayout/>

           {/*  Dashboard Stats Cards */}

          <Box sx={{mt:2,width:"100%"}}>
          <Grid container  spacing={2}>
            {/*  Total Notes */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <Card sx={{ borderRadius: 3, boxShadow: "0px 4px 12px rgba(0,0,0,0.05)", borderLeft: "6px solid #37123c" }}>
                <CardContent>
                  <Typography variant="body2" color="textSecondary" sx={{ fontWeight: "600",color:"#6247aa" }}>Total Notes</Typography>
                  <Typography variant="h4" sx={{ fontWeight: "bold", mt: 1, color: "#37123c" }}>{totalNotes}</Typography>
                </CardContent>
              </Card>
            </Grid>
            
            
           
            <Grid size={{ xs: 12, sm: 4 }}>
              <Card sx={{ borderRadius: 3, boxShadow: "0px 4px 12px rgba(0,0,0,0.05)", borderLeft: "6px solid #6247aa" ,}}>
                <CardContent>
                  <Typography variant="body2" color="textSecondary" sx={{ fontWeight: "600",color:"#6247aa" }}>Urgent (High)</Typography>
                  <Typography variant="h4" sx={{ fontWeight: "bold", mt: 1, color: "#6247aa" }}>{highPriorityCount}</Typography>
                </CardContent>
              </Card>
            </Grid>

           
            <Grid size={{xs: 12, sm: 4}}>
              <Card sx={{ borderRadius: 3, boxShadow: "0px 4px 12px rgba(0,0,0,0.05)", borderLeft: "6px solid #a891bf" ,mb:2}}>
                <CardContent>
                  <Typography variant="body2" color="textSecondary" sx={{ fontWeight: "600",color:"#6247aa" }}>Tasks Remaining</Typography>
                  <Typography variant="h4" sx={{ fontWeight: "bold", mt: 1, color: "#a891bf" }}>{todoCount}</Typography>
                </CardContent>
              </Card>
            </Grid>
            </Grid>
            </Box>
           

     
          <Fab 
            color="primary" 
            aria-label="add-note"
            onClick={() => navigate("/note-form/create")}
            sx={{ 
              position: "fixed", 
              bottom: 32, 
              right: 32,
              boxShadow: "0px 6px 20px rgba(25, 118, 210, 0.4)"
            }}
          >
            <Add/>
          </Fab>

        </Box>
  )
}

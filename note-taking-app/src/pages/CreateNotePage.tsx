import React from "react";
import {
  Box,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import WorkIcon from '@mui/icons-material/Work';
import TaskIcon from "@mui/icons-material/Task";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import SchoolIcon from '@mui/icons-material/School';
import { useCreateNoteMutation } from "../services/noteApi";



export const CreateNotePage = () => {
  const [note, setNote] = useState({
    title: "",
    content: "",
    category: "",
    priority: "",
  });

  const [createNote,{isLoading}] = useCreateNoteMutation();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await createNote(note).unwrap();
    //   if (note.priority === "Important") {
    //   navigate("/important");
    // } else if (note.priority === "TodoList") {
    //   navigate("/todo");
    // } else {
    //   navigate("/category");
    // }
    navigate("/category");
    } catch(err:any) {
      console.log(err);
      
    }
    
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  
  return (
    
       <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width:'100%',
        bgcolor: "#ddecf1",
      }}
    >
      <Paper
        elevation={4}
        sx={{ width: 500, height: 550, p: 4, borderRadius: 4, m: 3,bgcolor: "#ddecf1" }}
      >
        <Stack
          direction="row"
          sx={{ justifyContent: "center", alignItems: "center", mb: 2 }}
        >
          <IconButton
            sx={{
              bgcolor: "#ddecf1",
              boxShadow: 1,
              mr: 2,
              alignItems: "center",
              py: 1,
              color:'black',
            }}
            onClick={() => navigate("/")}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              mb: 1,
              mt:2,
              textAlign: "center",
              color: "#293a4b",
            }}
          >
            Create Note
          </Typography>
          <IconButton
            sx={{
              bgcolor: "#ddecf1",
              boxShadow: 1,
              ml: 2,
              py:1,
              alignItems: "center",
              color:'black'
            }}
          >
            
            <NoteAddIcon/>
          </IconButton>
        </Stack>
        <Stack spacing={3}>
          <TextField
            label="Title"
            name="title"
            fullWidth
            placeholder="Note Title..."
            sx={{
              mb: 1,
              "&.MuiOtilinedInput-root": {
                bgcolor: "white",
                borderRadius: "18px",
              },
            }}
            value={note.title}
            onChange={handleChange}
            
          />
          <TextField
            label="Content"
            name="content"
            multiline
            rows={4}
            placeholder="Write your notes..."
            fullWidth
            value={note.content}
            onChange={handleChange}
            sx={{
              mb: 1,
              "&.MuiOutlinedInput-root": {
                bgcolor: "white",
                borderRadius: "24px",
              },
            }}
          />
          
          <TextField
            select
            label="Category"
            name="category"
            fullWidth
            value={note.category}
            onChange={handleChange}
            sx={{
              mb: 1,
              "&.MuiOtilinedInput-root": {
                bgcolor: "gray",
                borderRadius: "20px",
              },
            }}
          >
            <MenuItem value="My Note" ><TaskIcon sx={{color:'gray',m:1}}/>My Note</MenuItem>
            <MenuItem value="Company Note" ><WorkIcon sx={{color:'gray',m:1}}/>Company Note</MenuItem>
            <MenuItem value="Study" ><SchoolIcon sx={{color:'gray',m:1}}/>Study</MenuItem>
            <MenuItem value="Family & Friends"><FavoriteIcon sx={{color:'gray',m:1}}/>Family & Friends</MenuItem>
            <MenuItem value="Fitness & Health" ><FitnessCenterIcon sx={{color:'gray',m:1}}/>Fitness & Health</MenuItem>
          </TextField>
          <TextField
            select
            label="Priority"
            name="priority"
            fullWidth
            value={note.priority}
            onChange={handleChange}
            sx={{
              mb: 2,
              "&.MuiOtilinedInput-root": {
                bgcolor: "gray",
                borderRadius: "20px",
              },
            }}
          >
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="High">High</MenuItem>
          </TextField>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                borderRadius: "18px",
                py: 1.8,
                textTransform: "none",
                fontSize: "16px",
                bgcolor: "#a1acd9",
                fontWeight:'bold'
              }}
              onClick={handleSubmit}
              disabled={isLoading}
            >
              Save Note
            </Button>
            <Button
              variant="outlined"
              fullWidth
              sx={{
                borderRadius: "18px",
                py: 1.8,
                textTransform: "none",
                fontSize: "16px",
                bgcolor: "white",
                color: "gray",
                fontWeight:'bold'
              }}
            >
              Clear
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
   
   
  );
};

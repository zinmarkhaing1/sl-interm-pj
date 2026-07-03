import React,{useState} from 'react';
import {useNavigate} from "react-router-dom";
import { useCreateNoteMutation } from "../../services/noteApi";
import {Box, MenuItem,Paper,Button,Grid, Typography,TextField, Stack } from "@mui/material";

import EventNoteIcon from "@mui/icons-material/EventNote";
import DateRangeIcon from "@mui/icons-material/DateRange";
import TaskIcon from "@mui/icons-material/Task";
import WorkIcon from "@mui/icons-material/Work";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import SchoolIcon from "@mui/icons-material/School";




import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";

type DateTimeValue = Date | null;

export const NewProjectLayout = () => {
     const [note, setNote] = useState({
        title: "",
        description: "",
        category: "",
        priority: "",
        assignee: "",
        task:"",
        startDate: "",
        endDate: "",
      });
    
      const [startDate, setStartDate] = useState<DateTimeValue>(new Date());
      const [endDate, setEndDate] = useState<DateTimeValue>(new Date());
      const [taskError, setTaskError] = useState(false);
      const [categoryError, setCategoryError] = useState(false);
  const [titleError, setTitleError] = useState(false);

      const [createNote, { isLoading }] = useCreateNoteMutation();
      const navigate = useNavigate();
     
    
      const formatDate = (date: Date | null) => {
        if (!date) return "";
        const pad = (num: number) => String(num).padStart(2, "0");
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
      };

      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNote({ ...note, [e.target.name]: e.target.value });
        if (e.target.name === "title") setTitleError(false);
      };
    

      const handleTaskChange = (e: React.ChangeEvent<{ value: unknown }>) => {
      setNote({ ...note, task: e.target.value as string });
      setTaskError(false);
    };
    
      const handleSubmit = async () => {

        if (!note.title.trim()) {
      setTitleError(true);
      return;
    }
        if (!note.task){
          setTaskError(true);
        //   alert("Please select a Task Action!");
          return;
        }
        if(!note.category){
          setCategoryError(true);
          return;
        }
        try {
          const newNote = {
            title: note.title,
            category: note.category,
            priority: note.priority,
            assignee: note.assignee,
            content: note.description, 
            task: note.task, 
            startDate: formatDate(startDate), 
            endDate:formatDate(endDate),
          };
          console.log("Submitting Payload Data:", newNote);
          await createNote(newNote).unwrap();
    
          navigate("/note-form");
        } catch (err: any) {
          console.log(err);
        }
      };
      
      const handleClear = () => {
        setNote({
          title: "",
          description: "",
          category: "",
          priority: "",
          assignee: "",
          task:"",
          startDate: "",
          endDate: "",
        });
        setStartDate(new Date());
        setEndDate(new Date());
        setTaskError(false);
        setTitleError(false);
        setCategoryError(false);
        // navigate("/note-form")
        navigate(-1);
          // onClick={() => navigate(-1)} 
      };


      const modernField = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",
    backgroundColor: "#fafafa",
    transition: ".2s",

    "& fieldset": {
      borderColor: "#ececec",
    },

    "&:hover fieldset": {
      borderColor: "#d5b8ea",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#973aa8",
      borderWidth: "1px",
    },
  },

  "& .MuiInputLabel-root": {
    color: "#777",
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: "#973aa8",
  },
};
    
      
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight:{xs:"auto",sm:"65vh"},
        width: "100%",
        backgroundColor: "#f4f6f8", 
        
      }}
    >
      {/* Notion Modern Card Layout */}
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 620,
          height:"auto",
          minHeight:100,
          p:1.5,
          px:2,
          py:1.5,
          borderRadius: "20px",
          bgcolor: "#fff",
          border: "1px solid #eef1f6",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.02)", 
        }}
      >
        {/* Header Section */}
        <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 2}}>
          <Box
    sx={{
        width:44,
        height:44,
        borderRadius:"14px",
        bgcolor:"#f5ebfa",
        display:"flex",
        alignItems:"center",
        justifyContent:"center"
    }}
>
    <EventNoteIcon
        sx={{
            color:"#973aa8",
            fontSize:24
        }}
    />
</Box>
          <Box>
            <Typography variant="h6" sx={{ fontSize:"16px", color: "#1e293b", letterSpacing: "-0.5px" }}>
              Project Note Details
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b", mt: 0.2 }}>
              Enter organized project note details.
            </Typography>
          </Box>
        </Stack>

        {/* Form Fields Grid */}
        <Grid  container
    rowSpacing={2.2}
    columnSpacing={2}>
          
          {/* Note Title */}
          <Grid size={{ xs: 10, sm: 6 }}>
            <TextField
              label="Note Title"
              name="title"
              fullWidth
              required
              placeholder="Enter project note title..."
              value={note.title}
              onChange={handleChange}
              error={titleError}
              helperText={titleError ? "Title is required" : ""}
              sx={modernField}
            />
          </Grid>

          {/* Category */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
             select
              label="Category"
              name="category"
              fullWidth
             required
              value={note.category}
              error={categoryError}
              helperText={categoryError ? "Please select a category":""}
              onChange={handleChange}
              sx={modernField}
            >
                <MenuItem value="My Note">
                  <TaskIcon sx={{ color: "#dec9e9",mr:1 }} />
                  My Note
                </MenuItem>
                <MenuItem value="Company Note">
                  <WorkIcon sx={{ color: "#dec9e9", mr:1 }} />
                  Company Note
                </MenuItem>
                <MenuItem value="Study">
                  <SchoolIcon sx={{ color: "#dec9e9",mr:1 }} />
                  Study
                </MenuItem>
                <MenuItem value="Family & Friends">
                  <FavoriteIcon sx={{ color: "#dec9e9" , mr:1 }} />
                  Family & Friends
                </MenuItem>
                <MenuItem value="Fitness & Health">
                  <FitnessCenterIcon sx={{ color: "#dec9e9" ,mr:1}} />
                  Fitness & Health
                </MenuItem>
            </TextField>
          </Grid>

          {/* Status Dropdown (task) */}
          <Grid size={{ xs: 12, sm: 4 }}>

            <TextField
              select
              label="Status / Action"
              name="task"
              fullWidth
              required
              value={note.task}
              onChange={handleTaskChange}
              error={taskError}
              helperText={taskError ? "Please select a status action" : ""}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            >
              <MenuItem value="Todo">Todo</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Complete">Complete</MenuItem>
              <MenuItem value="Done">Done</MenuItem>
            </TextField>
          </Grid>

          {/* Priority Dropdown */}
          <Grid size={{ xs: 12, sm: 4}}>
            
            <TextField
              select
              label="Priority"
              name="priority"
              fullWidth
              required
              value={note.priority}
              onChange={handleChange}
              sx={modernField}
            >
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </TextField>
          </Grid>

          {/* Assignee */}
          <Grid size={{ xs: 12, sm: 4 }}>
            
            <TextField
              label="Assignee"
              name="assignee"
              required
              fullWidth
              placeholder="Name or Email"
              value={note.assignee}
              onChange={handleChange}
              sx={modernField}
              
            >
               
            </TextField>
          </Grid>

          {/* Description / Content */}
          <Grid size={{ xs: 12,}} sx={{mt:1}}>
            <TextField
              label="Description / Content"
              name="description"
              multiline
              rows={2}
              fullWidth
              placeholder="Write your notes or project scope details here..."
              value={note.description}
              onChange={handleChange}
              sx={modernField}
            />
          </Grid>

          {/* Start Date & Time */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box>
              <Typography variant="caption" sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1, color: "#475569", fontWeight: 600, pl: 0.5 ,fontSize:13}}>
                <DateRangeIcon sx={{ fontSize: 15, color: "#64748b" }} /> Start Date & Time
              </Typography>
              <Box className="custom-picker-wrapper" sx={{ width: "100%" }}>
                <DateTimePicker
                  onChange={(val) => setStartDate(val as DateTimeValue)}
                  value={startDate}
                  format="y-MM-dd h:mm a"
                  clearIcon={null}
                  required

                />
              </Box>
            </Box>
          </Grid>

          {/* End Date & Time */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box>
              <Typography variant="caption" sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1, color: "#475569", fontWeight: 600, pl: 0.5 ,fontSize:13}}>
                <DateRangeIcon sx={{ fontSize: 15, color: "#64748b" }} /> End Date & Time
              </Typography>
              <Box className="custom-picker-wrapper" sx={{ width: "100%" }}>
                <DateTimePicker
                  onChange={(val) => setEndDate(val as DateTimeValue)}
                  value={endDate}
                  format="y-MM-dd h:mm a"
                  clearIcon={null}
                  required
                />
              </Box>
            </Box>
          </Grid>

          {/* Action Buttons */}
          <Grid size={{ xs: 12 }} sx={{ mt: 2}}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ justifyContent: "flex-end" }}>
              <Button
                variant="text"
                onClick={handleClear}
                sx={{
                  borderRadius: "10px",
                  px: 4,
                  py: 1.3,
                  textTransform: "none",
                  fontSize: "15px",
                  color: "#64748b",
                  fontWeight: 600,
                  "&:hover": { bgcolor: "#dec9e9" ,color:"#121212"}
                }}
              >
                Clear Form
              </Button>
              <Button
                variant="contained"
                disableElevation
                onClick={handleSubmit}
                disabled={isLoading}
                sx={{
                  borderRadius: "10px",
                  px: 5,
                  py: 1.3,
                  textTransform: "none",
                  fontSize: "15px",
                  bgcolor: "#dec9e9", // Modern Royal Indigo Color
                  color: "#121212",
                  fontWeight: 600,
                  "&:hover": { bgcolor: "#973aa8",color:"#ffff" },
                }}
              >
                {isLoading ? "Saving..." : "Save Note"}
              </Button>
            </Stack>
          </Grid>

        </Grid>
      </Paper>
    </Box>
  )
}

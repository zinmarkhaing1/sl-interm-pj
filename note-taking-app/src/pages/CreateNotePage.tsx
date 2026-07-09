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
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import WorkIcon from "@mui/icons-material/Work";
import TaskIcon from "@mui/icons-material/Task";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import SchoolIcon from "@mui/icons-material/School";
import { useCreateNoteMutation } from "../services/noteApi";


import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";


type DateTimeValue = Date | null;

export const CreateNotePage = () => {
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

  const [createNote, { isLoading }] = useCreateNoteMutation();
  const navigate = useNavigate();
  const [taskError, setTaskError] = useState(false);


  const formatDate = (date: Date | null) => {
    if (!date) return "";
    const pad = (num: number) => String(num).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };

  const handleSubmit = async () => {
    if (!note.task){
      setTaskError(true);
      alert("Please select a Task Action!");
      return;
    }
    try {
      const newNote = {
        // ...note,
        // content: note.description,
        // task : note.task,
        // startDate: startDate ? startDate.format("YYYY-MM-DD") : "",
        // endDate: endDate ? endDate.format("YYYY-MM-DD") : "",
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNote({ ...note, [e.target.name]: e.target.value });
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
    navigate(-1);
  };

  const handleTaskChange = (e: React.ChangeEvent<{ value: unknown }>) => {
  setNote({ ...note, task: e.target.value as string });
  setTaskError(false);
};

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: { xs: "auto", md: "calc(100vh - 112px)" },
        width: "100%",
        bgcolor: "background.default",
        color:"text.primary"
        // backgroundColor:"#f4f6f8"
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 550,
          minHeight: { xs: "auto", sm: 500 },
          p: { xs: 2, sm: 4 },
          borderRadius: 4,
          m: { xs: 0, sm: 3 },
          bgcolor: "background.default",
          color:"text.primary"
        }}
      >
        <Stack
          direction="row"
          sx={{ justifyContent: "center", alignItems: "center", mb: 2 }}
        >
          <IconButton
            sx={{
              color: "#973aa8",
              ml: 2,
              alignItems: "center",
              fontWeight: "bold",
            }}
          >
            <NoteAddIcon />
          </IconButton>
          <Typography
            variant="h6"
            sx={{
              // fontWeight: "bold",
              mb: 1,
              mt: 2,
              textAlign: "center",
              color: "#293a4b",
              // fontSize: { xs: "1.75rem", sm: "2.125rem" },
              fontSize:"18px"
            }}
          >
            Create Note Form
          </Typography>
        </Stack>
        <Stack spacing={3}>
          <Stack spacing={2} direction="row">
            <TextField
              label="Title"
              name="title"
              fullWidth
              placeholder="Note Title..."
              sx={{
                "&.MuiOtilinedInput-root": {
                  bgcolor: "background.default",
                  borderRadius: "18px",

                },
                fontSize:"16px"
              }}
              value={note.title}
              onChange={handleChange}
            />
            <TextField
              select
              label="Priority"
              name="priority"
              fullWidth
              value={note.priority}
              onChange={handleChange}
              sx={{
                "&.MuiOtilinedInput-root": {
                  bgcolor: "background.default",
                  borderRadius: "20px",
                },
                fontSize:"16px",
                bgcolor:"background.default",
                color:'text.primary'
              }}
            >
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </TextField>
          </Stack>
          <Stack spacing={2} direction="row">
            <TextField
              label="Description"
              name="description"
              multiline
              rows={3}
              placeholder="Write your notes..."
              value={note.description}
              onChange={handleChange}
              sx={{
                "&.MuiOutlinedInput-root": {
                  bgcolor: "background.default",
                  borderRadius: "24px",
                },
                width: "500px",
                height: "auto",
                fontSize:"16px",
                  bgcolor: "background.default",
                  color:"text.primary",
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
                  "&.MuiOtilinedInput-root": {
                    bgcolor: "background.default",
                    borderRadius: "20px",
                  },
                  fontSize:"16px",
                  bgcolor: "background.default",
                  color:"text.primary"
                }}
              >
                <MenuItem value="My Note">
                  <TaskIcon sx={{ color: "gray" }} />
                  My Note
                </MenuItem>
                <MenuItem value="Company Note">
                  <WorkIcon sx={{ color: "gray" }} />
                  Company Note
                </MenuItem>
                <MenuItem value="Study">
                  <SchoolIcon sx={{ color: "gray" }} />
                  Study
                </MenuItem>
                <MenuItem value="Family & Friends">
                  <FavoriteIcon sx={{ color: "gray" }} />
                  Family & Friends
                </MenuItem>
                <MenuItem value="Fitness & Health">
                  <FitnessCenterIcon sx={{ color: "gray" }} />
                  Fitness & Health
                </MenuItem>
              </TextField>
          </Stack>

          {/* //status and assignee */}
          <Stack spacing={2} direction="row">
            <TextField
                select
                label="Status"
                name="task"
                fullWidth
                value={note.task}
                onChange={handleTaskChange}
                error={taskError}
                sx={{
                  "&.MuiOtilinedInput-root": {
                    bgcolor: "background.default",
                    borderRadius: "20px",
                  },
                  bgcolor: "background.default",
                  fontSize:"16px",
                  color:"text.primary"
                }}
              >
                <MenuItem value="Todo">
                  Todo
                </MenuItem>
                <MenuItem value="In Progress">
                  In Progress 
                </MenuItem>
                <MenuItem value="Complete">
                  Complete
                </MenuItem>
                <MenuItem value="Not Started">Not Started
                </MenuItem>
              </TextField>
             <TextField
                label="Assignee"
                name="assignee"
                fullWidth
                placeholder="Note Assignee..."
                sx={{
                  "&.MuiOtilinedInput-root": {
                    bgcolor: "background.default",
                    borderRadius: "18px",
                  },
                  fontSize:"16px"
                }}
                value={note.assignee}
                onChange={handleChange}
              />

          </Stack>
          <Stack spacing={2} direction="row" sx={{m:2}}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" sx={{ display: "block", mb: 0.5, color: "text.secondary", fontWeight: 500, pl: 1 }}>
                Start Date & Time
              </Typography>
              <Box className="custom-picker-wrapper">
                <DateTimePicker
                  onChange={(val) => setStartDate(val as DateTimeValue)}
                  value={startDate}
                  format="y-MM-dd h:mm a"
                  clearIcon={null}
                  
                />
              </Box>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" sx={{ display: "block", mb: 0.5, color: "text.secondary", fontWeight: 500, pl: 1 }}>
                End Date & Time
              </Typography>
              <Box className="custom-picker-wrapper">
                <DateTimePicker
                  onChange={(val) => setEndDate(val as DateTimeValue)}
                  value={endDate}
                  format="y-MM-dd h:mm a"
                  clearIcon={null}
                  
                />
              </Box>
            </Box>
          </Stack>

          
          {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Stack spacing={2} direction="row">
              <DateTimePicker
                label="Start Date & Time"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    sx: { "& .MuiOutlinedInput-root": { borderRadius: "18px" } }
                  }
                }}
                  />
              <DateTimePicker
                label="End Date & Time"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
               slotProps={{
                  textField: {
                    fullWidth: true,
                    sx: { "& .MuiOutlinedInput-root": { borderRadius: "18px" } }
                  }
                }}
              />
            </Stack>
          </LocalizationProvider> */}

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                borderRadius: "18px",
                py: 1.8,
                textTransform: "none",
                fontSize: "16px",
                bgcolor: "background.default",
                fontWeight: "bold",
              }}
              onClick={handleSubmit}
              disabled={isLoading}
            >
              Save Note
            </Button>
            <Button
              variant="outlined"
              fullWidth
              onClick={handleClear}
              sx={{
                borderRadius: "18px",
                py: 1.8,
                textTransform: "none",
                fontSize: "16px",
                bgcolor: "white",
                color: "gray",
                fontWeight: "bold",
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

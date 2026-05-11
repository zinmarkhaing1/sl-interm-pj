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
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";

export const CreateNotePage = () => {
  const [note, setNote] = useState({
    title: "",
    content: "",
    category: "",
    priority: "",
  });
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (note.priority === "Important") {
      navigate("/important");
    } else if (note.priority === "TodoList") {
      navigate("/todo");
    } else {
      navigate("/notes");
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
        height: "150vh",
        bgcolor: "#c4e8f5",
        overflow: "hidden",
      }}
    >
      <Paper
        elevation={4}
        sx={{ width: 500, height: 700, p: 4, borderRadius: 4, m: 3 }}
      >
        <Stack
          direction="row"
          sx={{ justifyContent: "center", alignItems: "center", mb: 2 }}
        >
          <IconButton
            sx={{
              bgcolor: "white",
              boxShadow: 1,
              mr: 2,
              alignItems: "center",
              py: 1,
            }}
            onClick={() => navigate("/")}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              mb: 3,
              textAlign: "center",
              color: "#3a89d7",
            }}
          >
            Create Note
          </Typography>
          <IconButton
            sx={{
              bgcolor: "white",
              boxShadow: 1,
              ml: 2,
              alignItems: "center",
              py: 1,
            }}
          >
            <NotificationsNoneIcon />
          </IconButton>
        </Stack>
        <Stack spacing={3}>
          <TextField
            label="Title"
            name="title"
            fullWidth
            placeholder="Note Title..."
            sx={{
              mb: 2,
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
            rows={5}
            placeholder="Write your notes..."
            fullWidth
            value={note.content}
            onChange={handleChange}
            sx={{
              mb: 2,
              "&.MuiOutlinedInput-root": {
                bgcolor: "white",
                borderRadius: "24px",
              },
            }}
          />
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <Button
              startIcon={<LocalOfferOutlinedIcon />}
              sx={{
                bgcolor: "white",
                color: "black",
                borderRadius: "20px",
                textTransform: "none",
                px: 2,
              }}
            >
              Add Tag
            </Button>
            <Button
              startIcon={<FolderOpenOutlinedIcon />}
              sx={{
                bgcolor: "white",
                color: "black",
                borderRadius: "20px",
                textTransform: "none",
                px: 2,
              }}
            >
              Category
            </Button>
          </Stack>
          <TextField
            select
            label="Category"
            name="category"
            fullWidth
            value={note.category}
            onChange={handleChange}
            sx={{
              mb: 2,
              "&.MuiOtilinedInput-root": {
                bgcolor: "white",
                borderRadius: "20px",
              },
            }}
          >
            <MenuItem value="Note">My Note</MenuItem>
            <MenuItem value="Company">My Company</MenuItem>
            <MenuItem value="Study">Study</MenuItem>
            <MenuItem value="Family&Friends">Family & Friends</MenuItem>
            <MenuItem value="Fitness&Health">Fitness&Health</MenuItem>
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
                bgcolor: "white",
                borderRadius: "20px",
              },
            }}
          >
            <MenuItem value="TodoList">TodoList</MenuItem>
            <MenuItem value="Important">Important</MenuItem>
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
                bgcolor: "#4f6df5",
              }}
              onClick={handleSubmit}
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

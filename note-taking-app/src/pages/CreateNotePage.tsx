import React, { useState } from "react";
import {
  Box,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import WorkIcon from "@mui/icons-material/Work";
import TaskIcon from "@mui/icons-material/Task";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import SchoolIcon from "@mui/icons-material/School";
import { useCreateNoteMutation } from "../services/noteApi";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { type Dayjs } from "dayjs";

const CATEGORIES = [
  { value: "My Note", icon: <TaskIcon fontSize="small" color="action" /> },
  { value: "Company Note", icon: <WorkIcon fontSize="small" color="action" /> },
  { value: "Study", icon: <SchoolIcon fontSize="small" color="action" /> },
  {
    value: "Family & Friends",
    icon: <FavoriteIcon fontSize="small" color="action" />,
  },
  {
    value: "Fitness & Health",
    icon: <FitnessCenterIcon fontSize="small" color="action" />,
  },
];

const PRIORITIES = ["Low", "Medium", "High"];
const STATUSES = ["Todo", "In Progress", "Complete", "Not Started"];

export const CreateNotePage = () => {
  const [note, setNote] = useState({
    title: "",
    description: "",
    category: "",
    priority: "",
    assignee: "",
    task: "",
  });

  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());
  const [createNote, { isLoading }] = useCreateNoteMutation();
  const navigate = useNavigate();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const formatDate = (date: Dayjs | null) => {
    if (!date || !date.isValid()) return "";
    return date.format("YYYY-MM-DD HH:mm:ss");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNote({ ...note, [e.target.name]: e.target.value });
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!note.title.trim()) errors.title = "Title is required";
    if (!note.task) errors.task = "Please select a status";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    try {
      await createNote({
        title: note.title,
        category: note.category,
        priority: note.priority,
        assignee: note.assignee,
        content: note.description,
        task: note.task,
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
      }).unwrap();
      navigate("/note-form");
    } catch (err: any) {
      setSubmitError(
        err?.data?.message || err?.message || "Failed to create note"
      );
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ maxWidth: 640, mx: "auto", width: "100%", py: 1 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 4 },
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
            <NoteAddIcon color="primary" />
            <Typography variant="h5" fontWeight={700}>
              Create note
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Capture the basics, then set status, people, and schedule.
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={2.5}>
              <TextField
                label="Title"
                name="title"
                placeholder="Note title"
                value={note.title}
                onChange={handleChange}
                error={!!fieldErrors.title}
                helperText={fieldErrors.title}
                required
                disabled={isLoading}
              />

              <TextField
                label="Description"
                name="description"
                multiline
                rows={4}
                placeholder="Write your notes..."
                value={note.description}
                onChange={handleChange}
                disabled={isLoading}
              />

              <Divider />

              <Typography variant="subtitle2" color="text.secondary">
                Details
              </Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  select
                  label="Category"
                  name="category"
                  value={note.category}
                  onChange={handleChange}
                  disabled={isLoading}
                >
                  {CATEGORIES.map((cat) => (
                    <MenuItem key={cat.value} value={cat.value}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        {cat.icon}
                        <span>{cat.value}</span>
                      </Stack>
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  label="Priority"
                  name="priority"
                  value={note.priority}
                  onChange={handleChange}
                  disabled={isLoading}
                >
                  {PRIORITIES.map((p) => (
                    <MenuItem key={p} value={p}>
                      {p}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  label="Status"
                  name="task"
                  value={note.task}
                  onChange={handleChange}
                  error={!!fieldErrors.task}
                  helperText={fieldErrors.task}
                  required
                  disabled={isLoading}
                >
                  {STATUSES.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>

              <TextField
                label="Assignee"
                name="assignee"
                placeholder="Who is responsible?"
                value={note.assignee}
                onChange={handleChange}
                disabled={isLoading}
              />

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <DateTimePicker
                  label="Start date & time"
                  value={startDate}
                  onChange={(val) => setStartDate(val)}
                  disabled={isLoading}
                  slotProps={{
                    textField: { fullWidth: true },
                  }}
                />
                <DateTimePicker
                  label="End date & time"
                  value={endDate}
                  onChange={(val) => setEndDate(val)}
                  disabled={isLoading}
                  slotProps={{
                    textField: { fullWidth: true },
                  }}
                />
              </Stack>

              {submitError && <Alert severity="error">{submitError}</Alert>}

              <Divider />

              <Stack
                direction="row"
                spacing={1.5}
                justifyContent="flex-end"
              >
                <Button
                  color="inherit"
                  onClick={() => navigate(-1)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isLoading}
                  startIcon={
                    isLoading ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : undefined
                  }
                  sx={{ px: 3 }}
                >
                  {isLoading ? "Saving..." : "Create note"}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};
